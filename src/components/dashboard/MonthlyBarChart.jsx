import React from "react";
import { useApp } from "../../context/AppContext";
import { groupByMonth, fmt } from "../../utils/helpers";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null;
  const balance = payload[0]?.value ?? 0;
  return (
    <div
      className="rounded-2xl p-3 text-xs shadow-2xl"
      style={{
        background: darkMode ? "rgba(5,14,7,0.98)" : "rgba(255,255,255,0.98)",
        border: "1px solid rgba(0,255,135,0.2)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <p className="font-bold uppercase tracking-wider text-[10px] mb-2" style={{ color: "rgba(0,255,135,0.6)" }}>
        {label}
      </p>
      <div className="flex items-center gap-2">
        <div className="w-4 h-1 rounded-full" style={{ background: balance >= 0 ? "#00ff87" : "#ff5b5b" }} />
        <span className="font-medium" style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Net</span>
        <span className="font-black ml-auto pl-4" style={{ color: balance >= 0 ? "#00ff87" : "#ff5b5b" }}>
          {balance >= 0 ? "+" : ""}{fmt(balance, true)}
        </span>
      </div>
    </div>
  );
};

export default function MonthlyBarChart() {
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

  if (!data.length) return null;

  return (
    <div style={containerStyle}>
      <div className="mb-4">
        <h3 className="text-sm font-black uppercase tracking-[0.1em]" style={{ color: darkMode ? "#fff" : "#0a0a0a" }}>
          Net Balance
        </h3>
        <p className="text-xs mt-0.5 font-medium" style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}>
          Monthly savings trend
        </p>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} barSize={18}>
          <CartesianGrid
            strokeDasharray="2 4"
            stroke={darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}
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
          <Bar dataKey="balance" radius={[5, 5, 2, 2]} name="Net Balance">
            {data.map(({ balance }, i) => (
              <Cell
                key={i}
                fill={balance >= 0 ? "#00ff87" : "#ff5b5b"}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}