
from transformers import pipeline
from fastapi import APIRouter, Request


router = APIRouter()
clm = pipeline('text-generation',model='pstuerner/ukraine-clm', tokenizer='pstuerner/ukraine-clm')


@router.get("/generate")
async def generate_text(
    request: Request,
    prompt: str,
    max_length: int = 150
):
    """A general function to process data requests from the frontend.

    Args:
        request (Request): The frontend's request.
        return_theta (bool): Return the best possible intercept and coefficient.

    Returns:
        dict: The mapped function's result. Always a dictionary.
    """
    r = clm(prompt, max_length=max_length)[0]["generated_text"]

    return {
        "text": r[:r.rfind(".")+1]
    }


@router.get("/")
async def root(request: Request):
    """Just a message to return something on the home endpoint"""
    return "Ukraine-GPT2 entrypoint."
