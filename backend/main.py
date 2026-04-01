import os
import joblib
import pandas as pd
import numpy as np
from nexttoken import NextToken

# Constants
MODEL_PATH = "apps/heart_risk/backend/model/heart_model.pkl"
SCALER_PATH = "apps/heart_risk/backend/model/scaler.pkl"

# Feature order as specified
FEATURE_ORDER = [
    "age", "anaemia", "creatinine_phosphokinase", "diabetes", 
    "ejection_fraction", "high_blood_pressure", "platelets", 
    "serum_creatinine", "serum_sodium", "sex", "smoking", "time"
]

def _load_assets():
    """Load model and scaler from disk."""
    print(f"[BACKEND_STEP] Loading assets from {MODEL_PATH} and {SCALER_PATH}")
    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
        raise FileNotFoundError("Model or Scaler file not found. Ensure they are in apps/heart_risk/backend/model/")
    
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    return model, scaler

def predict_risk(**kwargs) -> dict:
    """
    Predict heart failure risk based on 12 clinical features.
    """
    print(f"[BACKEND_START] predict_risk called with {len(kwargs)} features")
    
    try:
        # 1. Extract and validate features
        features = []
        for feat in FEATURE_ORDER:
            if feat not in kwargs:
                print(f"[BACKEND_ERROR] Missing feature: {feat}")
                raise ValueError(f"Missing required feature: {feat}")
            features.append(float(kwargs[feat]))
        
        # 2. Load assets
        model, scaler = _load_assets()
        
        # 3. Prepare data for prediction
        # Create DataFrame to ensure feature names match if scaler/model expects it, 
        # but the order is the key here.
        df = pd.DataFrame([features], columns=FEATURE_ORDER)
        
        # 4. Scale features
        print("[BACKEND_STEP] Scaling features")
        scaled_features = scaler.transform(df)
        
        # 5. Predict
        print("[BACKEND_STEP] Running inference")
        # Predict probability
        risk_score = float(model.predict_proba(scaled_features)[0][1])
        # Predict class
        prediction = int(model.predict(scaled_features)[0])
        
        risk_category = "High Risk" if prediction == 1 else "Low Risk"
        
        # 6. Generate recommendations (using LLM for better quality if possible, otherwise rule-based)
        recommendations = _get_recommendations(risk_score, kwargs)
        
        result = {
            "risk_score": round(risk_score, 4),
            "risk_category": risk_category,
            "prediction": prediction,
            "recommendations": recommendations
        }
        
        print(f"[BACKEND_SUCCESS] Prediction complete: {risk_category} ({risk_score:.4f})")
        return result

    except Exception as e:
        print(f"[BACKEND_ERROR] predict_risk failed: {type(e).__name__}: {str(e)}")
        raise

def _get_recommendations(risk_score: float, patient_data: dict) -> list[str]:
    """Generate recommendations based on risk and clinical metrics."""
    print("[BACKEND_STEP] Generating recommendations")
    
    # Try using LLM for professional recommendations
    try:
        client = NextToken()
        prompt = f"""
        As a clinical cardiologist, provide 3-4 specific medical recommendations for a patient with the following profile:
        - Risk Score (0-1 scale): {risk_score:.2f}
        - Age: {patient_data.get('age')}
        - Serum Creatinine: {patient_data.get('serum_creatinine')}
        - Ejection Fraction: {patient_data.get('ejection_fraction')}
        - Serum Sodium: {patient_data.get('serum_sodium')}
        - Smoking: {'Yes' if patient_data.get('smoking') == 1 else 'No'}
        - Diabetes: {'Yes' if patient_data.get('diabetes') == 1 else 'No'}
        - High Blood Pressure: {'Yes' if patient_data.get('high_blood_pressure') == 1 else 'No'}
        
        Return a simple list of strings, one per recommendation. No preamble.
        Focus on clinical markers like creatinine, ejection fraction, and sodium if they are abnormal.
        """
        
        response = client.chat.completions.create(
            model="gemini-2.5-flash-lite",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        content = response.choices[0].message.content.strip()
        # Parse potential JSON list or markdown list
        if content.startswith("[") and content.endswith("]"):
            import json
            try:
                recommendations = json.loads(content)
            except:
                recommendations = [r.strip("- ").strip() for r in content.split("\n") if r.strip()]
        else:
            recommendations = [r.strip("- ").strip() for r in content.split("\n") if r.strip()]
        
        if recommendations:
            return [str(r) for r in recommendations if r][:4]
    except Exception as e:
        print(f"[BACKEND_STEP] LLM recommendation failed, falling back to rules: {e}")

    # Fallback Rule-based recommendations
    recs = []
    if risk_score > 0.5:
        recs.append("Consult a cardiologist immediately for a comprehensive evaluation.")
    else:
        recs.append("Maintain regular check-ups with your primary care physician.")
    
    if patient_data.get("ejection_fraction", 100) < 35:
        recs.append("Monitor ejection fraction closely; consider discussion of beta-blockers or ACE inhibitors.")
    
    if patient_data.get("serum_creatinine", 0) > 1.2:
        recs.append("Monitor renal function; serum creatinine is slightly elevated.")
        
    if patient_data.get("smoking") == 1:
        recs.append("Smoking cessation is highly recommended to reduce cardiovascular strain.")
        
    return recs[:4]

def get_feature_info() -> list[dict]:
    """Return metadata about clinical features for UI form building."""
    print("[BACKEND_START] get_feature_info called")
    features = [
        {"name": "age", "label": "Age", "min": 0, "max": 120, "type": "number", "description": "Patient age in years"},
        {"name": "anaemia", "label": "Anaemia", "options": [{"label": "No", "value": 0}, {"label": "Yes", "value": 1}], "type": "select", "description": "Decrease of red blood cells or hemoglobin"},
        {"name": "creatinine_phosphokinase", "label": "Creatinine Phosphokinase", "min": 0, "max": 10000, "type": "number", "description": "Level of CPK enzyme in the blood (mcg/L)"},
        {"name": "diabetes", "label": "Diabetes", "options": [{"label": "No", "value": 0}, {"label": "Yes", "value": 1}], "type": "select", "description": "Whether the patient has diabetes"},
        {"name": "ejection_fraction", "label": "Ejection Fraction", "min": 0, "max": 100, "type": "number", "description": "Percentage of blood leaving the heart at each contraction (%)"},
        {"name": "high_blood_pressure", "label": "High Blood Pressure", "options": [{"label": "No", "value": 0}, {"label": "Yes", "value": 1}], "type": "select", "description": "Whether the patient has hypertension"},
        {"name": "platelets", "label": "Platelets", "min": 0, "max": 1000000, "type": "number", "description": "Platelets in the blood (kiloplatelets/mL)"},
        {"name": "serum_creatinine", "label": "Serum Creatinine", "min": 0, "max": 20, "type": "number", "description": "Level of serum creatinine in the blood (mg/dL)"},
        {"name": "serum_sodium", "label": "Serum Sodium", "min": 100, "max": 150, "type": "number", "description": "Level of serum sodium in the blood (mEq/L)"},
        {"name": "sex", "label": "Sex", "options": [{"label": "Female", "value": 0}, {"label": "Male", "value": 1}], "type": "select", "description": "Patient biological sex"},
        {"name": "smoking", "label": "Smoking", "options": [{"label": "No", "value": 0}, {"label": "Yes", "value": 1}], "type": "select", "description": "Whether the patient smokes"},
        {"name": "time", "label": "Follow-up Period", "min": 0, "max": 300, "type": "number", "description": "Follow-up period (days)"}
    ]
    print(f"[BACKEND_SUCCESS] Returning {len(features)} features")
    return features
