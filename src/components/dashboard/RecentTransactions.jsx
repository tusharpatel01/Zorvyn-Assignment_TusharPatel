// ============================================================
// RecentTransactions.jsx
// ============================================================
import React from "react";
import { useApp } from "../../context/AppContext";
import { fmt, fmtDate } from "../../utils/helpers";
import { CATEGORIES } from "../../data/mockData";
import { ArrowRight } from "lucide-react";

export default function RecentTransactions() {
  const { state, dispatch } = useApp();
  const { darkMode, transactions } = state;

  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  const containerStyle = {
    borderRadius: "20px",
    padding: "20px",
    background: darkMode
      ? "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)"
      : "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,252,248,0.9) 100%)",
    border: darkMode ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.06)",
    boxShadow: darkMode ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 20px rgba(0,0,0,0.06)",
  };

  return (
    <div style={containerStyle}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.1em]" style={{ color: darkMode ? "#fff" : "#0a0a0a" }}>
            Recent
          </h3>
          <p className="text-xs mt-0.5 font-medium" style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}>
            Latest activity
          </p>
        </div>
        <button
          onClick={() => dispatch({ type: "SET_TAB", payload: "transactions" })}
          className="flex items-center gap-1 text-xs font-bold transition-all hover:gap-2"
          style={{ color: "#00ff87" }}
        >
          View all <ArrowRight size={11} />
        </button>
      </div>

      {recent.length === 0 ? (
        <p className="text-center py-8 text-sm" style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>
          No transactions yet
        </p>
      ) : (
        <div className="space-y-0.5">
          {recent.map((tx) => {
            const cat = CATEGORIES[tx.category];
            const isIncome = tx.type === "income";
            return (
              <div
                key={tx.id}
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all cursor-default group"
                style={{
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{
                    background: `${cat?.color}18`,
                    border: `1px solid ${cat?.color}25`,
                  }}
                >
                  {cat?.icon || "•"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: darkMode ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
                    {tx.description}
                  </p>
                  <p className="text-[10px] font-medium mt-0.5" style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}>
                    {fmtDate(tx.date)} · {cat?.label}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <span
                    className="text-sm font-black"
                    style={{ color: isIncome ? "#00ff87" : darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}
                  >
                    {isIncome ? "+" : "−"}{fmt(tx.amount, true)}
                  </span>
                  <div
                    className="text-[9px] text-right font-bold uppercase tracking-wider mt-0.5"
                    style={{ color: isIncome ? "rgba(0,255,135,0.5)" : "rgba(255,91,91,0.5)" }}
                  >
                    {tx.type}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}