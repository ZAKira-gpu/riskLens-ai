import numpy as np
import pandas as pd
import joblib
import pathlib

class Simulator:
    def __init__(self):
        model_path = pathlib.Path(__file__).parent.parent.parent / "fraud_model.pkl"
        try:
            self.model = joblib.load(model_path)
        except:
            self.model = None

    def run_projection(self, base_transactions: list, volume_increase: float = 0.2, iterations: int = 100):
        """
        Runs a Monte Carlo simulation to project future fraud based on volume increases.
        """
        if self.model is None or not base_transactions:
            return {"error": "Model or data not available"}

        # Convert to DataFrame
        columns = ["Time"] + [f"V{i}" for i in range(1, 29)] + ["Amount"]
        df_base = pd.DataFrame(base_transactions, columns=columns)
        
        projected_losses = []
        
        for _ in range(iterations):
            # Sample with replacement to simulate increased volume
            num_samples = int(len(df_base) * (1 + volume_increase))
            sim_batch = df_base.sample(n=num_samples, replace=True)
            
            # Predict fraud on the batch
            probs = self.model.predict_proba(sim_batch)[:, 1]
            # Consider as fraud if prob > 0.5 (or use a threshold)
            is_fraud = (probs > 0.5).astype(int)
            
            # Calculate total loss for this iteration
            loss = (sim_batch["Amount"] * is_fraud).sum()
            projected_losses.append(float(loss))
            
        return {
            "mean_projected_loss": float(np.mean(projected_losses)),
            "std_dev": float(np.std(projected_losses)),
            "p95_loss": float(np.percentile(projected_losses, 95)),
            "iterations": iterations
        }

