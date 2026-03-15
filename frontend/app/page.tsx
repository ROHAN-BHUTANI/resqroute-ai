import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { EmergencyMap } from "@/components/dashboard/emergency-map";
import { RiskScoreCards } from "@/components/dashboard/risk-score-cards";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { AmbulanceTracking } from "@/components/dashboard/ambulance-tracking";
import { StatsBar } from "@/components/dashboard/stats-bar";

export default function DashboardPage() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Top Stats Bar */}
            <div className="hidden md:block">
              <StatsBar />
            </div>

            {/* Risk Score Cards */}
            <RiskScoreCards />

            {/* Main Grid - Map + Panels */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Emergency Map - Takes 2 columns */}
              <div className="lg:col-span-2">
                <EmergencyMap />
              </div>

              {/* Right Column - Alerts */}
              <div className="lg:col-span-1">
                <AlertsPanel />
              </div>
            </div>

            {/* Ambulance Tracking */}
            <AmbulanceTracking />
          </div>
        </main>
      </div>
    </div>
  );
}
