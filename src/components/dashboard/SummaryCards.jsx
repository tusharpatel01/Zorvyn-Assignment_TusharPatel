import React from "react";
import { useApp } from "../../context/AppContext";
import { fmt } from "../../utils/helpers";
import { TrendingUp, TrendingDown, PiggyBank, Activity } from "lucide-react";

export default function SummaryCards() {
  const { summary, state } = useApp();
  const { income, expenses } = summary;
  const { darkMode, transactions } = state;
  const net = income - expenses;
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
  const incomeCount = (transactions || []).filter((t) => t.type === "income").length;
  const expenseCount = (transactions || []).filter((t) => t.type === "expense").length;
  const civicScore = Math.min(100, Math.max(45, Math.round(savingsRate + 40)));

  const cards = [
    {
      label: "Total Income",
      value: fmt(income),
      sub: `${incomeCount} transactions`,
      icon: TrendingDown,
      gradient: ["#00ff87", "#00c853"],
      glow: "rgba(0,255,135,0.25)",
      badge: "+",
      badgeColor: "#00ff87",
    },
    {
      label: "Total Expenses",
      value: fmt(expenses),
      sub: `${expenseCount} transactions`,
      icon: TrendingUp,
      gradient: ["#ff5b5b", "#e53935"],
      glow: "rgba(255,91,91,0.2)",
      badge: "−",
      badgeColor: "#ff5b5b",
    },
    {
      label: "Net Savings",
      value: fmt(Math.abs(net)),
      sub: income > 0 ? `${savingsRate}% savings rate` : "No income recorded",
      icon: PiggyBank,
      gradient: net >= 0 ? ["#00ff87", "#00c853"] : ["#ff5b5b", "#e53935"],
      glow: net >= 0 ? "rgba(0,255,135,0.25)" : "rgba(255,91,91,0.2)",
      badge: net >= 0 ? "↑" : "↓",
      badgeColor: net >= 0 ? "#00ff87" : "#ff5b5b",
      prefix: net >= 0 ? "+" : "-",
    },
    {
      label: "Civic Score",
      value: `${civicScore}`,
      sub: "Spending health index",
      icon: Activity,
      gradient: ["#60a5fa", "#3b82f6"],
      glow: "rgba(96,165,250,0.2)",
      badge: civicScore >= 70 ? "A" : civicScore >= 55 ? "B" : "C",
      badgeColor: civicScore >= 70 ? "#00ff87" : civicScore >= 55 ? "#fbbf24" : "#ff5b5b",
      isScore: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(({ label, value, sub, icon: Icon, gradient, glow, badge, badgeColor, prefix, isScore }) => (
        <div
          key={label}
          className="relative rounded-2xl p-5 overflow-hidden transition-all duration-300 group hover:scale-[1.02] cursor-default"
          style={{
            background: darkMode
              ? "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)"
              : "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,252,248,0.9) 100%)",
            border: darkMode ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.06)",
            boxShadow: darkMode
              ? `0 0 0 1px rgba(255,255,255,0.03), 0 4px 24px rgba(0,0,0,0.3)`
              : `0 2px 20px rgba(0,0,0,0.06)`,
          }}
        >
          {/* Background glow */}
          <div
            className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: glow, filter: "blur(20px)" }}
          />

          {/* Top row */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${gradient[0]}18, ${gradient[1]}0a)`,
                border: `1px solid ${gradient[0]}25`,
              }}
            >
              <Icon size={17} style={{ color: gradient[0] }} />
            </div>

            <span
              className="text-[10px] font-black px-2 py-1 rounded-lg tracking-wider"
              style={{
                background: `${badgeColor}18`,
                color: badgeColor,
                border: `1px solid ${badgeColor}30`,
              }}
            >
              {badge}
            </span>
          </div>

          {/* Value */}
          <p
            className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5"
            style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}
          >
            {label}
          </p>
          <p
            className="text-2xl font-black leading-none mb-1"
            style={{
              color: darkMode ? "#fff" : "#0a0a0a",
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            {prefix}{value}
            {isScore && <span className="text-sm font-medium ml-0.5" style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>/100</span>}
          </p>
          <p
            className="text-[11px] font-medium"
            style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)" }}
          >
            {sub}
          </p>

          {/* Bottom gradient bar */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl opacity-60 group-hover:opacity-100 transition-opacity"
            style={{ background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})` }}
          />
        </div>
      ))}
    </div>
  );
}