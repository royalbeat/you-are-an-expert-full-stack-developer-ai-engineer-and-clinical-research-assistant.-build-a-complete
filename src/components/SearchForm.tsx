"use client";

import { useState } from "react";

interface SearchFormProps {
  onSubmit: (question: string, maxResults: number, studyType: string) => void;
  isLoading: boolean;
}

const EXAMPLE_QUESTIONS = [
  "Does metformin reduce cardiovascular risk in type 2 diabetes?",
  "Is laparoscopic surgery better than open surgery for appendectomy?",
  "Does early physiotherapy improve outcomes after stroke?",
  "What is the efficacy of SSRIs for generalized anxiety disorder?",
  "Does low-dose aspirin prevent cardiovascular events in primary prevention?",
];

export function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
  const [question, setQuestion] = useState("");
  const [maxResults, setMaxResults] = useState(20);
  const [studyType, setStudyType] = useState("Meta-analysis");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    onSubmit(question.trim(), maxResults, studyType);
  };

  const handleExample = (q: string) => {
    setQuestion(q);
  };

  return (
    <div className="card-elevated fade-in">
      {/* Header */}
      <div className="mb-5">
        <p className="section-label mb-1">Clinical Query</p>
        <h2 className="text-xl font-bold text-white">Ask a Clinical Question</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Enter any clinical question — our AI will convert it to PICO format and search PubMed for evidence.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Question Textarea */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
            Clinical Question
          </label>
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Does metformin reduce cardiovascular risk in patients with type 2 diabetes?"
              rows={3}
              disabled={isLoading}
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-sm text-white placeholder-[var(--color-text-dim)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none disabled:opacity-50"
            />
            {question && (
              <button
                type="button"
                onClick={() => setQuestion("")}
                className="absolute top-2 right-2 text-[var(--color-text-dim)] hover:text-white transition-colors p-1"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Controls Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Articles Selector */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
              Number of Articles
            </label>
            <select
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              disabled={isLoading}
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50 cursor-pointer"
            >
              <option value={10}>10 articles</option>
              <option value={20}>20 articles</option>
              <option value={50}>50 articles</option>
              <option value={100}>100 articles</option>
            </select>
          </div>

          {/* Study Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
              Study Type Filter
            </label>
            <select
              value={studyType}
              onChange={(e) => setStudyType(e.target.value)}
              disabled={isLoading}
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50 cursor-pointer"
            >
              <option value="Meta-analysis">Meta-analysis (highest evidence)</option>
              <option value="Systematic Review">Systematic Review</option>
              <option value="RCT">RCT only</option>
              <option value="All">All study types</option>
            </select>
          </div>
        </div>

        {/* Evidence Level Indicator */}
        <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
          <div className="flex items-center gap-1">
            {["Meta-analysis", "Systematic Review", "RCT", "All"].map((type, i) => (
              <div
                key={type}
                className={`h-1.5 rounded-full transition-all ${
                  studyType === type
                    ? "w-6 bg-blue-400"
                    : i < ["Meta-analysis", "Systematic Review", "RCT", "All"].indexOf(studyType)
                    ? "w-4 bg-blue-700"
                    : "w-3 bg-[var(--color-border)]"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-[var(--color-text-dim)]">
            {studyType === "Meta-analysis" && "Highest evidence — Meta-analyses first, then SR, then RCT"}
            {studyType === "Systematic Review" && "High evidence — Systematic Reviews + Meta-analyses"}
            {studyType === "RCT" && "RCTs only — randomized controlled trials"}
            {studyType === "All" && "All study types — no evidence hierarchy filter"}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="w-full py-3 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing Evidence...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              Search & Analyze Evidence
            </>
          )}
        </button>
      </form>

      {/* Example Questions */}
      <div className="mt-5 pt-4 border-t border-[var(--color-border)]">
        <p className="text-xs text-[var(--color-text-dim)] mb-3 font-semibold uppercase tracking-wider">
          Example Questions
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleExample(q)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/5 transition-all disabled:opacity-40"
            >
              {q.length > 55 ? q.slice(0, 52) + "..." : q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
