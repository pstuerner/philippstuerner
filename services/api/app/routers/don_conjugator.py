import os
from datetime import datetime as dt
from typing import Optional
from pymongo import MongoClient
from fastapi import APIRouter, Request


MODES_MAPPING = {
  "indicativo": "Indicativo (Indicative)",
  "subjuntivo": "Subjuntivo (Subjunctive)",
  "imperativo": "Imperativo (Imperative)",
  "infinitivo": "Infinitivo (Infinitive)",
  "gerundio": "Gerundio (Gerund)",
  "participio": "Participio (Participle)"
}

TEMPS_MAPPING = {
  "presente": "Presente (Present)",
  "preterito perfecto compuesto": "Pretérito perfecto compuesto (Present perfect)",
  "preterito imperfect": "Pretérito imperfecto (Imperfect)",
  "preterito pluscuamperfecto": "Pretérito pluscuamperfecto (Past perfect)",
  "preterito perfecto simple": "Pretérito perfecto simple (Preterite)",
  "preterito anterior": "Pretérito anterior (Preterite perfect)",
  "futuro": "Futuro (Future)",
  "futuro perfecto": "Futuro perfecto (Future perfect)",
  "condicional": "Condicional (Conditional)",
  "condicional perfecto": "Condicional perfecto (Conditional perfect)",

  "preterito perfecto": "Pretérito perfecto (Present perfect)",
  "preterito imperfecto 1": "Pretérito imperfecto 1 (Imperfect 1)",
  "preterito pluscuamperfecto 1": "Pretérito pluscuamperfecto 1 (Past perfect 1)",
  "preterito imperfecto 2": "Pretérito imperfecto 2 (Imperfect 2)",
  "preterito pluscuamperfecto 2": "Pretérito pluscuamperfecto 2 (Past perfect 2)",
  
  "imperativo": "Imperativo (Imperative)",
  "imperativo negativo": "Imperativo negativo (Imperative negative)",
  
  "simple": "Simple (Présent)",
  "compuesto": "Compuesto (Perfect)",
  
  "pasado": "Pasado (Perfect)"
}

router = APIRouter()

uri = f"mongodb://{os.environ['MONGO_USER']}:{os.environ['MONGO_USER_PW']}@{os.environ['MONGO_IP']}:{os.environ['MONGO_PORT']}/default?authSource={os.environ['MONGO_AUTH_SOURCE']}"
client = MongoClient(uri)
db = client.conjugator


@router.get("/random")
async def random(
    items: int = 1000000,
    mode: str = "",
    temps: str = ""
):
    projection = {"sp": 1, "en": 1, "_id": 0}
    
    if mode != "":
        if mode in MODES_MAPPING:
            projection[MODES_MAPPING[mode]] = 1
            if temps != "":
                temps = temps.split(',')
                for temp in temps:
                    if temp in TEMPS_MAPPING:
                        projection[f'{MODES_MAPPING[mode]}.{TEMPS_MAPPING[temp]}'] = 1
        del projection[MODES_MAPPING[mode]]
        
    query = db.verbs.aggregate([{"$sample":{"size": items}},{"$project":projection}])

    return list(query)


@router.get("/frequency")
async def frequency(
    items: int = 1000000,
    mode: str = "",
    temps: str = ""
):
    projection = {"sp": 1, "en": 1, "_id": 0}
    
    if mode != "":
        if mode in MODES_MAPPING:
            projection[MODES_MAPPING[mode]] = 1
            if temps != "":
                temps = temps.split(',')
                for temp in temps:
                    if temp in TEMPS_MAPPING:
                        projection[f'{MODES_MAPPING[mode]}.{TEMPS_MAPPING[temp]}'] = 1
        del projection[MODES_MAPPING[mode]]
    
    query = db.verbs.find({}, projection).sort("i", 1).limit(items)

    return list(query)


@router.get("/range")
async def range(
    start: int = 5,
    end: int = 10,
    mode: str = "",
    temps: str = ""
):
    projection = {"sp": 1, "en": 1, "_id": 0}
    
    if mode != "":
        if mode in MODES_MAPPING:
            projection[MODES_MAPPING[mode]] = 1
            if temps != "":
                temps = temps.split(',')
                for temp in temps:
                    if temp in TEMPS_MAPPING:
                        projection[f'{MODES_MAPPING[mode]}.{TEMPS_MAPPING[temp]}'] = 1
        del projection[MODES_MAPPING[mode]]
    
    query = (
        db
        .verbs
        .aggregate(
            [
                {"$match":{"i":{"$gte": start,"$lt": end}}},
                {"$sort":{"i":1}},
                {"$project":projection}
            ]
        )
    )

    return list(query)


@router.get("/select")
async def select(
    mode: str = "",
    temp: str = "",
    verb: str = ""
):
    projection = {"sp": 1, "en": 1, "_id": 0}
    projection[f'{MODES_MAPPING[mode]}.{TEMPS_MAPPING[temp]}'] = 1
    print(projection)
    return list(db.verbs.find({"sp": verb}, projection))


@router.get("/")
async def root(request: Request):
    """Just a message to return something on the home endpoint"""
    return "Don Conjugator entrypoint"