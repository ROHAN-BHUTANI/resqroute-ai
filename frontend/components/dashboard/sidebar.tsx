"use client";

import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  Ambulance,
  Users,
  BarChart3,
  Settings,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Map, label: "Routes", active: false },
  { icon: AlertTriangle, label: "Alerts", active: false },
  { icon: Ambulance, label: "Fleet", active: false },
  { icon: Users, label: "Teams", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Radio, label: "Comms", active: false },
];

export function DashboardSidebar() {
  return (
    <aside className="hidden w-16 flex-col items-center border-r border-border bg-sidebar py-4 lg:flex">
      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "group flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
              item.active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="sr-only">{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground">
        <Settings className="h-5 w-5" />
      </button>
    </aside>
  );
}
