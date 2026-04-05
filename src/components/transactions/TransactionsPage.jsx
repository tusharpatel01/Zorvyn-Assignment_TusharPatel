import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/mockData";
import { fmt, fmtDate, exportCSV, exportJSON } from "../../utils/helpers";
import TransactionModal from "../shared/TransactionModal";
import {
  Search, SlidersHorizontal, Plus, Download,
  ArrowUpDown, Pencil, Trash2, ChevronUp, ChevronDown, X
} from "lucide-react";

const SORT_FIELDS = [
  { value: "date",        label: "Date"        },
  { value: "amount",      label: "Amount"      },
  { value: "description", label: "Description" },
  { value: "category",    label: "Category"    },
];

export default function TransactionsPage() {
  const { state, dispatch, filteredTransactions } = useApp();
  const { darkMode, role, filters } = state;

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const setFilter = (key, value) => {
    dispatch({ type: "SET_FILTER", key, value });
    setPage(1);
  };

  const handleDelete = (id) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
    setDeleteConfirm(null);
  };

  const handleEdit = (tx) => {
    setEditData(tx);
    setShowModal(true);
  };

  const toggleSort = (field) => {
    if (filters.sortBy === field) {
      setFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc");
    } else {
      setFilter("sortBy", field);
      setFilter("sortOrder", "desc");
    }
  };

  const SortIcon = ({ field }) => {
    if (filters.sortBy !== field) return <ArrowUpDown size={11} style={{ opacity: 0.3 }} />;
    return filters.sortOrder === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />;
  };

  const total = filteredTransactions.length;
  const pages = Math.ceil(total / PER_PAGE);
  const paged = filteredTransactions.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const activeFilterCount = [
    filters.type !== "all", filters.category !== "all",
    filters.dateFrom, filters.dateTo
  ].filter(Boolean).length;

  const cardStyle = {
    borderRadius: "20px",
    background: darkMode
      ? "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)"
      : "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,252,248,0.9) 100%)",
    border: darkMode ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.06)",
    boxShadow: darkMode ? "0 4px 24px rgba(0,0,0,0.3)" : "0 2px 20px rgba(0,0,0,0.06)",
  };

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 500,
    outline: "none",
    background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
    border: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
    color: darkMode ? "#fff" : "#0a0a0a",
    transition: "border 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "5px",
    color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)",
  };

  const btnBase = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    border: "1px solid transparent",
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1
            className="text-2xl font-black leading-none"
            style={{
              color: darkMode ? "#fff" : "#0a0a0a",
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.04em",
            }}
          >
            Transactions
          </h1>
          <p className="text-xs font-medium mt-1" style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)" }}>
            {total} record{total !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Export dropdown */}
          <div className="relative group">
            <button
              style={{
                ...btnBase,
                background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                border: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
              }}
            >
              <Download size={13} /> Export
            </button>
            <div
              className="absolute right-0 top-full mt-1.5 w-36 rounded-xl overflow-hidden z-20 hidden group-hover:block"
              style={{
                background: darkMode ? "#060e08" : "#fff",
                border: "1px solid rgba(0,255,135,0.15)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
              }}
            >
              {[
                { label: "Export CSV", fn: () => exportCSV(filteredTransactions) },
                { label: "Export JSON", fn: () => exportJSON(filteredTransactions) },
              ].map(({ label, fn }) => (
                <button
                  key={label}
                  onClick={fn}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold transition-all"
                  style={{ color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#00ff87"; e.currentTarget.style.background = "rgba(0,255,135,0.06)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"; e.currentTarget.style.background = "transparent"; }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              ...btnBase,
              background: showFilters || activeFilterCount > 0 ? "rgba(0,255,135,0.1)" : darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              border: showFilters || activeFilterCount > 0 ? "1px solid rgba(0,255,135,0.25)" : darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
              color: showFilters || activeFilterCount > 0 ? "#00ff87" : darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
            }}
          >
            <SlidersHorizontal size={13} />
            Filters
            {activeFilterCount > 0 && (
              <span
                className="w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-black"
                style={{ background: "#00ff87", color: "#050e07" }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Add button (admin only) */}
          {role === "admin" && (
            <button
              onClick={() => { setEditData(null); setShowModal(true); }}
              style={{
                ...btnBase,
                background: "linear-gradient(135deg, #00ff87, #00c853)",
                color: "#050e07",
                boxShadow: "0 4px 16px rgba(0,255,135,0.3)",
              }}
            >
              <Plus size={13} /> Add
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
        />
        <input
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
          style={{ ...inputStyle, paddingLeft: "36px", paddingRight: "36px" }}
        />
        {filters.search && (
          <button
            onClick={() => setFilter("search", "")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2"
            style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div style={{ ...cardStyle, padding: "16px" }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Type",
                key: "type",
                options: [["all", "All Types"], ["income", "Income"], ["expense", "Expense"]],
              },
              {
                label: "Category",
                key: "category",
                options: [["all", "All"], ...Object.entries(CATEGORIES).map(([k, v]) => [k, v.label])],
              },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <select
                  value={filters[key]}
                  onChange={(e) => setFilter(key, e.target.value)}
                  style={inputStyle}
                >
                  {options.map(([val, lbl]) => (
                    <option key={val} value={val}>{lbl}</option>
                  ))}
                </select>
              </div>
            ))}
            <div>
              <label style={labelStyle}>From</label>
              <input type="date" value={filters.dateFrom || ""} onChange={(e) => setFilter("dateFrom", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>To</label>
              <input type="date" value={filters.dateTo || ""} onChange={(e) => setFilter("dateTo", e.target.value)} style={inputStyle} />
            </div>
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setFilter("type", "all");
                setFilter("category", "all");
                setFilter("dateFrom", "");
                setFilter("dateTo", "");
              }}
              className="mt-3 text-xs font-bold transition-colors"
              style={{ color: "#ff5b5b" }}
            >
              × Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div style={cardStyle}>
        {/* Mobile list */}
        <div className="md:hidden divide-y" style={{ borderColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
          {paged.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm" style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)" }}>
              No transactions match your filters
            </p>
          ) : (
            paged.map((tx) => {
              const cat = CATEGORIES[tx.category];
              const isIncome = tx.type === "income";
              return (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: `${cat?.color}18`, border: `1px solid ${cat?.color}25` }}
                  >
                    {cat?.icon || "•"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: darkMode ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}>
                      {tx.description}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}>
                      {fmtDate(tx.date)} · {cat?.label}
                    </p>
                  </div>
                  <span className="text-sm font-black flex-shrink-0" style={{ color: isIncome ? "#00ff87" : darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
                    {isIncome ? "+" : "−"}{fmt(tx.amount, true)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop table */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: darkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)" }}>
                {[
                  { key: "date", label: "Date" },
                  { key: "description", label: "Description" },
                  { key: "category", label: "Category" },
                  { key: "type", label: "Type" },
                  { key: "amount", label: "Amount" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => toggleSort(key)}
                    className="px-5 py-3.5 text-left cursor-pointer select-none"
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#00ff87"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)"; }}
                  >
                    <span className="flex items-center gap-1.5">
                      {label} <SortIcon field={key} />
                    </span>
                  </th>
                ))}
                {role === "admin" && (
                  <th
                    className="px-5 py-3.5 text-right"
                    style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={role === "admin" ? 6 : 5}
                    className="px-5 py-14 text-center text-sm"
                    style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)" }}
                  >
                    No transactions match your filters
                  </td>
                </tr>
              ) : (
                paged.map((tx) => {
                  const cat = CATEGORIES[tx.category];
                  const isIncome = tx.type === "income";
                  return (
                    <tr
                      key={tx.id}
                      className="transition-all"
                      style={{ borderBottom: darkMode ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(0,0,0,0.03)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <td className="px-5 py-3.5 text-xs font-medium" style={{ color: darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)" }}>
                        {fmtDate(tx.date)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                            style={{ background: `${cat?.color}18` }}
                          >
                            {cat?.icon || "•"}
                          </div>
                          <span
                            className="text-xs font-semibold truncate max-w-[160px]"
                            style={{ color: darkMode ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}
                          >
                            {tx.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold"
                          style={{ background: `${cat?.color}18`, color: cat?.color }}
                        >
                          {cat?.label || tx.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold capitalize"
                          style={
                            isIncome
                              ? { background: "rgba(0,255,135,0.1)", color: "#00ff87" }
                              : { background: "rgba(255,91,91,0.1)", color: "#ff5b5b" }
                          }
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-black" style={{ color: isIncome ? "#00ff87" : darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
                        {isIncome ? "+" : "−"}{fmt(tx.amount)}
                      </td>
                      {role === "admin" && (
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(tx)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                              style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,255,135,0.1)"; e.currentTarget.style.color = "#00ff87"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"; }}
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(tx.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                              style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,91,91,0.1)"; e.currentTarget.style.color = "#ff5b5b"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"; }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div
            className="flex flex-col gap-3 px-5 py-3.5 md:flex-row md:items-center md:justify-between"
            style={{ borderTop: darkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)" }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: darkMode ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)" }}>
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total}
            </p>
            <div className="flex flex-wrap items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-30 transition-all"
                style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
              >
                Prev
              </button>
              {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded-xl text-xs font-black transition-all"
                    style={
                      page === p
                        ? { background: "#00ff87", color: "#050e07", boxShadow: "0 2px 12px rgba(0,255,135,0.3)" }
                        : { color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }
                    }
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(pages, page + 1))}
                disabled={page === pages}
                className="px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-30 transition-all"
                style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }} />
          <div
            className="relative w-full max-w-sm z-10"
            style={{
              borderRadius: "20px",
              padding: "24px",
              background: darkMode ? "linear-gradient(145deg, #060e08, #070f09)" : "#fff",
              border: "1px solid rgba(255,91,91,0.2)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "rgba(255,91,91,0.1)", border: "1px solid rgba(255,91,91,0.2)" }}
            >
              <Trash2 size={16} style={{ color: "#ff5b5b" }} />
            </div>
            <h3 className="text-base font-black mb-1" style={{ color: darkMode ? "#fff" : "#0a0a0a" }}>
              Delete Transaction?
            </h3>
            <p className="text-xs font-medium mb-5" style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}>
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
                style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl text-xs font-black transition-all"
                style={{ background: "linear-gradient(135deg, #ff5b5b, #e53935)", color: "#fff", boxShadow: "0 4px 16px rgba(255,91,91,0.3)" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <TransactionModal
          editData={editData}
          onClose={() => { setShowModal(false); setEditData(null); }}
        />
      )}
    </div>
  );
}