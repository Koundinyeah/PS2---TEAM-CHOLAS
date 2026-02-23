import numpy as np

def predict_rainfall_trend(rainfall_history):
    # Use last 3 months average as short-term forecast
    recent_avg = np.mean(rainfall_history[-3:])
    
    if recent_avg < 40:
        return "High Risk in 30 days"
    elif recent_avg < 60:
        return "Moderate Risk"
    else:
        return "Stable"


def predict_groundwater_trend(groundwater_levels):
    slope = groundwater_levels[-1] - groundwater_levels[0]

    if slope < -5:
        return "Rapid Decline"
    elif slope < -2:
        return "Gradual Decline"
    else:
        return "Stable"