TANK_CAPACITY = 10000  # liters

def calculate_tanker_demand(village, wsi):
    deficit_factor = wsi * 500
    required_water = village["population"] * deficit_factor
    tankers = required_water / TANK_CAPACITY
    return max(1, int(tankers))


def calculate_priority(village, wsi):
    base_priority = wsi * village["population"] * village["days_since_last_supply"]
    
    # Fairness adjustment
    adjusted_priority = base_priority / (1 + village["previous_allocations"])
    
    return round(adjusted_priority, 2)