import React from "react";
import { useApp } from "../../context/AppContext";
import { groupByMonth, fmt } from "../../utils/helpers";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-2xl p-4 text-xs shadow-2xl"
      style={{
        background: darkMode
          ? "linear-gradient(145deg, rgba(5,14,7,0.95), rgba(8,20,10,0.98))"
          : "rgba(255,255,255,0.97)",
        border: "1px solid rgba(0,255,135,0.2)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,255,135,0.1)",
      }}
    >
      <p className="font-bold mb-3 text-[11px] tracking-wider uppercase" style={{ color: "rgba(0,255,135,0.7)" }}>
        {label}
      </p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2.5 mb-1.5">
          <div
            className="w-5 h-1.5 rounded-full"
            style={{ background: p.color }}
          />
          <span className="capitalize font-medium" style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
            {p.name}
          </span>
          <span className="font-black ml-auto pl-4" style={{ color: darkMode ? "#fff" : "#000" }}>
            {fmt(p.value, true)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function BalanceTrend() {
  const { state } = useApp();
  const { darkMode, transactions } = state;
  const data = groupByMonth(transactions);

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
        <p className="text-center py-12" style={{ color: "rgba(255,255,255,0.2)" }}>No data to display</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3
            className="text-sm font-black uppercase tracking-[0.1em]"
            style={{ color: darkMode ? "#fff" : "#0a0a0a" }}
          >
            Cash Flow
          </h3>
          <p className="text-xs mt-0.5 font-medium" style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}>
            Income vs Expenses over time
          </p>
        </div>
        <div className="flex items-center gap-3">
          {[
            { label: "Income", color: "#00ff87" },
            { label: "Expenses", color: "#ff5b5b" },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-4 h-1 rounded-full" style={{ background: color }} />
              <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#00ff87" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#00ff87" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#ff5b5b" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ff5b5b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)", fontSize: 10, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)", fontSize: 10, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => fmt(v, true)}
            width={55}
          />
          <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#00ff87"
            strokeWidth={2.5}
            fill="url(#incomeGrad)"
            name="income"
            dot={false}
            activeDot={{ r: 5, fill: "#00ff87", strokeWidth: 2, stroke: darkMode ? "#050e07" : "#fff" }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#ff5b5b"
            strokeWidth={2.5}
            fill="url(#expenseGrad)"
            name="expenses"
            dot={false}
            activeDot={{ r: 5, fill: "#ff5b5b", strokeWidth: 2, stroke: darkMode ? "#050e07" : "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}