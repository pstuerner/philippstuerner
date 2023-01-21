import os
import bson
import pandas as pd
import numpy as np
from typing import Optional, Union, List, Dict
from collections import Counter
from pymongo import MongoClient
from pydantic import BaseModel
from fastapi import APIRouter, Request

from ta.volatility import BollingerBands
from ta.trend import SMAIndicator, EMAIndicator, WMAIndicator


router = APIRouter()

uri = f"mongodb://{os.environ['MONGO_USER']}:{os.environ['MONGO_USER_PW']}@{os.environ['MONGO_IP']}:{os.environ['MONGO_PORT']}/default?authSource={os.environ['MONGO_AUTH_SOURCE']}"
client = MongoClient(uri)
db = client.sinverguenza


def most_common_to_lists(most_common):
    list_1 = []
    list_2 = []
    for inner_list in most_common:
        list_1.append(inner_list[0])
        list_2.append(inner_list[1])
    return list_1, list_2


def numeric_to_mongo_query(inp):
    d = {
        "<": "$lt",
        "<=": "$lte",
        ">": "$gt",
        ">=": "$gte"
    }

    return {d[inp[0]]: inp[1]}


def text_to_mongo_query(inp):
    if len(inp) == 1:
        return inp[0]
    else:
        return {"$in": inp}


mongodb_conversion = {
    text_to_mongo_query: ["zip","sector","longBusinessSummary","city","phone","state","country","website","address1","industry","recommendationKey","financialCurrency","exchange","shortName","longName","exchangeTimezoneName","exchangeTimezoneShortName","gmtOffSetMilliseconds","quoteType","symbol","messageBoardId","uuid","market","lastSplitFactor","currency","logo_url","russelName"],
    numeric_to_mongo_query: ["fullTimeEmployees","maxAge","ebitdaMargins","profitMargins","grossMargins","operatingCashflow","revenueGrowth","operatingMargins","ebitda","targetLowPrice","grossProfits","freeCashflow","targetMedianPrice","currentPrice","earningsGrowth","currentRatio","returnOnAssets","numberOfAnalystOpinions","targetMeanPrice","debtToEquity","returnOnEquity","targetHighPrice","totalCash","totalDebt","totalRevenue","totalCashPerShare","revenuePerShare","quickRatio","recommendationMean","enterpriseToRevenue","enterpriseToEbitda","forwardEps","sharesOutstanding","bookValue","sharesShort","sharesPercentSharesOut","lastFiscalYearEnd","heldPercentInstitutions","netIncomeToCommon","trailingEps","priceToBook","heldPercentInsiders","nextFiscalYearEnd","mostRecentQuarter","shortRatio","sharesShortPreviousMonthDate","floatShares","beta","enterpriseValue","priceHint","lastSplitDate","earningsQuarterlyGrowth","priceToSalesTrailing12Months","dateShortInterest","pegRatio","forwardPE","shortPercentOfFloat","sharesShortPriorMonth","previousClose","regularMarketOpen","twoHundredDayAverage","trailingAnnualDividendYield","payoutRatio","regularMarketDayHigh","averageDailyVolume10Day","regularMarketPreviousClose","fiftyDayAverage","trailingAnnualDividendRate","open","averageVolume10days","dividendRate","exDividendDate","regularMarketDayLow","trailingPE","regularMarketVolume","marketCap","averageVolume","dayLow","ask","askSize","volume","fiftyTwoWeekHigh","fiveYearAvgDividendYield","fiftyTwoWeekLow","bid","dividendYield","bidSize","dayHigh","regularMarketPrice","russelPct"]
}
# solve 52WeekChange
# fundInceptionDate has two misclassified stocks
# SandP52WeekChange, don't have to save each time
mongodb_fields_ignore = [
    "underlyingSymbol",
    "companyOfficers",
    "underlyingExchangeSymbol",
    "headSymbol",
    "annualHoldingsTurnover",
    "beta3Year",
    "morningStarRiskRating",
    "revenueQuarterlyGrowth",
    "annualReportExpenseRatio",
    "totalAssets",
    "fundFamily",
    "yield",
    "threeYearAverageReturn",
    "legalType",
    "morningStarOverallRating",
    "ytdReturn",
    "lastCapGain",
    "category",
    "fiveYearAverageReturn",
    "volume24Hr",
    "navPrice",
    "expireDate",
    "algorithm",
    "circulatingSupply",
    "startDate",
    "lastMarket",
    "maxSupply",
    "openInterest",
    "volumeAllCurrencies",
    "strikePrice",
    "fromCurrency"
]


class Filter(BaseModel):
    marketCap: Union[List[Union[float,str]], None] = None
    industry: Union[List[str], None] = None
    zip: Union[List[str], None] = None
    sector: Union[List[str], None] = None
    fullTimeEmployees: Union[List[Union[float,str]], None] = None
    longBusinessSummary: Union[List[str], None] = None
    city: Union[List[str], None] = None
    phone: Union[List[str], None] = None
    state: Union[List[str], None] = None
    country: Union[List[str], None] = None
    website: Union[List[str], None] = None
    maxAge: Union[List[Union[float,str]], None] = None
    address1: Union[List[str], None] = None
    industry: Union[List[str], None] = None
    ebitdaMargins: Union[List[Union[float,str]], None] = None
    profitMargins: Union[List[Union[float,str]], None] = None
    grossMargins: Union[List[Union[float,str]], None] = None
    operatingCashflow: Union[List[Union[float,str]], None] = None
    revenueGrowth: Union[List[Union[float,str]], None] = None
    operatingMargins: Union[List[Union[float,str]], None] = None
    ebitda: Union[List[Union[float,str]], None] = None
    targetLowPrice: Union[List[Union[float,str]], None] = None
    recommendationKey: Union[List[str], None] = None
    grossProfits: Union[List[Union[float,str]], None] = None
    freeCashflow: Union[List[Union[float,str]], None] = None
    targetMedianPrice: Union[List[Union[float,str]], None] = None
    currentPrice: Union[List[Union[float,str]], None] = None
    earningsGrowth: Union[List[Union[float,str]], None] = None
    currentRatio: Union[List[Union[float,str]], None] = None
    returnOnAssets: Union[List[Union[float,str]], None] = None
    numberOfAnalystOpinions: Union[List[Union[float,str]], None] = None
    targetMeanPrice: Union[List[Union[float,str]], None] = None
    debtToEquity: Union[List[Union[float,str]], None] = None
    returnOnEquity: Union[List[Union[float,str]], None] = None
    targetHighPrice: Union[List[Union[float,str]], None] = None
    totalCash: Union[List[Union[float,str]], None] = None
    totalDebt: Union[List[Union[float,str]], None] = None
    totalRevenue: Union[List[Union[float,str]], None] = None
    totalCashPerShare: Union[List[Union[float,str]], None] = None
    financialCurrency: Union[List[str], None] = None
    revenuePerShare: Union[List[Union[float,str]], None] = None
    quickRatio: Union[List[Union[float,str]], None] = None
    recommendationMean: Union[List[Union[float,str]], None] = None
    exchange: Union[List[str], None] = None
    shortName: Union[List[str], None] = None
    longName: Union[List[str], None] = None
    exchangeTimezoneName: Union[List[str], None] = None
    exchangeTimezoneShortName: Union[List[str], None] = None
    gmtOffSetMilliseconds: Union[List[str], None] = None
    quoteType: Union[List[str], None] = None
    symbol: Union[List[str], None] = None
    messageBoardId: Union[List[str], None] = None
    uuid: Union[List[str], None] = None
    market: Union[List[str], None] = None
    enterpriseToRevenue: Union[List[Union[float,str]], None] = None
    enterpriseToEbitda: Union[List[Union[float,str]], None] = None
    forwardEps: Union[List[Union[float,str]], None] = None
    sharesOutstanding: Union[List[Union[float,str]], None] = None
    bookValue: Union[List[Union[float,str]], None] = None
    sharesShort: Union[List[Union[float,str]], None] = None
    sharesPercentSharesOut: Union[List[Union[float,str]], None] = None
    lastFiscalYearEnd: Union[List[Union[float,str]], None] = None
    heldPercentInstitutions: Union[List[Union[float,str]], None] = None
    netIncomeToCommon: Union[List[Union[float,str]], None] = None
    trailingEps: Union[List[Union[float,str]], None] = None
    priceToBook: Union[List[Union[float,str]], None] = None
    heldPercentInsiders: Union[List[Union[float,str]], None] = None
    nextFiscalYearEnd: Union[List[Union[float,str]], None] = None
    mostRecentQuarter: Union[List[Union[float,str]], None] = None
    shortRatio: Union[List[Union[float,str]], None] = None
    sharesShortPreviousMonthDate: Union[List[Union[float,str]], None] = None
    floatShares: Union[List[Union[float,str]], None] = None
    beta: Union[List[Union[float,str]], None] = None
    enterpriseValue: Union[List[Union[float,str]], None] = None
    priceHint: Union[List[Union[float,str]], None] = None
    lastSplitDate: Union[List[Union[float,str]], None] = None
    lastSplitFactor: Union[List[str], None] = None
    earningsQuarterlyGrowth: Union[List[Union[float,str]], None] = None
    priceToSalesTrailing12Months: Union[List[Union[float,str]], None] = None
    dateShortInterest: Union[List[Union[float,str]], None] = None
    pegRatio: Union[List[Union[float,str]], None] = None
    forwardPE: Union[List[Union[float,str]], None] = None
    shortPercentOfFloat: Union[List[Union[float,str]], None] = None
    sharesShortPriorMonth: Union[List[Union[float,str]], None] = None
    previousClose: Union[List[Union[float,str]], None] = None
    regularMarketOpen: Union[List[Union[float,str]], None] = None
    twoHundredDayAverage: Union[List[Union[float,str]], None] = None
    trailingAnnualDividendYield: Union[List[Union[float,str]], None] = None
    payoutRatio: Union[List[Union[float,str]], None] = None
    regularMarketDayHigh: Union[List[Union[float,str]], None] = None
    averageDailyVolume10Day: Union[List[Union[float,str]], None] = None
    regularMarketPreviousClose: Union[List[Union[float,str]], None] = None
    fiftyDayAverage: Union[List[Union[float,str]], None] = None
    trailingAnnualDividendRate: Union[List[Union[float,str]], None] = None
    open: Union[List[Union[float,str]], None] = None
    averageVolume10days: Union[List[Union[float,str]], None] = None
    dividendRate: Union[List[Union[float,str]], None] = None
    exDividendDate: Union[List[Union[float,str]], None] = None
    regularMarketDayLow: Union[List[Union[float,str]], None] = None
    currency: Union[List[str], None] = None
    trailingPE: Union[List[Union[float,str]], None] = None
    regularMarketVolume: Union[List[Union[float,str]], None] = None
    marketCap: Union[List[Union[float,str]], None] = None
    averageVolume: Union[List[Union[float,str]], None] = None
    dayLow: Union[List[Union[float,str]], None] = None
    ask: Union[List[Union[float,str]], None] = None
    askSize: Union[List[Union[float,str]], None] = None
    volume: Union[List[Union[float,str]], None] = None
    fiftyTwoWeekHigh: Union[List[Union[float,str]], None] = None
    fiveYearAvgDividendYield: Union[List[Union[float,str]], None] = None
    fiftyTwoWeekLow: Union[List[Union[float,str]], None] = None
    bid: Union[List[Union[float,str]], None] = None
    dividendYield: Union[List[Union[float,str]], None] = None
    bidSize: Union[List[Union[float,str]], None] = None
    dayHigh: Union[List[Union[float,str]], None] = None
    regularMarketPrice: Union[List[Union[float,str]], None] = None
    logo_url: Union[List[str], None] = None
    russelName: Union[List[str], None] = None
    russelPct: Union[List[Union[float,str]], None] = None


class Timeseries(BaseModel):
    symbols: List[str]


class Indicators(BaseModel):
    symbol: str
    timeseries: List[Dict]
    indicators: Dict[str, Dict[str, int]]


@router.get("/option/{option}")
async def option(option: str = ""):
    option_type = type(db.assets.find_one({"symbol":"AAPL"},{"_id":0,option:1})[option])
    query = db.assets.find({},{"_id":0,option:1})

    if option_type is str:
        most_common = Counter([x.get(option,None) for x in query]).most_common()
        values, counts = most_common_to_lists(most_common)
        return {
            "type": "str",
            "values": values,
            "counts": counts
        }
    elif option_type in [float, int, bson.int64.Int64]:
        return {"type": "int", "values": [x.get(option,None) for x in query]}

    return None


@router.post("/assets")
async def assets(filter: Filter):
    filter_dict = filter.dict()
    query = {}

    for k,v in filter_dict.items():
        if v is not None:
            for func, strings in mongodb_conversion.items():
                if k in strings:
                    query[k] = func(v)

    return list(db.assets.find(query,{"_id":0}))


@router.post("/timeseries")
async def timeseries(timeseries: Timeseries):
    timeseries_dict = timeseries.dict()
    ts = list(db.timeseries.find({"symbol": {"$in":timeseries_dict["symbols"]}},{"_id":0}))
    r = []

    for t in ts:
        df = pd.DataFrame.from_dict(t["timeseries"])
        r.append({
            "symbol": t["symbol"],
            "data": df[["Date","Open","High","Low","Close","Adj Close","Volume"]].to_dict(orient="records")
        })

    return r


def compute_MAVGIndicator(indicator: Union[SMAIndicator, EMAIndicator, WMAIndicator], **kwargs):
    i = indicator(**kwargs)
    i_name = f"{i.__class__.__name__}({','.join([str(v) for k,v in kwargs.items() if k != 'close'])})"
    
    if i.__class__ == EMAIndicator:
        print(kwargs)
        return i.ema_indicator().rename(f"{i_name}_mavg")
    elif i.__class__ == SMAIndicator:
        return i.sma_indicator().rename(f"{i_name}_mavg")
    elif i.__class__ == WMAIndicator:
        return i.wma().rename(f"{i_name}_mavg")

def compute_BollingerBands(indicator: BollingerBands, **kwargs):
    i = indicator(**kwargs)
    i_name = f"{i.__class__.__name__}({','.join([str(v) for k,v in kwargs.items() if k != 'close'])})"
    
    return [
        i.bollinger_mavg().rename(f"{i_name}_mavg"),
        i.bollinger_hband().rename(f"{i_name}_hband"),
        i.bollinger_lband().rename(f"{i_name}_lband")
    ]

indicator_mapping = {
    BollingerBands: compute_BollingerBands,

    SMAIndicator: compute_MAVGIndicator,
    EMAIndicator: compute_MAVGIndicator,
    WMAIndicator: compute_MAVGIndicator,
}


@router.post("/indicators")
async def timeseries(indicators: Indicators):
    body = indicators.dict()
    indicators = body.get("indicators", "{}")
    timeseries = body.get("timeseries", "{}")
    symbol = body.get("symbol", "")
    r = []

    for indicator, kwargs in indicators.items():
        df = pd.DataFrame.from_dict(timeseries)
        kwargs["close"] = df["Adj Close"]
        res = indicator_mapping[eval(indicator.split("_")[0])](eval(indicator.split("_")[0]), **kwargs)
        
        if type(res) == pd.Series:
            r.append(res)
        else:
            r += res
    
    unique_names = dict.fromkeys([series.name for series in r])
    unique_series = [series for name, series in zip(unique_names, r) if name]

    return pd.concat(unique_series, axis=1).replace([np.inf, -np.inf], np.nan).to_json(orient="records")



@router.get("/temp")
async def temp(request: Request):
    r = db.assets.find_one({"symbol":"AAPL"},{"_id":0})
    
    for k,v in r.items():
        if k in mongodb_fields_ignore:
            continue
        if type(v) == str:
            print(f"{k}: Union[List[str], None] = None")
        elif type(v) in [bson.int64.Int64, float, int]:
            print(f"{k}: Union[List[Union[float,str]], None] = None")
        else:
            pass
    return {}

@router.get("/")
async def root(request: Request):
    """Just a message to return something on the home endpoint"""
    return "Sinverguenza entrypoint"