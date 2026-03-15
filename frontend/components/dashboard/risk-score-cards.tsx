"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Brain, ShieldAlert, Clock, Route } from "lucide-react";
import { ApiService } from "@/lib/api";

// Circular Risk Gauge Component
const CircularRiskGauge = ({ score, loading }: { score: number; loading: boolean }) => {
  // Normalize score to 0-1 range (assuming max score is 100)
  const normalizedScore = Math.min(score / 100, 1);
  const percentage = Math.round(normalizedScore * 100);
  
  // Determine color based on risk level
  const getRiskColor = (score: number) => {
    if (score <= 0.3) return { primary: '#22c55e', secondary: '#dcfce7' }; // green
    if (score <= 0.6) return { primary: '#eab308', secondary: '#fef3c7' }; // yellow
    return { primary: '#ef4444', secondary: '#fecaca' }; // red
  };
  
  const colors = getRiskColor(normalizedScore);
  
  // Calculate SVG path for the progress arc
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (normalizedScore * circumference);
  
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={colors.primary}
          strokeWidth="8"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${colors.primary}40)`,
          }}
        />
      </svg>
      {/* Center text with animation */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className="text-lg font-bold text-foreground transition-all duration-1000 ease-out"
          key={percentage} // Force re-render for animation
        >
          {loading ? "..." : percentage}
        </span>
        <span className="text-xs text-muted-foreground">%</span>
      </div>
    </div>
  );
};

export function RiskScoreCards() {
  const [aiRiskScore, setAiRiskScore] = useState(76);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiskScore = async () => {
      try {
        // Use sample data - in real app, get from sensors
        const riskData = {
          traffic: 65, // Sample traffic level
          rainfall: 30, // Sample rainfall
          damage: 20, // Sample damage level
        };
        const score = await ApiService.predictRisk(riskData);
        setAiRiskScore(score);
      } catch (error) {
        console.error('Failed to fetch risk score:', error);
        // Keep default value if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchRiskScore();
  }, []);

  const riskMetrics = [
    {
      title: "AI Risk Score",
      value: loading ? "..." : aiRiskScore,
      change: +12,
      trend: "up",
      status: aiRiskScore > 70 ? "elevated" : "good",
      icon: Brain,
      description: "ML-predicted incident probability",
      showGauge: true,
    },
    {
      title: "Response Time",
      value: "4.2",
      unit: "min",
      change: -0.8,
      trend: "down",
      status: "good",
      icon: Clock,
      description: "Avg. time to dispatch",
      showGauge: false,
    },
    {
      title: "Route Efficiency",
      value: 89,
      unit: "%",
      change: +3,
      trend: "up",
      status: "good",
      icon: Route,
      description: "Optimal path utilization",
      showGauge: false,
    },
    {
      title: "Threat Level",
      value: "High",
      change: 0,
      trend: "stable",
      status: "warning",
      icon: ShieldAlert,
      description: "Current regional assessment",
      showGauge: false,
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {riskMetrics.map((metric) => (
        <Card key={metric.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
              <metric.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {metric.showGauge ? (
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <CircularRiskGauge score={aiRiskScore} loading={loading} />
                  <div className="mt-2 flex items-center gap-1">
                    {metric.trend === "up" && (
                      <TrendingUp
                        className={`h-3 w-3 ${
                          metric.status === "good" ? "text-primary" : "text-destructive"
                        }`}
                      />
                    )}
                    {metric.trend === "down" && (
                      <TrendingDown
                        className={`h-3 w-3 ${
                          metric.status === "good" ? "text-primary" : "text-destructive"
                        }`}
                      />
                    )}
                    {metric.trend === "stable" && <Minus className="h-3 w-3 text-warning" />}
                    <span
                      className={`text-xs font-medium ${
                        metric.trend === "stable"
                          ? "text-warning"
                          : metric.status === "good"
                          ? "text-primary"
                          : "text-destructive"
                      }`}
                    >
                      {typeof metric.change === "number"
                        ? `${metric.change > 0 ? "+" : ""}${metric.change}${
                            typeof metric.value === "number" ? "%" : ""
                          }`
                        : "Stable"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Raw Score: {metric.value}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    {metric.value}
                  </span>
                  {metric.unit && (
                    <span className="mb-1 text-lg text-muted-foreground">
                      {metric.unit}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                  <div className="flex items-center gap-1">
                    {metric.trend === "up" && (
                      <TrendingUp
                        className={`h-3 w-3 ${
                          metric.status === "good" ? "text-primary" : "text-destructive"
                        }`}
                      />
                    )}
                    {metric.trend === "down" && (
                      <TrendingDown
                        className={`h-3 w-3 ${
                          metric.status === "good" ? "text-primary" : "text-destructive"
                        }`}
                      />
                    )}
                    {metric.trend === "stable" && <Minus className="h-3 w-3 text-warning" />}
                    <span
                      className={`text-xs font-medium ${
                        metric.trend === "stable"
                          ? "text-warning"
                          : metric.status === "good"
                          ? "text-primary"
                          : "text-destructive"
                      }`}
                    >
                      {typeof metric.change === "number"
                        ? `${metric.change > 0 ? "+" : ""}${metric.change}${
                            typeof metric.value === "number" ? "%" : ""
                          }`
                        : "Stable"}
                    </span>
                  </div>
                </div>
              </>
            )}
            <Badge
              variant="outline"
              className={`absolute right-3 top-3 border-0 text-[10px] ${
                metric.status === "good"
                  ? "bg-primary/10 text-primary"
                  : metric.status === "elevated"
                  ? "bg-warning/10 text-warning"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {metric.status}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
