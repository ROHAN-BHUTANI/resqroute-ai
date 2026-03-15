"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Flame,
  Droplets,
  Wind,
  Car,
  ChevronRight,
  Clock,
} from "lucide-react";

const alerts = [
  {
    id: 1,
    type: "fire",
    icon: Flame,
    title: "Structure Fire - Industrial Zone",
    location: "Block 7, Sector 12",
    time: "2 min ago",
    severity: "critical",
    units: 4,
  },
  {
    id: 2,
    type: "flood",
    icon: Droplets,
    title: "Flash Flood Warning",
    location: "River Valley District",
    time: "8 min ago",
    severity: "high",
    units: 2,
  },
  {
    id: 3,
    type: "accident",
    icon: Car,
    title: "Multi-Vehicle Collision",
    location: "Highway 45, Mile 23",
    time: "15 min ago",
    severity: "high",
    units: 3,
  },
  {
    id: 4,
    type: "weather",
    icon: Wind,
    title: "Severe Storm Alert",
    location: "Northern Region",
    time: "23 min ago",
    severity: "medium",
    units: 0,
  },
  {
    id: 5,
    type: "general",
    icon: AlertTriangle,
    title: "Power Grid Failure",
    location: "Central Business District",
    time: "45 min ago",
    severity: "medium",
    units: 1,
  },
];

const severityColors = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-warning text-warning-foreground",
  medium: "bg-chart-2 text-foreground",
};

export function AlertsPanel() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-medium">Disaster Alerts</CardTitle>
          <Badge className="bg-destructive/20 text-destructive">
            {alerts.filter((a) => a.severity === "critical").length} Critical
          </Badge>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          View All
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[340px]">
          <div className="space-y-1 p-4 pt-0">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="group flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors hover:bg-secondary"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    alert.severity === "critical"
                      ? "bg-destructive/20 text-destructive"
                      : alert.severity === "high"
                      ? "bg-warning/20 text-warning"
                      : "bg-chart-2/20 text-chart-2"
                  }`}
                >
                  <alert.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {alert.title}
                    </p>
                    <Badge
                      variant="outline"
                      className={`ml-2 shrink-0 border-0 text-[10px] ${
                        severityColors[alert.severity as keyof typeof severityColors]
                      }`}
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.location}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {alert.time}
                    </span>
                    {alert.units > 0 && (
                      <span className="text-primary">{alert.units} units assigned</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
