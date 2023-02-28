from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

all_posts = [
    {
        "id": "sinverguenza",
        "title": "Sinvergüenza",
        "subtitle": "Stock screener built on top of the Yahoo Finance API using Plotly.js, D3.js, and MongoDB.",
        "description": """Posted by
                    <a href="about">Philipp Stuerner</a>
                    on Januar 21, 2022""",
    },
    {
        "id": "donquijote",
        "title": "Don Quijote",
        "subtitle": "Telegram based application to practice Spanish vocabulary.",
        "description": """Posted by
                    <a href="about">Philipp Stuerner</a>
                    on December 17, 2022""",
    },
    {
        "id": "cmcscanner",
        "title": "CMC Scanner",
        "subtitle": "Small web application to query and compare historical CoinMarketCap snapshots.",
        "description": """Posted by
                    <a href="about">Philipp Stuerner</a>
                    on September 11, 2022""",
    },
    {
        "id": "don_conjugator",
        "title": "Don Conjugator",
        "subtitle": "Web application to practice conjugating Spanish verbs.",
        "description": """Posted by
                    <a href="about">Philipp Stuerner</a>
                    on September 8, 2022""",
    },
    {
        "id": "gradient_descent",
        "title": "Gradient Descent",
        "subtitle": "Have a deep dive into one of the most important optimization algorithms in machine learning.",
        "description": """Posted by
                    <a href="about">Philipp Stuerner</a>
                    on November 5, 2021""",
    },
    {
        "id": "linear_models",
        "title": "Linear Models",
        "subtitle": "In-depth analysis of linear regression and classification models.",
        "description": """Posted by
                    <a href="about">Philipp Stuerner</a>
                    on September 20, 2021""",
    },
    {
        "id": "confusion_matrix",
        "title": "Confusion Matrix",
        "subtitle": "Learn what the confusion matrix and its metrics are by interacting with a simple MNIST classifier.",
        "description": """Posted by
                    <a href="about">Philipp Stuerner</a>
                    on July 15, 2021""",
    },
]


@app.get("/", response_class=HTMLResponse)
@app.get("/index", response_class=HTMLResponse)
async def index(request: Request):
    """A function to tell FastAPI how to handle the home and index endpoints.

    Args:
        request (Request): The request.

    Returns:
        templates.TemplateResponse: The index.html template formatted with all posts of
            the above all_posts list.
    """
    return templates.TemplateResponse(
        "index.html", {"request": request, "posts": all_posts}
    )


@app.get("/about", response_class=HTMLResponse)
async def about(request: Request):
    """A function to tell FastAPI how to handle the about endpoint.

    Args:
        request (Request): The request.

    Returns:
        templates.TemplateResponse: The about.html template.
    """
    return templates.TemplateResponse("about.html", {"request": request})


@app.get("/posts/{post_id}", response_class=HTMLResponse)
async def post(request: Request, post_id: str):
    """A function to tell FastAPI how to handle the individual posts.

    Args:
        request (Request): The request.
        post_id (str): Unique identifier of the post to correctly map it to its html file.

    Returns:
        templates.TemplateResponse: The post's corresponding html file.
    """
    return templates.TemplateResponse(f"/posts/{post_id}.html", {"request": request})

@app.get("/apps/{app_id}", response_class=HTMLResponse)
async def post(request: Request, app_id: str):
    """A function to tell FastAPI how to handle the individual apps.

    Args:
        request (Request): The request.
        app_id (str): Unique identifier of the app to correctly map it to its html file.

    Returns:
        templates.TemplateResponse: The post's corresponding html file.
    """
    return templates.TemplateResponse(f"/apps/{app_id}.html", {"request": request})

@app.get("/posts/don_conjugator/practice/{mode}/{verbs}", response_class=HTMLResponse)
async def don_conjugator(request: Request, mode: str, verbs: str):
    """A function to tell FastAPI how to handle the individual posts.

    Args:
        request (Request): The request.
        post_id (str): Unique identifier of the post to correctly map it to its html file.

    Returns:
        templates.TemplateResponse: The post's corresponding html file.
    """
    verbs = [x.split(';') for x in verbs.split(',')]
    return templates.TemplateResponse(f"don_conjugator_practice.html", {"request": request, "mode": mode, "verbs": verbs})
