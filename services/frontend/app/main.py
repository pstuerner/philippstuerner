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

def create_gradient_descent_data():
    m = 50
    plus_minus = 1 if np.random.random() < 0.5 else -1
    X = np.random.randint(1,8) * np.random.rand(m, 1)
    y = (4 + 3 * X + np.random.randn(m, 1)) * plus_minus
    df = (
        pd.DataFrame(np.c_[np.ones((m, 1)), X, y], columns=['X_b','X','y'])
        .reset_index()
        .rename(columns={'index':'i'})
    )

    lr = LinearRegression()
    lr.fit(X,y)
    theta0_best, theta1_best = lr.intercept_[0], lr.coef_[0][0]

    return {
        'data': json.loads(df.to_json(orient='records')),
        'theta0_best': theta0_best,
        'theta1_best': theta1_best 
        }

data_ids = {
    'gradient_descent': create_gradient_descent_data
}

all_posts = [
    {
        'id': 'gradient_descent',
        'title': 'Gradient Descent',
        'subtitle': 'How machine learning methods find the best possible model parameters and what the underlying algorithm looks like.',
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
        'subtitle': "What is the confusion matrix and its most important key metrics? It's not complicated at all and you'll learn why in this post.",
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

@app.get("/data/{data_id}")
async def data(request: Request, data_id: str):
    if data_id in data_ids:
        return data_ids[data_id]()
    else:
        return 'error'

@app.get("/posts/gradient_descent/chart2")
async def gradient_descent_chart2(learning_rate: float, n_iter: int):
    return {'lr':learning_rate, 'n':n_iter}