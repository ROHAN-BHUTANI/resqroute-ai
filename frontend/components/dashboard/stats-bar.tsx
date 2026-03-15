"use client";

import { Activity, Clock, Zap, Ambulance } from "lucide-react";
import { useState, useEffect } from "react";

const stats = [
  {
    label: "Active Emergencies",
    value: 12,
    icon: Activity,
    color: "text-destructive",
  },
  {
    label: "Average Response Time",
    value: 4.2,
    icon: Clock,
    color: "text-chart-2",
    suffix: "m",
  },
  {
    label: "AI Risk Score",
    value: 7.8,
    icon: Zap,
    color: "text-warning",
    decimals: 1,
  },
  {
    label: "Ambulances Active",
    value: 23,
    icon: Ambulance,
    color: "text-primary",
  },
];

export function StatsBar() {
  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));

  useEffect(() => {
    const duration = 2000; // 2 seconds animation
    const steps = 60; // 60 fps
    const increment = duration / steps;

    stats.forEach((stat, index) => {
      let current = 0;
      const target = stat.value;
      const step = target / steps;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedValues(prev => {
          const newValues = [...prev];
          newValues[index] = current;
          return newValues;
        });
      }, increment);
    });
  }, []);

  const formatValue = (value: number, decimals?: number, suffix?: string) => {
    const formatted = decimals ? value.toFixed(decimals) : Math.round(value).toString();
    return suffix ? `${formatted}${suffix}` : formatted;
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card px-6 py-3">
      {stats.map((stat, index) => (
        <div key={stat.label} className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-secondary`}>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {formatValue(animatedValues[index], stat.decimals, stat.suffix)}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
          {index < stats.length - 1 && (
            <div className="ml-8 h-10 w-px bg-border" />
          )}
        </div>
      ))}
    </div>
  );
}
