# RiskLens AI

AI-powered Risk Assessment and Simulation Platform.

## Architecture

```
risklens-ai/
├── backend/
│   ├── app/
│   │   ├── main.py (FastAPI)
│   │   ├── model.py (Risk Models)
│   │   ├── simulator.py (Simulations)
│   │   ├── explain.py (Explainability)
│   │   └── utils.py
│   ├── data/
│   │   ├── transactions.csv
│   │   └── generate_data.py
│   └── requirements.txt
├── frontend/ (React + Vite + Tailwind)
└── README.md
```

## Setup

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. Generate data: `python data/generate_data.py`
4. Start server: `uvicorn backend.app.main:app --reload` (from root)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
