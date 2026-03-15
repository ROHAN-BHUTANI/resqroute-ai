"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Ambulance,
  Battery,
  Fuel,
  MapPin,
  User,
  Radio,
  ChevronRight,
} from "lucide-react";

const ambulances = [
  {
    id: "AMB-01",
    status: "en-route",
    driver: "J. Martinez",
    eta: "3 min",
    destination: "Block 7, Sector 12",
    battery: 78,
    fuel: 65,
    incident: "Structure Fire",
  },
  {
    id: "AMB-02",
    status: "on-scene",
    driver: "S. Chen",
    eta: null,
    destination: "Highway 45",
    battery: 92,
    fuel: 45,
    incident: "Vehicle Collision",
  },
  {
    id: "AMB-03",
    status: "available",
    driver: "R. Johnson",
    eta: null,
    destination: "Station 4",
    battery: 100,
    fuel: 88,
    incident: null,
  },
  {
    id: "AMB-04",
    status: "returning",
    driver: "M. Davis",
    eta: "12 min",
    destination: "Station 2",
    battery: 45,
    fuel: 30,
    incident: null,
  },
];

const statusConfig = {
  "en-route": { color: "bg-primary text-primary-foreground", label: "En Route" },
  "on-scene": { color: "bg-warning text-warning-foreground", label: "On Scene" },
  available: { color: "bg-success text-success-foreground", label: "Available" },
  returning: { color: "bg-chart-2 text-foreground", label: "Returning" },
};

export function AmbulanceTracking() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-medium">Fleet Status</CardTitle>
          <Badge variant="outline" className="border-primary/50 text-primary">
            {ambulances.filter((a) => a.status === "available").length} Available
          </Badge>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Manage
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {ambulances.map((amb) => (
          <div
            key={amb.id}
            className="group rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Ambulance className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{amb.id}</span>
                    <Badge
                      className={`border-0 text-[10px] ${
                        statusConfig[amb.status as keyof typeof statusConfig].color
                      }`}
                    >
                      {statusConfig[amb.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    {amb.driver}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <Radio className="h-4 w-4" />
              </Button>
            </div>

            {(amb.incident || amb.eta) && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{amb.destination}</span>
                {amb.eta && <span className="font-medium text-primary">ETA {amb.eta}</span>}
              </div>
            )}

            <div className="mt-3 flex items-center gap-4">
              <div className="flex flex-1 items-center gap-2">
                <Battery className="h-3 w-3 text-muted-foreground" />
                <Progress
                  value={amb.battery}
                  className="h-1.5 flex-1"
                />
                <span className="text-[10px] text-muted-foreground">{amb.battery}%</span>
              </div>
              <div className="flex flex-1 items-center gap-2">
                <Fuel className="h-3 w-3 text-muted-foreground" />
                <Progress
                  value={amb.fuel}
                  className={`h-1.5 flex-1 ${amb.fuel < 40 ? "[&>div]:bg-warning" : ""}`}
                />
                <span className="text-[10px] text-muted-foreground">{amb.fuel}%</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
