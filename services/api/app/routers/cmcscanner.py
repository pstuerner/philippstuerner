import os
from datetime import datetime as dt
from typing import Optional
from pymongo import MongoClient
from fastapi import APIRouter, Request


router = APIRouter()

uri = f"mongodb://{os.environ['MONGO_USER']}:{os.environ['MONGO_USER_PW']}@{os.environ['MONGO_IP']}:{os.environ['MONGO_PORT']}/default?authSource={os.environ['MONGO_AUTH_SOURCE']}"
client = MongoClient(uri)
db = client.cmcscanner


@router.get("/timestamps")
async def timestamps():
    query = db.listings.find({}, {"timestamp":1,"_id":0}).sort("timestamp", -1)

    return list(query)


@router.get("/listings")
async def timestamps(unix_timestamp: Optional[int] = None, last: Optional[int] = None):
    print(unix_timestamp,last)
    if unix_timestamp:
        query = db.listings.find_one({"timestamp": {"$gte": dt.utcfromtimestamp(unix_timestamp).isoformat() + 'Z'}}, {"_id": 0})
    elif last:
        query = list(db.listings.find({}, {"_id":0}).sort("timestamp", -1).limit(last))
    else:
        return {}

    return query


@router.get("/")
async def root(request: Request):
    """Just a message to return something on the home endpoint"""
    return "CMCScanner entrypoint"