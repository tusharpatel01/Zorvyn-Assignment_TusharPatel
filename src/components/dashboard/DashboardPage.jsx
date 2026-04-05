import React from "react";
import { useApp } from "../../context/AppContext";
import SummaryCards from "./SummaryCards";
import BalanceTrend from "./BalanceTrend";
import SpendingBreakdown from "./SpendingBreakdown";
import RecentTransactions from "./RecentTransactions";
import MonthlyBarChart from "./MonthlyBarChart";
import { Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { state } = useApp();
  const { darkMode, currentUser, role } = state;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const emoji = hour < 12 ? "🌅" : hour < 17 ? "☀️" : "🌙";

  return (
    <div className="space-y-5">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{emoji}</span>
            <h1
              className="text-2xl font-black leading-none"
              style={{
                color: darkMode ? "#fff" : "#0a0a0a",
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "-0.04em",
              }}
            >
              {greeting},{" "}
              <span style={{ color: "#00ff87" }}>{currentUser.name.split(" ")[0]}</span>
            </h1>
          </div>
          <p
            className="text-sm font-medium"
            style={{ color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)" }}
          >
            Here's your financial overview
          </p>
        </div>

        <div className="flex items-center gap-2">
          {role === "viewer" && (
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider"
              style={{
                background: "rgba(96,165,250,0.1)",
                color: "#60a5fa",
                border: "1px solid rgba(96,165,250,0.2)",
              }}
            >
              👁 View Only
            </span>
          )}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider"
            style={{
              background: "rgba(0,255,135,0.08)",
              color: "#00ff87",
              border: "1px solid rgba(0,255,135,0.15)",
            }}
          >
            <Sparkles size={11} />
            Live
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BalanceTrend />
        </div>
        <div>
          <SpendingBreakdown />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <div>
          <MonthlyBarChart />
        </div>
      </div>
    </div>
  );
}