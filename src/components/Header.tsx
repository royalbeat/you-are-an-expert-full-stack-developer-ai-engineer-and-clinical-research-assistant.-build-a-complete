"use client";

export function Header() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[var(--color-surface)] animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">AI Clinical Evidence</h1>
            <p className="text-xs text-[var(--color-text-dim)] leading-none mt-0.5">Assistant</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-[var(--color-border)] mx-2" />

        {/* Tagline */}
        <p className="text-xs text-[var(--color-text-muted)] hidden sm:block">
          Evidence-Based Medicine · PubMed · PICO Framework
        </p>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-dim)]">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="hidden sm:inline">PubMed Connected</span>
          </div>
          <div className="h-4 w-px bg-[var(--color-border)] mx-1" />
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-dim)]">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="hidden sm:inline">AI Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
}
