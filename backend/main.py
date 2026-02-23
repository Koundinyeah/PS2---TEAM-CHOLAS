from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

from services.stress_engine import calculate_wsi, classify_stress
from services.prediction_engine import predict_rainfall_trend, predict_groundwater_trend
from services.allocation_engine import calculate_tanker_demand, calculate_priority

app = FastAPI()

# VERY IMPORTANT — CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/dashboard")
def get_dashboard():
    with open("data/villages.json") as f:
        villages = json.load(f)

    result = []

    for v in villages:
        wsi = calculate_wsi(v)
        stress = classify_stress(wsi)

        rainfall_prediction = predict_rainfall_trend(v["rainfall_history"])
        groundwater_prediction = predict_groundwater_trend(v["groundwater_level"])

        tankers = calculate_tanker_demand(v, wsi)
        priority = calculate_priority(v, wsi)

        result.append({
            "name": v["name"],
            "population": v["population"],
            "wsi": wsi,
            "stress_level": stress,
            "rainfall_prediction": rainfall_prediction,
            "groundwater_prediction": groundwater_prediction,
            "tankers_required": tankers,
            "priority_score": priority,
            "lat": v["lat"],
            "lng": v["lng"],
             "rainfall_history": v["rainfall_history"]
        })

    result.sort(key=lambda x: x["priority_score"], reverse=True)

    return result