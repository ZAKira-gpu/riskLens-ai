from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .model import RiskModel
from .simulator import Simulator
from .explain import Explainer
from .utils import format_response
import pandas as pd
import pathlib

app = FastAPI(title="RiskLens AI API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For hackathon simplicity, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize models
risk_model = RiskModel()
explainer = Explainer()
simulator = Simulator()

class TransactionData(BaseModel):
    feature_vector: list # [Time, V1...V28, Amount]

@app.get("/")
async def root():
    return {"message": "Welcome to RiskLens AI - Fraud Intelligence Command Center"}

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": risk_model.model is not None}

@app.post("/predict")
async def predict_risk(data: TransactionData):
    result = risk_model.predict(data.feature_vector)
    return format_response(result)

@app.post("/explain")
async def explain_risk(data: TransactionData):
    explanation = explainer.explain_prediction(data.feature_vector)
    return format_response(explanation)

@app.get("/dashboard/stats")
async def get_stats():
    # Load transactions for summary stats
    data_path = pathlib.Path(__file__).parent.parent / "data" / "transactions.csv"
    try:
        df = pd.read_csv(data_path)
        stats = {
            "total_transactions": len(df),
            "fraud_detected": int(df["is_fraud"].sum()),
            "avg_risk": 0.42, # Placeholder or calculated from df
            "potential_loss": float((df[df["is_fraud"] == 1]["amount"]).sum())
        }
        return format_response(stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/transactions")
async def get_transactions(limit: int = 50):
    data_path = pathlib.Path(__file__).parent.parent / "data" / "transactions.csv"
    try:
        df = pd.read_csv(data_path)
        # Sort by timestamp or just take recent
        recent = df.head(limit).to_dict(orient="records")
        return format_response(recent)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/simulate")
async def simulate_risk(volume_increase: float = 0.2):
    # For simulation, we'll use a sample from creditcard.csv or transactions.csv
    data_path = pathlib.Path(__file__).parent.parent / "data" / "transactions.csv"
    try:
        import numpy as np # Ensure numpy is available
        df = pd.read_csv(data_path)
        sample_batch = [np.random.randn(30).tolist() for _ in range(100)]
        result = simulator.run_projection(sample_batch, volume_increase=volume_increase)
        return format_response(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dashboard/trends")
async def get_trends():
    data_path = pathlib.Path(__file__).parent.parent / "data" / "transactions.csv"
    try:
        df = pd.read_csv(data_path)
        df["timestamp"] = pd.to_datetime(df["timestamp"])
        trends = df.groupby(df["timestamp"].dt.date).agg({
            "is_fraud": "sum",
            "amount": "sum"
        }).reset_index()
        
        result = []
        for _, row in trends.iterrows():
            result.append({
                "date": str(row["timestamp"]),
                "fraud_count": int(row["is_fraud"]),
                "total_volume": float(row["amount"])
            })
        return format_response(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


