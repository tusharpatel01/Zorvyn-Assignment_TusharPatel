import React from "react";
import { useApp } from "../../context/AppContext";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Shield,
  Eye,
  X,
  Sun,
  Moon,
  Zap,
} from "lucide-react";
import Logo from "../shared/Logo";

const NAV = [
  { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard, desc: "Overview" },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight,  desc: "History"  },
  { id: "insights",     label: "Insights",     icon: Lightbulb,       desc: "Analysis" },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { state, dispatch } = useApp();
  const { activeTab, darkMode, currentUser, role } = state;
  const isMobileOpen = mobileOpen === true;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 md:hidden backdrop-blur-sm bg-black/40 ${
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        style={{
          background: darkMode
            ? "linear-gradient(180deg, #050e07 0%, #060f08 50%, #040c06 100%)"
            : "linear-gradient(180deg, #f0fdf4 0%, #f7fef9 50%, #f0fdf4 100%)",
          borderRight: darkMode ? "1px solid rgba(0,255,135,0.08)" : "1px solid rgba(0,180,80,0.15)",
        }}
        className={`fixed inset-y-0 left-0 z-40 flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64 w-72 shadow-2xl md:shadow-none`}
      >
        {/* Top glow */}
        <div
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(0,255,135,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3 px-5 py-6">
          <Logo />
          {isMobileOpen && (
            <button
              onClick={onClose}
              className="md:hidden absolute right-4 top-5 rounded-xl p-1.5 text-slate-400 transition hover:text-white hover:bg-white/5"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Nav section label */}
        <div className="px-5 mb-2">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: darkMode ? "rgba(0,255,135,0.4)" : "rgba(0,140,60,0.5)" }}
          >
            Navigation
          </p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 pb-3 space-y-1 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon, desc }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  dispatch({ type: "SET_TAB", payload: id });
                  onClose?.();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                  active
                    ? ""
                    : darkMode
                    ? "text-slate-400 hover:text-white hover:bg-white/5"
                    : "text-slate-500 hover:text-slate-800 hover:bg-black/5"
                }`}
                style={
                  active
                    ? {
                        background: "linear-gradient(135deg, rgba(0,255,135,0.15) 0%, rgba(0,200,83,0.08) 100%)",
                        border: "1px solid rgba(0,255,135,0.2)",
                        color: "#00ff87",
                        boxShadow: "0 0 20px rgba(0,255,135,0.08), inset 0 1px 0 rgba(0,255,135,0.1)",
                      }
                    : { border: "1px solid transparent" }
                }
              >
                {active && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full"
                    style={{ background: "#00ff87" }}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    active ? "" : "group-hover:scale-110"
                  }`}
                  style={
                    active
                      ? { background: "rgba(0,255,135,0.2)" }
                      : { background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)" }
                  }
                >
                  <Icon size={16} />
                </div>
                <div className="text-left min-w-0">
                  <p className="leading-none font-semibold">{label}</p>
                  <p
                    className="text-[10px] mt-0.5 leading-none"
                    style={{ color: active ? "rgba(0,255,135,0.6)" : darkMode ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)" }}
                  >
                    {desc}
                  </p>
                </div>
                {active && (
                  <div className="ml-auto">
                    <Zap size={12} style={{ color: "#00ff87" }} />
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div
          className="px-4 py-4 mx-3 mb-3 rounded-2xl space-y-3"
          style={{
            background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)",
            border: darkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {/* Role switcher */}
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
              style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}
            >
              Access Level
            </p>
            <div
              className="flex rounded-xl p-1 gap-1"
              style={{ background: darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.07)" }}
            >
              {["admin", "viewer"].map((r) => (
                <button
                  key={r}
                  onClick={() => dispatch({ type: "SET_ROLE", payload: r })}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all capitalize"
                  style={
                    role === r
                      ? r === "admin"
                        ? {
                            background: "linear-gradient(135deg, #00ff87, #00c853)",
                            color: "#050e07",
                            boxShadow: "0 2px 12px rgba(0,255,135,0.35)",
                          }
                        : {
                            background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                            color: "#fff",
                            boxShadow: "0 2px 12px rgba(59,130,246,0.35)",
                          }
                      : { color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }
                  }
                >
                  {r === "admin" ? <Shield size={10} /> : <Eye size={10} />}
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={() => dispatch({ type: "TOGGLE_DARK" })}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{
              background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
            }}
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            <span className="font-medium text-xs">{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>

        {/* User profile */}
        <div
          className="mx-3 mb-4 px-4 py-3 rounded-2xl flex items-center gap-3"
          style={{
            background: darkMode
              ? "linear-gradient(135deg, rgba(0,255,135,0.06), rgba(0,200,83,0.03))"
              : "linear-gradient(135deg, rgba(0,200,83,0.08), rgba(0,180,60,0.04))",
            border: darkMode ? "1px solid rgba(0,255,135,0.12)" : "1px solid rgba(0,180,60,0.2)",
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
            style={{
              background:
                role === "admin"
                  ? "linear-gradient(135deg, rgba(0,255,135,0.2), rgba(0,200,83,0.1))"
                  : "linear-gradient(135deg, rgba(96,165,250,0.2), rgba(59,130,246,0.1))",
              color: role === "admin" ? "#00ff87" : "#60a5fa",
              border: role === "admin" ? "1px solid rgba(0,255,135,0.2)" : "1px solid rgba(96,165,250,0.2)",
            }}
          >
            {currentUser.name.slice(0, 2).toUpperCase()}  
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="text-xs font-bold truncate"
              style={{ color: darkMode ? "#fff" : "#111" }}
            >
              {currentUser.name}
            </p>
            <p
              className="text-[10px] capitalize font-medium"
              style={{ color: role === "admin" ? "#00ff87" : "#60a5fa" }}
            >
              {role} · Active
            </p>
          </div>
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: "#00ff87", boxShadow: "0 0 6px #00ff87" }}
          />
        </div>
      </aside>
    </>
  );
}