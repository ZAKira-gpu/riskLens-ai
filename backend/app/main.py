from fastapi import FastAPI
from .model import RiskModel
from .simulator import Simulator
from .explain import Explainer

app = FastAPI(title="RiskLens AI API")

@app.get("/")
async def root():
    return {"message": "Welcome to RiskLens AI API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
