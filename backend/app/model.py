import joblib
import pandas as pd
import pathlib

class RiskModel:
    def __init__(self):
        # Resolve the model path relative to this file
        model_path = pathlib.Path(__file__).parent.parent.parent / "fraud_model.pkl"
        try:
            self.model = joblib.load(model_path)
            print(f"Model loaded successfully from {model_path}")
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = None

    def predict(self, feature_vector: list):
        if self.model is None:
            return {"risk_score": 0.0, "rating": "Error: Model not loaded"}
        
        # XGBoost expects 30 features matching the columns in creditcard.csv
        columns = ["Time"] + [f"V{i}" for i in range(1, 29)] + ["Amount"]
        
        if len(feature_vector) != 30:
            return {"risk_score": 0.0, "rating": "Error: Incorrect feature length"}

        X = pd.DataFrame([feature_vector], columns=columns)
        
        # Get probability of class 1 (Fraud)
        prob = self.model.predict_proba(X)[0, 1]
        
        rating = "Low"
        if prob > 0.8:
            rating = "High"
        elif prob > 0.5:
            rating = "Medium"
            
        return {"risk_score": float(prob), "rating": rating}
