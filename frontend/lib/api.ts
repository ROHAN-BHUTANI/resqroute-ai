const API_BASE = "http://localhost:5000";

export interface RiskPredictionRequest {
  traffic: number;
  rainfall: number;
  damage: number;
}

export interface RiskPredictionResponse {
  risk_score: number;
}

export interface RouteRequest {
  start_lat: number;
  start_lon: number;
  end_lat: number;
  end_lon: number;
}

export interface RouteResponse {
  route: [number, number][];
}

export class ApiService {
  static async predictRisk(data: RiskPredictionRequest): Promise<number> {
    try {
      const response = await fetch(`${API_BASE}/predict-risk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result: RiskPredictionResponse = await response.json();
      return result.risk_score;
    } catch (error) {
      console.error('Error predicting risk:', error);
      throw error;
    }
  }

  static async getRoute(data: RouteRequest): Promise<[number, number][]> {
    try {
      const response = await fetch(`${API_BASE}/route`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result: RouteResponse = await response.json();
      return result.route;
    } catch (error) {
      console.error('Error getting route:', error);
      throw error;
    }
  }
}