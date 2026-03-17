"use client";

interface PicoBreakdown {
  P: string;
  I: string;
  C: string;
  O: string;
  clinicalQuestion: string;
}

interface PicoDisplayProps {
  pico: PicoBreakdown;
  userQuestion: string;
}

const PICO_CONFIG = [
  {
    key: "P" as const,
    label: "Population",
    color: "blue",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
      </svg>
    ),
  },
  {
    key: "I" as const,
    label: "Intervention",
    color: "indigo",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    key: "C" as const,
    label: "Comparison",
    color: "violet",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    key: "O" as const,
    label: "Outcome",
    color: "emerald",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; label: string }> = {
  blue: { bg: "rgba(59,130,246,0.08)", text: "#60a5fa", border: "rgba(59,130,246,0.25)", label: "#3b82f6" },
  indigo: { bg: "rgba(99,102,241,0.08)", text: "#818cf8", border: "rgba(99,102,241,0.25)", label: "#6366f1" },
  violet: { bg: "rgba(139,92,246,0.08)", text: "#a78bfa", border: "rgba(139,92,246,0.25)", label: "#8b5cf6" },
  emerald: { bg: "rgba(16,185,129,0.08)", text: "#34d399", border: "rgba(16,185,129,0.25)", label: "#10b981" },
};

export function PicoDisplay({ pico, userQuestion }: PicoDisplayProps) {
  return (
    <div className="card fade-in space-y-5">
      {/* Header */}
      <div>
        <p className="section-label mb-1">PICO Framework</p>
        <h2 className="text-base font-bold text-white">Question Analysis</h2>
      </div>

      {/* Original Question */}
      <div className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
        <p className="text-xs font-semibold text-[var(--color-text-dim)] mb-1 uppercase tracking-wider">Original Question</p>
        <p className="text-sm text-[var(--color-text)]">{userQuestion}</p>
      </div>

      {/* PICO Clinical Question */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border border-blue-500/20">
        <p className="text-xs font-semibold text-blue-400 mb-1.5 uppercase tracking-wider">PICO Clinical Question</p>
        <p className="text-sm text-white font-medium leading-relaxed">{pico.clinicalQuestion}</p>
      </div>

      {/* PICO Grid */}
      <div className="grid grid-cols-2 gap-3">
        {PICO_CONFIG.map((item) => {
          const colors = COLOR_MAP[item.color];
          return (
            <div
              key={item.key}
              className="rounded-lg p-3"
              style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ background: `${colors.label}20`, color: colors.text }}
                >
                  {item.icon}
                </div>
                <div>
                  <span
                    className="text-xs font-bold"
                    style={{ color: colors.label }}
                  >
                    {item.key}
                  </span>
                  <span className="text-xs text-[var(--color-text-dim)] ml-1">{item.label}</span>
                </div>
              </div>
              <p className="text-xs text-[var(--color-text)] leading-relaxed">
                {pico[item.key]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
