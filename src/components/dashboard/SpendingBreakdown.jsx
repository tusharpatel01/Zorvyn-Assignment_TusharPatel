import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { groupByCategory, fmt } from "../../utils/helpers";
import { CATEGORIES } from "../../data/mockData";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, darkMode }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div
      className="rounded-2xl p-3 text-xs shadow-2xl"
      style={{
        background: darkMode ? "rgba(5,14,7,0.98)" : "rgba(255,255,255,0.98)",
        border: "1px solid rgba(0,255,135,0.2)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <p className="font-bold" style={{ color: darkMode ? "#fff" : "#000" }}>
        {CATEGORIES[d.name]?.icon} {CATEGORIES[d.name]?.label || d.name}
      </p>
      <p className="mt-1 font-black" style={{ color: CATEGORIES[d.name]?.color || "#00ff87" }}>
        {fmt(d.value)}
      </p>
    </div>
  );
};

export default function SpendingBreakdown() {
  const { state } = useApp();
  const { darkMode, transactions } = state;
  const [active, setActive] = useState(null);
  const data = groupByCategory(transactions).slice(0, 8);

  const containerStyle = {
    borderRadius: "20px",
    padding: "20px",
    background: darkMode
      ? "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)"
      : "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,252,248,0.9) 100%)",
    border: darkMode ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.06)",
    boxShadow: darkMode ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 20px rgba(0,0,0,0.06)",
  };

  if (!data.length) {
    return (
      <div style={containerStyle}>
        <p className="text-center py-12" style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>No expense data</p>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.amount, 0);

  return (
    <div style={containerStyle}>
      <div className="mb-4">
        <h3
          className="text-sm font-black uppercase tracking-[0.1em]"
          style={{ color: darkMode ? "#fff" : "#0a0a0a" }}
        >
          Spending
        </h3>
        <p className="text-xs mt-0.5 font-medium" style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}>
          By category
        </p>
      </div>

      {/* Donut chart */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={42} outerRadius={60}
              dataKey="amount"
              nameKey="category"
              onMouseEnter={(_, i) => setActive(i)}
              onMouseLeave={() => setActive(null)}
              strokeWidth={0}
            >
              {data.map(({ category }, i) => (
                <Cell
                  key={category}
                  fill={CATEGORIES[category]?.color || "#6b7280"}
                  opacity={active === null || active === i ? 1 : 0.3}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}>
            Total
          </span>
          <span className="text-sm font-black leading-tight" style={{ color: darkMode ? "#fff" : "#000", letterSpacing: "-0.02em" }}>
            {fmt(total, true)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-1.5 max-h-52 overflow-y-auto">
        {data.map(({ category, amount }, i) => {
          const cat = CATEGORIES[category];
          const pct = Math.round((amount / total) * 100);
          return (
            <div
              key={category}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl cursor-default transition-all"
              style={{
                background: active === i
                  ? darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"
                  : "transparent",
              }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <span className="text-sm flex-shrink-0">{cat?.icon || "•"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-[11px] font-semibold truncate"
                    style={{ color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}
                  >
                    {cat?.label || category}
                  </span>
                  <span className="text-[10px] font-bold ml-1 flex-shrink-0" style={{ color: cat?.color || "#6b7280" }}>
                    {pct}%
                  </span>
                </div>
                <div
                  className="w-full h-1 rounded-full"
                  style={{ background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}
                >
                  <div
                    className="h-1 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: cat?.color || "#6b7280" }}
                  />
                </div>
              </div>
              <span
                className="text-[10px] font-bold flex-shrink-0"
                style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
              >
                {fmt(amount, true)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}