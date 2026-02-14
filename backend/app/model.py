from sklearn.ensemble import IsolationForest
import pandas as pd

class FraudModel:
    def __init__(self):
        self.model = IsolationForest(contamination=0.04)
        self.fitted = False

    def preprocess(self, df):
        df = df.copy()
        df["country"] = df["country"].astype("category").cat.codes
        df["device"] = df["device"].astype("category").cat.codes

        features = df[["amount", "country", "device", "velocity"]]
        return features

    def train(self, df):
        X = self.preprocess(df)
        self.model.fit(X)
        self.fitted = True

    def predict(self, df):
        X = self.preprocess(df)
        scores = self.model.decision_function(X)
        predictions = self.model.predict(X)
        df["risk_score"] = 1 - scores
        df["anomaly"] = predictions
        return df
