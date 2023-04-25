import os
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import requests

HOST = os.environ["HOST"]
PORT = os.environ["PORT"]
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/image/serve/")
async def serve_image(
        filepath: str,
        filename: str
    ):
    response = requests.get(f"{HOST}:{PORT}/image/serve/?filepath={filepath}&filename={filename}")
    
    return Response(content=response.content, media_type="image/png")

@app.get("/image/find/")
async def find_image(
        filepath: str,
        prefix: str
    ):
    response = requests.get(f"{HOST}:{PORT}/image/find/?filepath={filepath}&prefix={prefix}")
    
    return response.json()