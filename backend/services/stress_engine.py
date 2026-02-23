import numpy as np

def calculate_rainfall_deviation(rainfall_history):
    avg_rainfall = np.mean(rainfall_history)
    normal_rainfall = 75  # assumed baseline
    deviation = (normal_rainfall - avg_rainfall) / normal_rainfall
    return max(0, round(deviation, 2))


def calculate_groundwater_decline(groundwater_levels):
    decline = groundwater_levels[0] - groundwater_levels[-1]
    return max(0, round(decline / 30, 2))  # normalized


def calculate_wsi(village):
    rainfall_score = calculate_rainfall_deviation(village["rainfall_history"])
    groundwater_score = calculate_groundwater_decline(village["groundwater_level"])
    population_pressure = village["population"] / 10000

    wsi = (
        0.4 * rainfall_score +
        0.4 * groundwater_score +
        0.2 * population_pressure
    )

    return round(wsi, 2)


def classify_stress(wsi):
    if wsi < 0.3:
        return "Safe"
    elif wsi < 0.5:
        return "Moderate"
    elif wsi < 0.7:
        return "Severe"
    else:
        return "Critical"