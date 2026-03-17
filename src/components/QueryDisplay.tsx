"use client";

import { useState } from "react";

interface PubMedQuery {
  raw: string;
  pComponents: {
    P: string;
    I: string;
    C: string;
    O: string;
  };
}

interface QueryDisplayProps {
  query: PubMedQuery;
  articleCount: number;
}

export function QueryDisplay({ query, articleCount }: QueryDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copyQuery = () => {
    navigator.clipboard.writeText(query.raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const componentLabels = [
    { key: "P" as const, label: "Population", color: "#60a5fa" },
    { key: "I" as const, label: "Intervention", color: "#818cf8" },
    { key: "C" as const, label: "Comparison", color: "#a78bfa" },
    { key: "O" as const, label: "Outcome", color: "#34d399" },
  ];

  return (
    <div className="card fade-in space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="section-label mb-0.5">PubMed Search</p>
          <h2 className="text-base font-bold text-white">Generated Query</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs text-green-400 font-semibold">{articleCount} articles found</span>
          </div>
        </div>
      </div>

      {/* Component breakdown */}
      <div className="space-y-2">
        {componentLabels.map(({ key, label, color }) => (
          <div key={key} className="flex gap-2">
            <div
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
              style={{ background: `${color}15`, color }}
            >
              {key}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-[var(--color-text-dim)] mr-2">{label}:</span>
              <span
                className="text-xs font-mono break-all"
                style={{ color }}
              >
                {query.pComponents[key]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Full query toggle */}
      <div className="border-t border-[var(--color-border)] pt-3">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-[var(--color-text-muted)] hover:text-white transition-colors flex items-center gap-1"
          >
            <svg
              className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            {expanded ? "Hide" : "Show"} full Boolean query
          </button>
          <button
            onClick={copyQuery}
            className="text-xs flex items-center gap-1 text-[var(--color-text-muted)] hover:text-blue-400 transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                Copy query
              </>
            )}
          </button>
        </div>

        {expanded && (
          <pre className="text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-bg)] rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-words border border-[var(--color-border)]">
            {query.raw}
          </pre>
        )}
      </div>
    </div>
  );
}
