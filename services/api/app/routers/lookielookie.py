import os
from datetime import datetime as dt
from datetime import timedelta as td
import pandas as pd
import numpy as np
import json
from pymongo import MongoClient
from fastapi import APIRouter, Request


router = APIRouter()

uri = f"mongodb://{os.environ['MONGO_USER']}:{os.environ['MONGO_USER_PW']}@{os.environ['MONGO_IP']}:{os.environ['MONGO_PORT']}/default?authSource={os.environ['MONGO_AUTH_SOURCE']}"
client = MongoClient(uri)
db = client.superguppy

proj = {
    "quoteType.symbol": 1,
    "quoteType.shortName": 1,
    "assetProfile.sector": 1,
    "assetProfile.industry": 1,
    "summaryDetail.marketCap": 1,
    "defaultKeyStatistics.enterpriseValue": 1,
    "summaryDetail.trailingPE": 1,
    "summaryDetail.forwardPE": 1,
    "defaultKeyStatistics.pegRatio": 1,
    "summaryDetail.priceToSalesTrailing12Months": 1,
    "defaultKeyStatistics.priceToBook": 1,
    "defaultKeyStatistics.enterpriseToRevenue": 1,
    "defaultKeyStatistics.enterpriseToEbitda": 1,
    "defaultKeyStatistics.lastFiscalYearEnd": 1,
    "defaultKeyStatistics.nextFiscalYearEnd": 1,
    "defaultKeyStatistics.mostRecentQuarter": 1,
    "defaultKeyStatistics.profitMargins": 1,
    "financialData.operatingMargins": 1,
    "financialData.returnOnAssets": 1,
    "financialData.returnOnEquity": 1,
    "financialData.totalRevenue": 1,
    "financialData.revenuePerShare": 1,
    "financialData.revenueGrowth": 1,
    "financialData.ebitda": 1,
    "defaultKeyStatistics.netIncomeToCommon": 1,
    "defaultKeyStatistics.trailingEps": 1,
    "defaultKeyStatistics.earningsQuarterlyGrowth": 1,
    "financialData.totalCash": 1,
    "financialData.totalCashPerShare": 1,
    "financialData.totalDebt": 1,
    "financialData.debtToEquity": 1,
    "financialData.currentRatio": 1,
    "financialData.quickRatio": 1,
    "financialData.operatingCashflow": 1,
    "financialData.freeCashflow": 1,
    "defaultKeyStatistics.beta": 1,
    "defaultKeyStatistics.52WeekChange": 1,
    "defaultKeyStatistics.SandP52WeekChange": 1,
    "summaryDetail.fiftyTwoWeekHigh": 1,
    "summaryDetail.fiftyTwoWeekLow": 1
}

@router.get("/avgs")
async def avgs():
    d = dict(proj)
    del d["assetProfile.sector"]
    del d["assetProfile.industry"]

    # Aggregation pipeline for 'sector'
    pipeline_sector = [
        {
            "$group": {
                **{"_id": "$assetProfile.sector"},
                **{k.split(".")[-1]: {"$avg": f"${k}"} for k in d.keys()}
            }
        },
        {
            "$project": {
                **{"_id": 0, "sector": "$_id"},
                **{k.split(".")[-1]: 1 for k in d.keys()}
            }
        }
    ]

    result_sector = pd.DataFrame(db.fundamentals.aggregate(pipeline_sector))

    # Aggregation pipeline for 'industry'
    pipeline_industry = [
        {
            "$group": {
                **{"_id": "$assetProfile.industry"},
                **{k.split(".")[-1]: {"$avg": f"${k}"} for k in d.keys()}
            }
        },
        {
            "$project": {
                **{"_id": 0, "industry": "$_id"},
                **{k.split(".")[-1]: 1 for k in d.keys()}
            }
        }
    ]

    result_industry = pd.DataFrame(db.fundamentals.aggregate(pipeline_industry))

    return {
        "sector": result_sector.fillna('nan').set_index("sector").to_dict("index"),
        "industry": result_industry.fillna('nan').set_index("industry").to_dict("index")
    }


@router.get("/fundamentals")
async def fundamentals(
    tickers: str
):
    tickers = tickers.split(",")
    tdf = (
        pd.DataFrame(
            db.fundamentals.find(
                {"quoteType.symbol": {"$in": tickers}},
                {
                    **{"_id":0},
                    **proj
                }
            )
        )
    )

    df = (
        pd.concat(
            [
                tdf.quoteType.apply(pd.Series),
                tdf.assetProfile.apply(pd.Series),
                tdf.defaultKeyStatistics.apply(pd.Series),
                tdf.summaryDetail.apply(pd.Series),
                tdf.financialData.apply(pd.Series)
            ],
            axis=1
        )
        .set_index("symbol")
        .reindex(tickers)
        .reset_index()
        .replace([np.nan, np.inf, -np.inf], 'nan')
    )

    return df.to_dict("records")
    
    

@router.get("/changes")
async def name(
    year: int,
    month: int,
    day: int,
):
    EMPTY_RES = {
            "SHORT_TO_LONG": [],
            "LONG_TO_SHORT": [],
            "LONG_TO_LONG":[],
            "SHORT_TO_SHORT": [],
        }

    try:
        end_date = dt(year,month,day)
    except Exception as e:
        return {}
    
    aapl_db = db.timeseries.find_one({"date": end_date, "ticker": "AAPL"})
    if aapl_db is None:
        return EMPTY_RES

    changes_db = db.changes.find_one({"date": end_date}, {"_id": 0, "date": 0})
    if changes_db is not None:
        return changes_db

    # Calculate 10 days before the date of interest
    start_date = end_date - td(days=6)

    pipeline = [
        {
            "$match": {
            "date": {
                "$gte": start_date,  # 10 days before the date of interest
                "$lte": end_date     # The date of interest
            },
            }
        },
        {
            "$sort": {
            "ticker": 1,
            "date": -1
            }
        },
        {
            "$group": {
            "_id": "$ticker",
            "docs": { "$push": "$$ROOT" }
            }
        },
        {
            "$project": {
            "docs": { "$slice": ["$docs", 2] }  # Keep only the last two documents
            }
        },
        {
            "$unwind": "$docs"
        },
        {
            "$replaceRoot": { "newRoot": "$docs" }
        },
        {
            "$project": {
                "_id": 0,
                "ticker": 1,
                "signals.lookielookie_10_2": 1,
                "date": 1
            }
        }
    ]

    res = db.timeseries.aggregate(pipeline)

    df = (
        pd
        .json_normalize(json.loads(pd.DataFrame(res).to_json(orient="records")))
        .assign(
            date=lambda df: pd.to_datetime(df.date, unit="ms"),
        )
        .rename(columns={"signals.lookielookie_10_2.supertrend":"supertrend","signals.lookielookie_10_2.cnt":"cnt"})
        .set_index("date")
    )

    r = (
        df
        .groupby("ticker", as_index=False)
        .agg(
            supertrend_t0=pd.NamedAgg(column="supertrend",aggfunc="first"),
            supertrend_t1=pd.NamedAgg(column="supertrend",aggfunc="last"),
            cnt_t0=pd.NamedAgg(column="cnt",aggfunc="first"),
            cnt_t1=pd.NamedAgg(column="cnt",aggfunc="last"),
        )
        [["ticker","supertrend_t0","supertrend_t1","cnt_t0","cnt_t1"]]
    )

    if end_date in df.index.unique():
        res = {
            "SHORT_TO_LONG": r.loc[lambda df: (df.supertrend_t0==1) & (df.supertrend_t1==-1)].to_dict("records"),
            "LONG_TO_SHORT": r.loc[lambda df: (df.supertrend_t0==-1) & (df.supertrend_t1==1)].to_dict("records"),
            "LONG_TO_LONG": r.loc[lambda df: (df.supertrend_t0==1) & (df.supertrend_t1==1)].to_dict("records"),
            "SHORT_TO_SHORT": r.loc[lambda df: (df.supertrend_t0==-1) & (df.supertrend_t1==-1)].to_dict("records"),
        }
    else:
        res = EMPTY_RES
    
    db.changes.insert_one(
        {
            **{"date": end_date},
            **res
        }
    )

    return res


@router.get("/atr")
async def get_atr(ticker: str):
    res = pd.DataFrame(
        db
        .timeseries
        .find(
            {"ticker": ticker.upper()},
            {"_id":0, "date": 1, "ticker": 1, "adjclose": 1, "indicators.atr_10": 1}
        )
        .sort("date", -1)
        .limit(1)
    )

    return res.to_dict("records")[0]

@router.get("/get_reminders")
async def get_reminders(mail: str):
    reminders = (
        db
        .reminders
        .find(
            {"mail": mail},
            {"_id": 0, "mail": 0}
        )
    )

    res = []
    for reminder in reminders:
        price = (
            db
            .timeseries
            .find({"ticker": reminder["ticker"]}, {"_id": 0, "adjclose": 1})
            .sort("date", -1)
            .limit(1)
        )[0]["adjclose"]
        triggered = eval(f"{price}{reminder['operator']}{reminder['price']}")
        res.append({**reminder,**{"triggered": triggered}})

    return sorted(res, key=lambda f: f["triggered"]==False)

@router.get("/set_reminder")
async def set_reminder(mail: str, ticker: str, operator: str, price: float):
    ins = (
        db
        .reminders
        .update_one(
            {"mail": mail, "ticker": ticker, "operator": operator, "price": price},
            {"$set": {"mail": mail, "ticker": ticker, "operator": operator, "price": price}},
            upsert=True
        )
    )

    return True

@router.get("/remove_reminder")
async def set_reminder(mail: str, ticker: str, operator: str, price: float):
    rem = (
        db
        .reminders
        .delete_one(
            {"mail": mail, "ticker": ticker, "operator": operator, "price": price}
        )
    )

    return True

@router.get("/get_valid_dates")
async def get_valid_dates():
    res = db.timeseries.find({"ticker": "AAPL"}, {"_id": 0, "date": 1})

    return [x["date"] for x in res]

@router.get("/")
async def root(request: Request):
    """Just a message to return something on the home endpoint"""
    return "LookieLookie entrypoint"