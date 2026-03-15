"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Zap,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { ApiService } from "@/lib/api";

const riskFactors = [
  { name: "Weather Impact", value: 78, trend: "+12%" },
  { name: "Traffic Density", value: 65, trend: "+8%" },
  { name: "Population Density", value: 42, trend: "-3%" },
  { name: "Infrastructure Risk", value: 55, trend: "+2%" },
];

const predictions = [
  { event: "Flash Flood Risk", probability: 73, timeframe: "2-4 hrs", severity: "high" },
  { event: "Traffic Congestion", probability: 89, timeframe: "30 min", severity: "medium" },
  { event: "Power Outage", probability: 34, timeframe: "6-8 hrs", severity: "low" },
];

export function AIRiskPanel() {
  const [riskScore, setRiskScore] = useState(76);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Use sample data for demonstration - in a real app, this would come from sensors/APIs
      const riskData = {
        traffic: Math.floor(Math.random() * 100), // 0-100 traffic level
        rainfall: Math.floor(Math.random() * 100), // 0-100 mm rainfall
        damage: Math.floor(Math.random() * 100), // 0-100 damage level
      };

      const score = await ApiService.predictRisk(riskData);
      setRiskScore(score);
    } catch (error) {
      console.error('Failed to get risk prediction:', error);
      // Fallback to mock data if API fails
      setRiskScore(Math.floor(Math.random() * 20) + 70);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* AI Risk Score */}
      <Card className="glass-card neon-border overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-sm font-medium">AI Risk Analysis</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={runAnalysis}
              disabled={isAnalyzing}
            >
              <RefreshCw className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Main Risk Score Gauge */}
          <div className="relative mb-4 flex flex-col items-center">
            <div className="relative h-32 w-32">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={riskScore > 70 ? "hsl(var(--warning))" : "hsl(var(--primary))"}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${riskScore * 2.51} 251`}
                  className="transition-all duration-1000"
                  style={{
                    filter: `drop-shadow(0 0 8px ${riskScore > 70 ? "oklch(0.75 0.18 70 / 0.5)" : "oklch(0.65 0.2 165 / 0.5)"})`,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-foreground">{riskScore}</span>
                <span className="text-xs text-muted-foreground">Risk Score</span>
              </div>
            </div>
            <Badge
              className={`mt-2 ${
                riskScore > 70
                  ? "bg-warning/20 text-warning"
                  : "bg-primary/20 text-primary"
              }`}
            >
              {riskScore > 80 ? "Critical" : riskScore > 70 ? "Elevated" : "Moderate"}
            </Badge>
          </div>

          {/* Risk Factors */}
          <div className="space-y-3">
            {riskFactors.map((factor) => (
              <div key={factor.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{factor.name}</span>
                  <span className="font-medium text-foreground">
                    {factor.value}%
                    <span className={`ml-1 ${factor.trend.startsWith("+") ? "text-warning" : "text-primary"}`}>
                      {factor.trend}
                    </span>
                  </span>
                </div>
                <Progress
                  value={factor.value}
                  className={`h-1.5 ${
                    factor.value > 70
                      ? "[&>div]:bg-warning"
                      : factor.value > 50
                      ? "[&>div]:bg-chart-2"
                      : "[&>div]:bg-primary"
                  }`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Traffic Severity Gauge */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/20">
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
            <CardTitle className="text-sm font-medium">Traffic Severity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
              style={{
                width: "72%",
                background: "linear-gradient(90deg, oklch(0.65 0.2 165), oklch(0.75 0.18 70), oklch(0.6 0.22 25))",
              }}
            />
            <div
              className="absolute top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-foreground shadow-lg"
              style={{ left: "72%" }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
            <span>Severe</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Current Level</span>
            <Badge className="bg-warning/20 text-warning">High - 72%</Badge>
          </div>
        </CardContent>
      </Card>

      {/* AI Predictions */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-sm font-medium">Predictions</CardTitle>
            </div>
            <Badge variant="outline" className="border-primary/50 text-primary text-[10px]">
              <Zap className="mr-1 h-3 w-3" />
              ML Model v2.4
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {predictions.map((pred) => (
            <div
              key={pred.event}
              className="flex items-center justify-between rounded-lg bg-secondary/50 p-2"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    pred.severity === "high"
                      ? "bg-destructive"
                      : pred.severity === "medium"
                      ? "bg-warning"
                      : "bg-primary"
                  }`}
                />
                <div>
                  <p className="text-xs font-medium text-foreground">{pred.event}</p>
                  <p className="text-[10px] text-muted-foreground">{pred.timeframe}</p>
                </div>
              </div>
              <span
                className={`text-sm font-bold ${
                  pred.probability > 70
                    ? "text-destructive"
                    : pred.probability > 50
                    ? "text-warning"
                    : "text-muted-foreground"
                }`}
              >
                {pred.probability}%
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
