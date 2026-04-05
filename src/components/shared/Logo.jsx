import React from "react";

export default function Logo({ compact = false }) {
  return (
    <div className={`inline-flex items-center ${compact ? "" : "gap-3"}`}>
      {/* Hexagonal logo mark */}
      <div className="relative flex h-10 w-10 items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00ff87" />
              <stop offset="100%" stopColor="#00c853" />
            </linearGradient>
            <linearGradient id="logoBg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00ff87" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#00c853" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          {/* Hexagon bg */}
          <path d="M20 2L36 11V29L20 38L4 29V11L20 2Z" fill="url(#logoBg)" stroke="url(#logoGrad)" strokeWidth="1" />
          {/* Chart bars inside */}
          <rect x="11" y="22" width="4" height="8" rx="1" fill="url(#logoGrad)" opacity="0.6" />
          <rect x="18" y="16" width="4" height="14" rx="1" fill="url(#logoGrad)" opacity="0.8" />
          <rect x="25" y="12" width="4" height="18" rx="1" fill="url(#logoGrad)" />
          {/* Upward arrow */}
          <path d="M27 10L30 7L33 10" stroke="#00ff87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {!compact && (
        <div className="min-w-0">
          <p
            style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
            className="text-[15px] font-black tracking-tight leading-none"
          >
            <span className="text-[#00ff87]">Zorvyn</span>
            <span className="text-white">Fintech</span>
          </p>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.15em] font-medium mt-0.5">
            Finance OS
          </p>
        </div>
      )}
    </div>
  );
}