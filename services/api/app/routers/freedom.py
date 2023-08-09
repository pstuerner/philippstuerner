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
db = client.freedom


def weekday_sun_zero(isoweekday):
    return 0 if isoweekday == 7 else isoweekday


@router.get("/alphabet")
async def name(
    letter: str
):
    r = db.alphabet.find_one({"letter": letter}, {"image": 1, "_id":0})
    
    return Response(content=r["image"], media_type="image/png")


@router.get("/")
async def root(request: Request):
    """Just a message to return something on the home endpoint"""
    return "Freedom entrypoint"