import json
from typing import Optional

import numpy as np
import pandas as pd
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sklearn.datasets import load_iris
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.preprocessing import MinMaxScaler, PolynomialFeatures

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def logreg_data(y_idx=2, X_idx=2, return_theta=False, normalize=False, **kwargs):
    X, y = load_iris(return_X_y=True, as_frame=True)

    X = X.iloc[:, X_idx]
    y = (y == y_idx).astype(int)
    df = pd.DataFrame({"X": X, "y": y}).assign(X_b=1)

    if normalize:
        df["X"] = MinMaxScaler().fit_transform(df[["X"]])

    r = {"data": json.loads(df.to_json(orient="records"))}

    if return_theta:
        lr = LogisticRegression(penalty="none")
        lr.fit(df[["X"]], df[["y"]])
        theta0_best, theta1_best = lr.intercept_[0], lr.coef_[0][0]
        r["theta0_best"] = theta0_best
        r["theta1_best"] = theta1_best

    return r


def linear_data(return_theta=True, **kwargs):
    m = 50
    plus_minus = 1 if np.random.random() < 0.5 else -1
    X = np.random.randint(1, 8) * np.random.rand(m, 1)
    y = (4 + 3 * X + np.random.randn(m, 1)) * plus_minus
    df = (
        pd.DataFrame(np.c_[np.ones((m, 1)), X, y], columns=["X_b", "X", "y"])
        .reset_index()
        .rename(columns={"index": "i"})
    )

    r = {"data": json.loads(df.to_json(orient="records"))}

    if return_theta:
        lr = LinearRegression()
        lr.fit(X, y)
        theta0_best, theta1_best = lr.intercept_[0], lr.coef_[0][0]
        r["theta0_best"] = theta0_best
        r["theta1_best"] = theta1_best

    return r


def quadratic_data(return_theta=False, return_test=False, noise=4, **kwargs):
    m = 100
    flip = -1 if np.random.rand() > 0.5 else 1

    X = (
        np.random.uniform(np.random.randint(-10, -2), np.random.randint(2, 10), m)
    ).reshape(-1, 1)
    y = (X ** 2 + X + 2 + (np.random.randn(m, 1) * noise)) * flip
    df = (
        pd.DataFrame(
            np.c_[np.ones((m, 1)), X, X ** 2, y], columns=["X_b", "X", "XX", "y"]
        )
        .reset_index()
        .rename(columns={"index": "i"})
    )

    r = {}

    if return_theta:
        lr = LinearRegression()
        lr.fit(df[["X", "XX"]], y)
        theta0_best, theta1_best, theta2_best = (
            lr.intercept_[0],
            lr.coef_[0][0],
            lr.coef_[0][1],
        )
        r["theta0_best"] = theta0_best
        r["theta1_best"] = theta1_best
        r["theta2_best"] = theta2_best

    if return_test:
        r["data_train"] = json.loads(df[: int(m / 2)].to_json(orient="records"))
        r["data_test"] = json.loads(df[int(m / 2) :].to_json(orient="records"))
    else:
        r["data"] = json.loads(df.to_json(orient="records"))

    return r


def poly_data(degrees=30, noise=4, **kwargs):
    d = quadratic_data(return_test=True, noise=noise)
    train = pd.DataFrame(d["data_train"])[["i", "X", "y"]]
    test = pd.DataFrame(d["data_test"])[["i", "X", "y"]]
    lr = LinearRegression()

    polynomials = []
    for degree in range(1, degrees + 1):
        X_poly_train = PolynomialFeatures(
            degree=degree, include_bias=True
        ).fit_transform(train["X"].to_numpy().reshape(-1, 1))
        X_poly_test = PolynomialFeatures(
            degree=degree, include_bias=True
        ).fit_transform(test["X"].to_numpy().reshape(-1, 1))
        lr.fit(X_poly_train, train["y"])
        polynomials.append(
            {
                "degree": degree,
                "theta": [lr.intercept_, *lr.coef_[1:]],
                "X_poly_train": X_poly_train[np.argsort(X_poly_train[:, 1])].tolist(),
                "X_poly_test": X_poly_test[np.argsort(X_poly_test[:, 1])].tolist(),
            }
        )

    return {
        "data_train": json.loads(train.to_json(orient="records")),
        "data_test": json.loads(test.to_json(orient="records")),
        "polynomials": polynomials,
    }


data_funcs = {
    "linear": linear_data,
    "quadratic": quadratic_data,
    "poly_data": poly_data,
    "logreg_data": logreg_data,
}


@app.get("/data/{func}")
async def data(
    request: Request,
    func: str,
    return_theta: Optional[bool] = False,
    return_test: Optional[bool] = False,
    degrees: Optional[int] = 10,
    normalize: Optional[bool] = False,
    X_idx: Optional[int] = 0,
    y_idx: Optional[int] = 0,
    noise: Optional[int] = 0,
):
    kwargs = {
        "return_theta": return_theta,
        "return_test": return_test,
        "degrees": degrees,
        "X_idx": X_idx,
        "y_idx": y_idx,
        "normalize": normalize,
        "noise": noise,
    }

    if func in data_funcs:
        return data_funcs[func](**kwargs)
    else:
        return f"Data function does not exist. Available options are: {', '.join(data_funcs.keys())}"


@app.get("/")
async def root(request: Request):
    return "This is the home endpoint of my FastAPI 🏠."
