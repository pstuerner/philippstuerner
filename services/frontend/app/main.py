import numpy as np
import pandas as pd
import json
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sklearn.linear_model import LinearRegression

app = FastAPI()

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

all_posts = [
    {
        'id': 'gradient_descent',
        'title': 'Gradient Descent',
        'subtitle': "Have a deep dive into one of the most important optimization algorithms in the entire machine learning landscape.",
        'description': """Posted by
                    <a href="about">Philipp Stuerner</a>
                    on July 3, 2021"""
    },
    {
        'id': 'linear_models',
        'title': 'Under the Hood – Linear Models',
        'subtitle': 'In-depth analysis of linear regression and classification models.',
        'description': """Posted by
                    <a href="about">Philipp Stuerner</a>
                    on June 9, 2021"""
    },
    {
        'id': 'confusion_matrix',
        'title': "Unconfusing the confusion matrix",
        'subtitle': "Learn what the confusion matrix and its metrics are by interacting with a simple MNIST classifier.",
        'description': """Posted by
                    <a href="about">Philipp Stuerner</a>
                    on May 28, 2021"""
    },
    {
        'id': 'cornycryptohitter',
        'title': "CornyCryptoHitter",
        'subtitle': "Real-time cryptocurrency trading by exploiting short-term price fluctuations leveraging exchange websockets and TimescaleDB.",
        'description': """Posted by
                    <a href="about">Philipp Stuerner</a>
                    on May 13, 2021"""
    },
    {
        'id': 'ocelot',
        'title': "Ocelot",
        'subtitle': "Scraping and analyzing 13f reports of major asset managers to gather insights of quarterly portfolio changes.",
        'description': """Posted by
                    <a href="about">Philipp Stuerner</a>
                    on April 13, 2021"""
    },
]

@app.get("/", response_class=HTMLResponse)
@app.get("/index", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, 'posts': all_posts})

@app.get("/about", response_class=HTMLResponse)
async def about(request: Request):
    return templates.TemplateResponse("about.html", {"request": request})

@app.get("/posts", response_class=HTMLResponse)
async def posts(request: Request):
    return 'nice'

@app.get("/posts/{post_id}", response_class=HTMLResponse)
async def post(request: Request, post_id: str):
    return templates.TemplateResponse(f"{post_id}.html", {"request": request})