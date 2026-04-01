# HeartRisk Pro: Clinical Heart Failure Assessment

**HeartRisk Pro** is a professional-grade clinical tool designed to predict heart failure risk using advanced machine learning. It provides healthcare professionals with data-driven risk scores (0-100%), risk categories, and personalized clinical recommendations based on a patient's clinical profile.

## 🚀 Key Features

- **XGBoost Inference Engine**: High-precision risk assessment based on clinical records.
- **Dynamic Risk Visualization**: A visually prominent risk gauge for immediate interpretation.
- **AI-Augmented Recommendations**: Personalized clinical advice generated via LLM based on patient-specific metrics.
- **Modern Medical UX**: A clean, accessible interface built with React and Tailwind CSS.
- **Technology Validation**: Built using industry-standard Python (XGBoost/Scikit-learn) and NextToken AI.

## 📂 Project Structure

```text
├── backend/
│   ├── main.py            # Primary API and inference logic
│   ├── model/             # Pre-trained model weights (heart_model.pkl, scaler.pkl)
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── src/               # React source code (App.tsx, features, UI components)
│   ├── public/assets/     # Clinical imagery and branding logos
│   └── package.json       # Node.js dependencies
└── README.md              # Project documentation
```

## 🛠️ How to Run

### Option 1: Run in NextToken (Recommended)

To launch the app within a NextToken workspace:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/littlestuart07/heartrisk-pro.git
   ```
2. **Install dependencies**:
   ```bash
   pip install -r heartrisk-pro/backend/requirements.txt
   ```
3. **Launch the application**:
   Use the following Python snippet in your workspace:
   ```python
   from nexttoken import NextToken
   client = NextToken()
   client.apps.launch(
       app_name="heart_risk", 
       app_path="heartrisk-pro/frontend/dist/index.html"
   )
   ```

### Option 2: Local Development

1. **Backend**: Install `requirements.txt` and run `python backend/main.py`.
2. **Frontend**: Navigate to the `frontend/` directory, run `npm install` followed by `npm run dev`.

## 🧪 Model Methodology

The prediction engine utilizes an **XGBoost Classifier** trained on 12 key clinical features:
- **Demographics**: Age, Sex, Smoking status.
- **Vitals**: High Blood Pressure, Ejection Fraction.
- **Blood Chemistry**: Serum Creatinine, Serum Sodium, Platelets, Creatinine Phosphokinase.
- **Medical History**: Anaemia, Diabetes.
- **Clinical Context**: Follow-up Period (days).

## 🛡️ License

This project is licensed under the MIT License.

---
*Developed with NextToken AI*
