"use client";

import { Bell, Settings, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground">
              ResQRoute AI
            </span>
            <span className="text-xs text-muted-foreground">
              Disaster Response Platform
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search incidents..."
            className="w-64 bg-secondary pl-9"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-destructive p-0 text-xs text-destructive-foreground">
            3
          </Badge>
        </Button>

        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2 border-l border-border pl-3">
          <div className="h-8 w-8 rounded-full bg-primary/20" />
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-medium text-foreground">Ops Team</span>
            <span className="text-xs text-muted-foreground">Emergency Coordinator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
