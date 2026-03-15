"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Maximize2, Layers, Navigation, Crosshair } from "lucide-react";
import { ApiService } from "@/lib/api";

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });
const useMap = dynamic(() => import('react-leaflet').then(mod => mod.useMap), { ssr: false });

// Heatmap data - high risk coordinates near Noida
const heatmapData = [
  [28.6139, 77.2090, 0.8], // High risk point 1
  [28.6200, 77.2200, 0.9], // High risk point 2
  [28.6050, 77.2150, 0.7], // High risk point 3
];

// Sample incidents with real coordinates (converted from percentage)
const incidents = [
  { id: 1, lat: 28.6139, lng: 77.2090, type: "flood", severity: "high" },
  { id: 2, lat: 28.6200, lng: 77.2200, type: "fire", severity: "critical" },
  { id: 3, lat: 28.6050, lng: 77.2150, type: "accident", severity: "medium" },
];

// Sample ambulances with real coordinates
const ambulances = [
  { id: "AMB-01", lat: 28.6080, lng: 77.2100 },
  { id: "AMB-02", lat: 28.6180, lng: 77.2250 },
  { id: "AMB-03", lat: 28.6020, lng: 77.2180 },
];

// Component to add heatmap to the map
const HeatmapAdder = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const addHeatmap = async () => {
      try {
        const L = await import('leaflet')
        await import('leaflet.heat')

        const heatLayer = (L as any).heatLayer(heatmapData, {
          radius: 25,
          blur: 15,
          maxZoom: 10
        });
        heatLayer.addTo(map);
      } catch (error) {
        console.error('Failed to add heatmap:', error);
      }
    };

    addHeatmap();
  }, [map]);

  return null;
};

// Animated Ambulance Marker Component
const AnimatedAmbulanceMarker = ({ position }: { position: [number, number] | null }) => {
  const [ambulanceIcon, setAmbulanceIcon] = useState<any>(null);

  useEffect(() => {
    // Create custom ambulance icon
    const createIcon = async () => {
      const L = await import('leaflet');

      const icon = L.default.divIcon({
        html: `
          <div style="
            background: white;
            border: 2px solid #ef4444;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            animation: pulse 2s infinite;
          ">
            <div style="
              color: #ef4444;
              font-size: 16px;
            ">🚑</div>
          </div>
          <style>
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
          </style>
        `,
        className: 'custom-ambulance-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      setAmbulanceIcon(icon);
    };

    createIcon();
  }, []);

  if (!position || !ambulanceIcon) return null;

  return (
    <Marker position={position} icon={ambulanceIcon}>
      <Popup>
        <div className="text-sm">
          <strong>🚑 Ambulance En Route</strong><br />
          Following optimized emergency route
        </div>
      </Popup>
    </Marker>
  );
};

export function EmergencyMap() {
  const [pulse, setPulse] = useState(false);
  const [realRoute, setRealRoute] = useState<[number, number][] | null>(null);
  const [animatedPosition, setAnimatedPosition] = useState<[number, number] | null>(null);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        // Sample coordinates for Noida, India (where the backend graph is generated)
        const routeData = {
          start_lat: 28.5355,
          start_lon: 77.3910,
          end_lat: 28.6139,
          end_lon: 77.2090,
        };
        const routeCoords = await ApiService.getRoute(routeData);
        setRealRoute(routeCoords);
      } catch (error) {
        console.error('Failed to fetch route:', error);
      }
    };

    if (isClient) {
      fetchRoute();
    }
  }, [isClient]);

  // Animation effect for ambulance movement
  useEffect(() => {
    if (!realRoute || realRoute.length === 0) {
      setAnimatedPosition(null);
      setAnimationIndex(0);
      return;
    }

    // Start from the beginning of the route
    setAnimatedPosition(realRoute[0]);
    setAnimationIndex(0);

    const interval = setInterval(() => {
      setAnimationIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % realRoute.length;
        setAnimatedPosition(realRoute[nextIndex]);
        return nextIndex;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [realRoute]);

  // Don't render on server
  if (!isClient) {
    return (
      <Card className="col-span-2 row-span-2 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-medium">Emergency Routes & Risk Heatmap</CardTitle>
            <Badge variant="outline" className="border-primary/50 text-primary">
              Loading...
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <div className="relative h-full min-h-[500px] w-full overflow-hidden rounded-b-lg bg-muted flex items-center justify-center">
            <div className="text-muted-foreground">Loading map...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 row-span-2 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <CardTitle className="text-base font-medium">Emergency Routes & Risk Heatmap</CardTitle>
          <Badge variant="outline" className="border-primary/50 text-primary">
            Live
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Layers className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Crosshair className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="relative h-full w-full overflow-hidden rounded-b-lg">
          <MapContainer
            center={[28.6139, 77.2090]}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
            className="rounded-b-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {/* Heatmap Layer */}
            <HeatmapAdder />

            {/* Route Polyline */}
            {realRoute && (
              <Polyline
                positions={realRoute}
                color="blue"
                weight={4}
                opacity={0.8}
              />
            )}

            {/* Incident Markers */}
            {incidents.map((incident) => (
              <Marker
                key={incident.id}
                position={[incident.lat, incident.lng]}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{incident.type.toUpperCase()}</strong><br />
                    Severity: {incident.severity}
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Ambulance Markers */}
            {ambulances.map((amb) => (
              <Marker
                key={amb.id}
                position={[amb.lat, amb.lng]}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{amb.id}</strong><br />
                    Ambulance Unit
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Animated Ambulance Marker */}
            <AnimatedAmbulanceMarker position={animatedPosition} />
          </MapContainer>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 z-[1000] flex flex-col gap-1 rounded-lg bg-card/90 p-2 text-xs backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-4 rounded-sm bg-blue-500" />
              <span className="text-muted-foreground">Active Route</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-muted-foreground">High Risk Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              <span className="text-muted-foreground">Incident</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span className="text-muted-foreground">Ambulance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-lg">🚑</span>
              <span className="text-muted-foreground">En Route (Animated)</span>
            </div>
            {realRoute && (
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">API Route Loaded</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
