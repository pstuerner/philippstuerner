import numpy as np
import pandas as pd
import json
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sklearn.linear_model import LinearRegression

app = FastAPI()

app.add_middleware(CORSMiddleware,
allow_origins=["*"],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],)

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

@app.get("/data/{data_id}")
async def data(request: Request, data_id: str):
    if data_id in data_ids:
        return data_ids[data_id]()
    else:
        return 'error'

@app.get("/")
async def root(request: Request):
    return {'Hello':'there'}
