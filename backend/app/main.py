from fastapi import FastAPI
import pandas as pd
from app.model import FraudModel

app = FastAPI()
model = FraudModel()

df = pd.read_csv("../data/transactions.csv")
model.train(df)

@app.get("/analyze")
def analyze():
    result = model.predict(df)
    return result.head(50).to_dict(orient="records")
