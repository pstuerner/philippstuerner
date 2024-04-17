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
    try:
        end_date = dt(year,month,day)
    except Exception as e:
        return {}

    # Calculate 10 days before the date of interest
    start_date = end_date - td(days=6)

    pipeline = [
        {
            "$match": {
            "date": {
                "$gte": start_date,  # 10 days before the date of interest
                "$lte": end_date     # The date of interest
            }
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
                "signals": 1,
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
        .rename(columns={"signals.LONG":"LONG","signals.SHORT":"SHORT","signals.SIDE":"SIDE"})
        .set_index("date")
    )

    r = (
        df
        .groupby("ticker", as_index=False)
        .agg(
            LONG_t0=pd.NamedAgg(column="LONG",aggfunc="first"),
            LONG_t1=pd.NamedAgg(column="LONG",aggfunc="last"),
            SHORT_t0=pd.NamedAgg(column="SHORT",aggfunc="first"),
            SHORT_t1=pd.NamedAgg(column="SHORT",aggfunc="last"),
            SIDE_t0=pd.NamedAgg(column="SIDE",aggfunc="first"),
            SIDE_t1=pd.NamedAgg(column="SIDE",aggfunc="last"),
        )
        [["ticker","LONG_t0", "LONG_t1","SHORT_t0", "SHORT_t1","SIDE_t0", "SIDE_t1"]]
    )

    if end_date in df.index.unique():
        res = {
            "SIDE_TO_LONG": r.loc[lambda df: df.LONG_t0 & df.SIDE_t1].ticker.tolist(),
            "LONG_TO_SIDE": r.loc[lambda df: df.SIDE_t0 & df.LONG_t1].ticker.tolist(),
            "LONG_TO_LONG": r.loc[lambda df: df.LONG_t0 & df.LONG_t1].ticker.tolist(),

            "SIDE_TO_SHORT": r.loc[lambda df: df.SHORT_t0 & df.SIDE_t1].ticker.tolist(),
            "SHORT_TO_SIDE": r.loc[lambda df: df.SIDE_t0 & df.SHORT_t1].ticker.tolist(),
            "SHORT_TO_SHORT": r.loc[lambda df: df.SHORT_t0 & df.SHORT_t1].ticker.tolist(),

            "SIDE_TO_SIDE": r.loc[lambda df: df.SIDE_t0 & df.SIDE_t1].ticker.tolist(),
        }

        return res
    else:
        return {"LONG": [], "SHORT": []}


@router.get("/atr")
async def get_atr(ticker: str):
    res = pd.DataFrame(
        db
        .timeseries
        .find(
            {"ticker": ticker.upper()},
            {"_id":0, "date": 1, "ticker": 1, "adjclose": 1, "indicators.atr": 1}
        )
        .sort("date", -1)
        .limit(1)
    )

    return res.to_dict("records")[0]


@router.get("/")
async def root(request: Request):
    """Just a message to return something on the home endpoint"""
    return "SuperGuppy entrypoint"