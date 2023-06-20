from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

# from .routers import sinverguenza
from .routers import linear_models
from .routers import cmcscanner
from .routers import don_conjugator
from .routers import everydays

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(sinverguenza.router, prefix="/sinverguenza")
app.include_router(cmcscanner.router, prefix="/cmcscanner")
app.include_router(linear_models.router, prefix="/linear_models")
app.include_router(don_conjugator.router, prefix="/don_conjugator")
app.include_router(everydays.router, prefix="/everydays")


@app.get("/")
async def root(request: Request):
    """Just a message to return something on the home endpoint"""
    return "This is the home endpoint of my FastAPI 🏠."
