import os
from pytz import timezone
from datetime import datetime as dt
from datetime import timedelta as td
from typing import Optional
from pymongo import MongoClient
from fastapi import APIRouter, Request, Response


router = APIRouter()

uri = f"mongodb://{os.environ['MONGO_USER']}:{os.environ['MONGO_USER_PW']}@{os.environ['MONGO_IP']}:{os.environ['MONGO_PORT']}/default?authSource={os.environ['MONGO_AUTH_SOURCE']}"
client = MongoClient(uri)
db = client.artwork


def weekday_sun_zero(isoweekday):
    return 0 if isoweekday == 7 else isoweekday


@router.get("/name")
async def name(
    year: int,
    month: int,
    day: int,
):
    try:
        date = dt(year,month,day)
    except Exception as e:
        return {}
    
    timetable = db.timetable.find_one({"date": date-td(days=date.weekday())}, {"data": 1, "_id":0})
    
    return {"name": timetable["data"][date.strftime("%Y%m%d")]}


@router.get("/timetable")
async def timetable():
    dt_ = dt.now()
    dt_today = dt(dt_.year,dt_.month,dt_.day)

    min_date = list(db.timetable.find({},{"_id":0,"date":1}).sort("date", 1).limit(1))[0]["date"]
    max_date = list(db.timetable.find({},{"_id":0,"date":1}).sort("date", -1).limit(1))[0]["date"]

    d = []
    for year in reversed(range(min_date.year, max_date.year+1)):
        weeks_ = db.timetable.find({"date": {"$lte": dt_today+td(days=1)}, "$expr": { "$eq": [{ "$year": "$date" }, year] } }).sort("date", -1)

        weeks = []
        for week in weeks_:

            days = []
            for k, v in week["data"].items():
                day_date = dt.strptime(k,"%Y%m%d")
                name = v if day_date < dt_today+td(days=1) else "👀🤔🔜"

                days.append({
                    "year": day_date.year,
                    "month": day_date.month,
                    "day": day_date.day,
                    "name": name
                })

                if name == "👀🤔🔜":
                    break

            weeks.append(
                {
                    "week": week["date"].isocalendar().week,
                    "month": week["date"].month,
                    "day": week["date"].day,
                    "topic": week["topic"],
                    "days": days
                }
            )
        
        d.append(
            {
                "year": year,
                "weeks": weeks
            }
        )

    return d


@router.get("/info/day")
async def day(
    year: int,
    month: int,
    day: int,
):
    try:
        date = dt(year,month,day)
    except Exception as e:
        return {}
    artwork = db.artwork.find_one({"date": date}, {"images_100": 0, "images_050": 0, "images_025": 0, "images_0125": 0, "_id": 0})
    
    if artwork:
        img_url = "https://api.philippstuerner.com/everydays/image?year={}&month={}&day={}&slice={}&resolution=100"
        placeholder_url = "https://api.philippstuerner.com/everydays/image?year={}&month={}&day={}&slice={}&resolution=002"
        essay_20 = int(len(artwork["essay"])*.20)
        essay_60 = int(len(artwork["essay"])*.60)
        cutoff_1 = essay_20 + artwork["essay"][essay_20:].find(". ")
        cutoff_2 = essay_60 + artwork["essay"][essay_60:].find(". ")
        
        return {
            "topic": artwork["topic"],
            "name": artwork["name"],
            "essay": [artwork["essay"][:cutoff_1+1],artwork["essay"][cutoff_1+2:cutoff_2+1],artwork["essay"][cutoff_2+2:]],
            "prompt": artwork["prompt"],
            "images": [
                {
                    "url": img_url.format(*(date.year,date.month,date.day),slice),
                    "placeholder": placeholder_url.format(*(date.year,date.month,date.day),slice)
                } for slice in range(4)
            ]
        }
    else:
        return {}

@router.get("/info/calendarweek")
async def calendarweek(
    year: int,
    month: int,
    day: int,
):
    try:
        date = dt(year,month,day,tzinfo=timezone("Europe/Berlin"))
    except Exception as e:
        return {}
    dt_now = dt.now(tz=timezone("Europe/Berlin"))
    dt_today = dt(dt_now.year,dt_now.month,dt_now.day,tzinfo=timezone("Europe/Berlin"))
    timetable = db.timetable.find_one({"date": date.replace(tzinfo=None)})
    
    if timetable:
        days = []
        img_url = "https://api.philippstuerner.com/everydays/image?year={}&month={}&day={}&slice={}&resolution=025"
        placeholder_url = "https://api.philippstuerner.com/everydays/image?year={}&month={}&day={}&slice={}&resolution=002"
        
        for dt_str, name in timetable["data"].items():
            dt_ = dt.strptime(dt_str, "%Y%m%d").replace(tzinfo=timezone("Europe/Berlin"))
            
            if (dt_ < dt_today) or (dt_ == dt_today and dt_now.hour >= 9):
                days.append(
                    {
                        "name": name,
                        "year": dt_.year,
                        "month": dt_.month,
                        "day": dt_.day,
                        "images": [
                                {
                                    "url": img_url.format(*(dt_.year,dt_.month,dt_.day),slice),
                                    "placeholder": placeholder_url.format(*(dt_.year,dt_.month,dt_.day),slice)
                                } for slice in range(4)
                            ]
                    }
                )
            
        return {
            "topic": timetable["topic"],
            "ratio": eval(timetable["ar"].replace(":","/")),
            "days": days
        }
    else:
        return {}
    
@router.get("/info/year")
async def year(
    year: int,
    month: int,
    day: int,
):
    try:
        date = dt(year,month,day,tzinfo=timezone("Europe/Berlin"))
    except Exception as e:
        return {}
    date_1 = dt(year+1,month,day,tzinfo=timezone("Europe/Berlin"))
    dt_now = dt.now(tz=timezone("Europe/Berlin"))
    dt_today = dt(dt_now.year,dt_now.month,dt_now.day,tzinfo=timezone("Europe/Berlin"))

    timetables = (
        db
        .timetable
        .find(
            {
                "$expr": { "$eq": [{ "$year": "$date" }, year] },
                "date": {"$lte": dt_now}
            },
        ).sort("date", -1)
    )
    r = []
    
    if timetables:
        for timetable in timetables:
            days = []
            names = []
            img_url = "https://api.philippstuerner.com/everydays/image?year={}&month={}&day={}&slice={}&resolution=0125"
            placeholder_url = "https://api.philippstuerner.com/everydays/image?year={}&month={}&day={}&slice={}&resolution=002"

            for dt_str, name in timetable["data"].items():
                dt_ = dt.strptime(dt_str, "%Y%m%d").replace(tzinfo=timezone("Europe/Berlin"))

                if (dt_ < dt_today) or (dt_ == dt_today and dt_now.hour >= 9):
                    names.append(name)
                    days.append(
                        {
                            "name": name,
                            "year": dt_.year,
                            "month": dt_.month,
                            "day": dt_.day,
                            "images": [
                                {
                                    "url": img_url.format(*(dt_.year,dt_.month,dt_.day),slice),
                                    "placeholder": placeholder_url.format(*(dt_.year,dt_.month,dt_.day),slice)
                                } for slice in range(4)
                            ]
                        }
                    )

            r.append(
                {
                    "topic": timetable["topic"],
                    "names": names,
                    "ratio": eval(timetable["ar"].replace(":","/")),
                    "days" : days
                }
            )

        return {
            "timetables": r
        }
    else:
        return {}

@router.get("/image")
async def image(
        year: int,
        month: int,
        day: int,
        resolution: str = "050",
        slice: int = 0
    ):
    date = dt(year,month,day)
    projection = {
        "images_100": 0,
        "images_050": 0,
        "images_025": 0,
        "images_0125": 0,
        "images_002": 0
    }
    projection[f"images_{resolution}"] = {"$slice": [slice, 1]}
    query = db.artwork.find_one({"date": date}, projection)
    
    return Response(content=query[f"images_{resolution}"][0], media_type="image/png")

@router.get("/")
async def root(request: Request):
    """Just a message to return something on the home endpoint"""
    return "Everydays entrypoint"