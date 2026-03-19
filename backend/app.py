from flask import Flask, request, jsonify
from flask_cors import CORS

from risk_model import predict_risk
from routing import generate_graph, find_route
from config import CITY

app = Flask(__name__)
CORS(app)

CITY_GRAPH = generate_graph(CITY)


@app.route("/")
def home():
    return {"message": "ResQRoute AI Backend Running", "city": CITY}

@app.route("/health")
def health():
    return {"status": "ok", "graph_loaded": CITY_GRAPH is not None}


@app.route("/predict-risk", methods=["POST"])
def risk():
    try:
        data = request.json
        traffic = data.get("traffic", 0)
        rainfall = data.get("rainfall", 0)
        damage = data.get("damage", 0)
        score = predict_risk(traffic, rainfall, damage)
        return jsonify({"risk_score": score})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/route", methods=["POST"])
def route():
    try:
        data = request.json
        start_lat = data.get("start_lat", 28.5355)
        start_lon = data.get("start_lon", 77.3910)
        end_lat = data.get("end_lat", 28.5300)
        end_lon = data.get("end_lon", 77.3800)
        route_coords = find_route(
            CITY_GRAPH,
            start_lat,
            start_lon,
            end_lat,
            end_lon
        )
        return jsonify({"route": route_coords})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)