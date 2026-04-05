import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/mockData";
import { X, Plus, Check } from "lucide-react";

const EMPTY = {
  description: "",
  amount: "",
  category: "food",
  type: "expense",
  date: new Date().toISOString().split("T")[0],
};

export default function TransactionModal({ editData, onClose }) {
  const { dispatch, state } = useApp();
  const { darkMode } = state;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) setForm({ ...editData, amount: String(editData.amount) });
  }, [editData]);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = "Enter a valid amount";
    if (!form.date) e.date = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = () => {
    if (!validate()) return;
    const payload = { ...form, amount: Number(form.amount) };
    dispatch({
      type: editData ? "EDIT_TRANSACTION" : "ADD_TRANSACTION",
      payload: editData ? { ...payload, id: editData.id } : payload,
    });
    onClose();
  };

  const modalBg = darkMode
    ? "linear-gradient(145deg, #060e08 0%, #070f09 100%)"
    : "linear-gradient(145deg, #ffffff 0%, #f8fef9 100%)";

  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "10px 12px",
    borderRadius: "12px",
    fontSize: "13px",
    outline: "none",
    background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
    border: hasError
      ? "1px solid rgba(255,91,91,0.6)"
      : darkMode
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(0,0,0,0.08)",
    color: darkMode ? "#fff" : "#0a0a0a",
    transition: "all 0.2s",
  });

  const labelStyle = {
    display: "block",
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "6px",
    color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}
      />

      <div
        className="relative w-full max-w-md z-10"
        style={{
          borderRadius: "24px",
          background: modalBg,
          border: "1px solid rgba(0,255,135,0.15)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,135,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow top */}
        <div
          className="absolute top-0 left-0 right-0 h-20 rounded-t-[24px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,255,135,0.08) 0%, transparent 80%)" }}
        />

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <h2
              className="text-base font-black"
              style={{
                color: darkMode ? "#fff" : "#0a0a0a",
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {editData ? "Edit Transaction" : "New Transaction"}
            </h2>
            <p className="text-[11px] font-medium mt-0.5" style={{ color: "rgba(0,255,135,0.6)" }}>
              {editData ? "Update your record" : "Add to your ledger"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="e.g. Grocery Store"
              style={inputStyle(errors.description)}
            />
            {errors.description && (
              <p className="text-[11px] mt-1 font-semibold" style={{ color: "#ff5b5b" }}>
                {errors.description}
              </p>
            )}
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Amount (₹)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                placeholder="0"
                style={inputStyle(errors.amount)}
              />
              {errors.amount && (
                <p className="text-[11px] mt-1 font-semibold" style={{ color: "#ff5b5b" }}>
                  {errors.amount}
                </p>
              )}
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                style={inputStyle(errors.date)}
              />
            </div>
          </div>

          {/* Type toggle */}
          <div>
            <label style={labelStyle}>Type</label>
            <div
              className="flex rounded-xl p-1 gap-1"
              style={{ background: darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.06)" }}
            >
              {[
                { id: "expense", label: "↑ Expense", activeColor: "#ff5b5b", activeBg: "linear-gradient(135deg, #ff5b5b, #e53935)" },
                { id: "income", label: "↓ Income", activeColor: "#fff", activeBg: "linear-gradient(135deg, #00ff87, #00c853)" },
              ].map(({ id, label, activeColor, activeBg }) => (
                <button
                  key={id}
                  onClick={() => set("type", id)}
                  className="flex-1 py-2.5 rounded-lg text-xs font-bold capitalize transition-all"
                  style={
                    form.type === id
                      ? {
                          background: activeBg,
                          color: id === "expense" ? "#fff" : "#050e07",
                          boxShadow: id === "expense" ? "0 2px 12px rgba(255,91,91,0.3)" : "0 2px 12px rgba(0,255,135,0.3)",
                        }
                      : { color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)" }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Category grid */}
          <div>
            <label style={labelStyle}>Category</label>
            <div className="grid grid-cols-5 gap-1.5">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => set("category", key)}
                  title={cat.label}
                  className="flex flex-col items-center py-2.5 px-1 rounded-xl text-xs transition-all"
                  style={
                    form.category === key
                      ? {
                          background: `${cat.color}20`,
                          border: `1px solid ${cat.color}50`,
                          boxShadow: `0 0 12px ${cat.color}20`,
                        }
                      : {
                          background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                          border: darkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
                        }
                  }
                >
                  <span className="text-base">{cat.icon}</span>
                </button>
              ))}
            </div>
            <p
              className="text-[11px] mt-2 font-semibold"
              style={{ color: CATEGORIES[form.category]?.color || "#00ff87" }}
            >
              {CATEGORIES[form.category]?.icon} {CATEGORIES[form.category]?.label}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex gap-2 px-6 py-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
            style={{
              background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="flex-1 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #00ff87, #00c853)",
              color: "#050e07",
              boxShadow: "0 4px 20px rgba(0,255,135,0.35)",
            }}
          >
            {editData ? <Check size={14} /> : <Plus size={14} />}
            {editData ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}