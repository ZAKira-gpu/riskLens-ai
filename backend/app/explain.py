import shap
import joblib
import pandas as pd
import pathlib

class Explainer:
    def __init__(self):
        model_path = pathlib.Path(__file__).parent.parent.parent / "fraud_model.pkl"
        try:
            self.model = joblib.load(model_path)
            # Create SHAP explainer
            self.explainer = shap.TreeExplainer(self.model)
        except Exception as e:
            print(f"Error initializing Explainer: {e}")
            self.explainer = None

    def explain_prediction(self, feature_vector: list):
        if self.explainer is None:
            return {"error": "Explainer not initialized"}

        columns = ["Time"] + [f"V{i}" for i in range(1, 29)] + ["Amount"]
        X = pd.DataFrame([feature_vector], columns=columns)
        
        shap_values = self.explainer.shap_values(X)
        
        # Format expectations for the dashboard
        # Return top 5 features contributing to the score
        feature_importance = []
        # shap_values for binary XGBoost can be a single array or list of arrays depending on version
        vals = shap_values[0] if isinstance(shap_values, list) else shap_values
        
        for i, val in enumerate(vals[0]):
            feature_importance.append({
                "feature": columns[i],
                "impact": float(val)
            })
            
        # Sort by absolute impact
        feature_importance.sort(key=lambda x: abs(x["impact"]), reverse=True)
        
        return {
            "top_features": feature_importance[:5],
            "base_value": float(self.explainer.expected_value)
        }

