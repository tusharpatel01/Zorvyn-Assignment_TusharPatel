import React from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/mockData";
import { fmt, groupByMonth, groupByCategory } from "../../utils/helpers";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis,
} from "recharts";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Info } from "lucide-react";

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null;
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
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <div className="w-4 h-1 rounded-full" style={{ background: p.fill || p.color }} />
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

export default function InsightsPage() {
  const { state } = useApp();
  const { darkMode, transactions } = state;

  const monthly = groupByMonth(transactions);
  const catData = groupByCategory(transactions);
  const totalExpenses = catData.reduce((s, d) => s + d.amount, 0);
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);

  const topCat = catData[0];
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
  const lastTwo = monthly.slice(-2);
  const momChange = lastTwo.length === 2
    ? Math.round(((lastTwo[1].expenses - lastTwo[0].expenses) / lastTwo[0].expenses) * 100)
    : null;
  const bestMonth = [...monthly].sort((a, b) => b.balance - a.balance)[0];
  const radarData = catData.slice(0, 6).map(({ category, amount }) => ({
    cat: CATEGORIES[category]?.icon + " " + (CATEGORIES[category]?.label?.split(" ")[0] || category),
    value: amount,
  }));

  const cardStyle = {
    borderRadius: "20px",
    padding: "20px",
    background: darkMode
      ? "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)"
      : "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,252,248,0.9) 100%)",
    border: darkMode ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.06)",
    boxShadow: darkMode ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 20px rgba(0,0,0,0.06)",
  };

  const titleStyle = {
    fontSize: "13px",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: darkMode ? "#fff" : "#0a0a0a",
    marginBottom: "2px",
  };

  const subStyle = {
    fontSize: "11px",
    fontWeight: 500,
    color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)",
  };

  const colorMap = {
    orange: { bg: "rgba(251,146,60,0.1)", text: "#fb923c", border: "rgba(251,146,60,0.2)" },
    red:    { bg: "rgba(255,91,91,0.1)",  text: "#ff5b5b",  border: "rgba(255,91,91,0.2)" },
    green:  { bg: "rgba(0,255,135,0.1)",  text: "#00ff87",  border: "rgba(0,255,135,0.2)" },
    blue:   { bg: "rgba(96,165,250,0.1)", text: "#60a5fa",  border: "rgba(96,165,250,0.2)" },
  };

  const insights = [
    topCat && {
      icon: AlertCircle,
      color: "orange",
      title: `Top spend: ${CATEGORIES[topCat.category]?.label}`,
      body: `${fmt(topCat.amount)} — ${Math.round((topCat.amount / totalExpenses) * 100)}% of total expenses`,
    },
    momChange !== null && {
      icon: momChange > 0 ? TrendingUp : TrendingDown,
      color: momChange > 0 ? "red" : "green",
      title: `Expenses ${momChange > 0 ? "up" : "down"} ${Math.abs(momChange)}%`,
      body: `${lastTwo[1].label}: ${fmt(lastTwo[1].expenses, true)} vs ${lastTwo[0].label}: ${fmt(lastTwo[0].expenses, true)}`,
    },
    savingsRate >= 20 && {
      icon: CheckCircle,
      color: "green",
      title: `Great savings rate: ${savingsRate}%`,
      body: "Saving 20%+ of your income. Keep going!",
    },
    savingsRate < 10 && savingsRate >= 0 && {
      icon: AlertCircle,
      color: "red",
      title: `Low savings rate: ${savingsRate}%`,
      body: "Aim for 20%+. Review discretionary spending.",
    },
    bestMonth && {
      icon: Info,
      color: "blue",
      title: `Best month: ${bestMonth.label}`,
      body: `Saved ${fmt(bestMonth.balance, true)} — ${fmt(bestMonth.income, true)} in, ${fmt(bestMonth.expenses, true)} out`,
    },
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-black leading-none"
          style={{
            color: darkMode ? "#fff" : "#0a0a0a",
            fontFamily: "'Syne', sans-serif",
            letterSpacing: "-0.04em",
          }}
        >
          Insights
        </h1>
        <p className="text-sm font-medium mt-1" style={{ color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)" }}>
          Smart observations from your financial data
        </p>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map(({ icon: Icon, color, title, body }, i) => {
          const c = colorMap[color];
          return (
            <div
              key={i}
              style={{
                ...cardStyle,
                borderColor: c.border,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                className="absolute top-0 right-0 w-16 h-16 rounded-full pointer-events-none"
                style={{ background: c.bg, filter: "blur(20px)", transform: "translate(30%, -30%)" }}
              />
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: c.bg, border: `1px solid ${c.border}` }}
              >
                <Icon size={16} style={{ color: c.text }} />
              </div>
              <p className="text-xs font-black mb-1" style={{ color: darkMode ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)" }}>
                {title}
              </p>
              <p className="text-[11px] leading-relaxed font-medium" style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}>
                {body}
              </p>
            </div>
          );
        })}
      </div>

      {/* Monthly comparison bar chart */}
      <div style={cardStyle}>
        <div className="mb-4">
          <p style={titleStyle}>Monthly Comparison</p>
          <p style={subStyle}>Income vs Expenses per month</p>
        </div>
        {monthly.length === 0 ? (
          <p className="text-center py-8 text-sm" style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthly} barGap={4} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="2 4" stroke={darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)", fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)", fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v, true)} width={55} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Bar dataKey="income"   fill="#00ff87" fillOpacity={0.85} radius={[4, 4, 0, 0]} name="income"   barSize={14} />
              <Bar dataKey="expenses" fill="#ff5b5b" fillOpacity={0.85} radius={[4, 4, 0, 0]} name="expenses" barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category breakdown */}
        <div style={cardStyle}>
          <div className="mb-4">
            <p style={titleStyle}>Category Breakdown</p>
            <p style={subStyle}>Total spend per category</p>
          </div>
          {catData.length === 0 ? (
            <p className="text-center py-6 text-sm" style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>No data</p>
          ) : (
            <div className="space-y-2.5">
              {catData.slice(0, 7).map(({ category, amount }) => {
                const cat = CATEGORIES[category];
                const pct = Math.round((amount / totalExpenses) * 100);
                return (
                  <div key={category} className="flex items-center gap-3">
                    <span className="text-base flex-shrink-0">{cat?.icon || "•"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold" style={{ color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
                          {cat?.label || category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold" style={{ color: cat?.color || "#00ff87" }}>{pct}%</span>
                          <span className="text-[11px] font-black" style={{ color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
                            {fmt(amount, true)}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                        <div
                          className="h-1.5 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: cat?.color || "#00ff87" }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Radar chart */}
        <div style={cardStyle}>
          <div className="mb-4">
            <p style={titleStyle}>Spending Pattern</p>
            <p style={subStyle}>Top categories radar view</p>
          </div>
          {radarData.length > 2 ? (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"} />
                <PolarAngleAxis dataKey="cat" tick={{ fill: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)", fontSize: 10, fontWeight: 600 }} />
                <Radar dataKey="value" stroke="#00ff87" fill="#00ff87" fillOpacity={0.12} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center py-12 text-sm" style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>
              Need more data for radar
            </p>
          )}
        </div>
      </div>

      {/* Month summary table */}
      <div style={cardStyle}>
        <div className="mb-4">
          <p style={titleStyle}>Month-by-Month Summary</p>
          <p style={subStyle}>Detailed income, expenses, and net savings</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: darkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)" }}>
                {["Month", "Income", "Expenses", "Net Savings", "Rate"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-3 text-left"
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthly.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-10 text-center text-sm" style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>
                    No data
                  </td>
                </tr>
              ) : (
                monthly.map(({ month, label, income, expenses, balance }) => {
                  const rate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
                  return (
                    <tr
                      key={month}
                      style={{ borderBottom: darkMode ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(0,0,0,0.03)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <td className="px-3 py-3 text-xs font-bold" style={{ color: darkMode ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)" }}>
                        {label}
                      </td>
                      <td className="px-3 py-3 text-xs font-black" style={{ color: "#00ff87" }}>
                        {fmt(income, true)}
                      </td>
                      <td className="px-3 py-3 text-xs font-black" style={{ color: "#ff5b5b" }}>
                        {fmt(expenses, true)}
                      </td>
                      <td className="px-3 py-3 text-xs font-black" style={{ color: balance >= 0 ? "#00ff87" : "#ff5b5b" }}>
                        {balance >= 0 ? "+" : ""}{fmt(balance, true)}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className="text-[10px] font-black px-2 py-1 rounded-lg"
                          style={
                            rate >= 20
                              ? { background: "rgba(0,255,135,0.1)", color: "#00ff87" }
                              : rate >= 0
                              ? { background: "rgba(251,191,36,0.1)", color: "#fbbf24" }
                              : { background: "rgba(255,91,91,0.1)", color: "#ff5b5b" }
                          }
                        >
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}