from flask import Flask, request, jsonify
from flask_cors import CORS

from risk_model import predict_risk
from routing import generate_graph, find_route

app = Flask(__name__)
CORS(app)

CITY_GRAPH = None


@app.route("/")
def home():
    return {"message": "ResQRoute AI Backend Running"}


@app.route("/predict-risk", methods=["POST"])
def risk():

    data = request.json

    traffic = data["traffic"]
    rainfall = data["rainfall"]
    damage = data["damage"]

    score = predict_risk(traffic, rainfall, damage)

    return jsonify({"risk_score": score})


@app.route("/route", methods=["POST"])
def route():
    global CITY_GRAPH

    data = request.json

    start_lat = data["start_lat"]
    start_lon = data["start_lon"]

    end_lat = data["end_lat"]
    end_lon = data["end_lon"]

    if CITY_GRAPH is None:
        CITY_GRAPH = generate_graph("Noida, India")

    route_coords = find_route(
        CITY_GRAPH,
        start_lat,
        start_lon,
        end_lat,
        end_lon
    )

    return jsonify({"route": route_coords})


if __name__ == "__main__":
    app.run(debug=True)