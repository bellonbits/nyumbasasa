"""
Vercel serverless entrypoint for the NyumbaSasa FastAPI app.
Mangum bridges ASGI (FastAPI) → AWS Lambda / Vercel's serverless function format.
"""
from mangum import Mangum
from app.main import app

handler = Mangum(app, lifespan="on")
