def predict_risk(traffic, rainfall, road_damage):

    traffic_weight = 0.4
    rainfall_weight = 0.3
    damage_weight = 0.3

    risk_score = (
        traffic * traffic_weight +
        rainfall * rainfall_weight +
        road_damage * damage_weight
    )

    return round(risk_score, 2)