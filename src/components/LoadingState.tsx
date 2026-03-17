"use client";

interface LoadingStateProps {
  stage: "pico" | "search" | "analyze" | "summarize";
}

const STAGES = [
  { id: "pico", label: "Converting to PICO", description: "Analyzing question structure and generating PICO framework..." },
  { id: "search", label: "Searching PubMed", description: "Querying PubMed database for relevant clinical evidence..." },
  { id: "analyze", label: "Analyzing Abstracts", description: "Reading and extracting key findings from each article..." },
  { id: "summarize", label: "Generating Answer", description: "Synthesizing evidence and formulating clinical answer..." },
];

export function LoadingState({ stage }: LoadingStateProps) {
  const currentIndex = STAGES.findIndex((s) => s.id === stage);
  const current = STAGES[currentIndex];

  return (
    <div className="card fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{current?.label}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{current?.description}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="space-y-2">
        {STAGES.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          const pending = i > currentIndex;

          return (
            <div key={s.id} className="flex items-center gap-3">
              {/* Step Indicator */}
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                ${done ? "bg-green-500" : active ? "bg-blue-500 animate-pulse" : "bg-[var(--color-border)]"}
              `}>
                {done ? (
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : active ? (
                  <div className="w-2 h-2 bg-white rounded-full" />
                ) : (
                  <div className="w-2 h-2 bg-[var(--color-text-dim)] rounded-full" />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${done ? "text-green-400" : active ? "text-white" : "text-[var(--color-text-dim)]"}`}>
                    {s.label}
                  </span>
                  {active && (
                    <span className="text-xs text-blue-400 animate-pulse">In progress...</span>
                  )}
                  {done && (
                    <span className="text-xs text-green-500">Complete</span>
                  )}
                </div>
                {active && (
                  <div className="mt-1 h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full shimmer" style={{ width: "60%" }} />
                  </div>
                )}
              </div>

              {/* Step number */}
              <span className={`text-xs ${done || active ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-dim)]"}`}>
                {i + 1}/{STAGES.length}
              </span>
            </div>
          );
        })}
      </div>

      {/* Shimmer Skeletons */}
      <div className="mt-6 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-3 rounded shimmer" style={{ width: `${90 - i * 10}%` }} />
        ))}
      </div>
    </div>
  );
}
