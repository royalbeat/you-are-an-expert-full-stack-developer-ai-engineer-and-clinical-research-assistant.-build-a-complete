"use client";

import { useState } from "react";
import { ArticleCard } from "./ArticleCard";

interface Article {
  pmid: string;
  title: string;
  abstract: string;
  journal: string;
  year: string;
  studyType: string;
  authors: string;
  keyFindings?: string;
}

interface ArticlesListProps {
  articles: Article[];
}

const STUDY_TYPE_ORDER: Record<string, number> = {
  "Meta-analysis": 1,
  "Systematic Review": 2,
  "RCT": 3,
  "Clinical Trial": 4,
  "Review": 5,
  "Study": 6,
};

export function ArticlesList({ articles }: ArticlesListProps) {
  const [sortBy, setSortBy] = useState<"relevance" | "year" | "studyType">("relevance");
  const [filterType, setFilterType] = useState<string>("All");
  const [showAll, setShowAll] = useState(false);

  const studyTypes = ["All", ...Array.from(new Set(articles.map((a) => a.studyType)))];

  const sorted = [...articles]
    .filter((a) => filterType === "All" || a.studyType === filterType)
    .sort((a, b) => {
      if (sortBy === "year") return parseInt(b.year) - parseInt(a.year);
      if (sortBy === "studyType") {
        return (STUDY_TYPE_ORDER[a.studyType] ?? 99) - (STUDY_TYPE_ORDER[b.studyType] ?? 99);
      }
      return 0; // relevance = original order
    });

  const visible = showAll ? sorted : sorted.slice(0, 5);

  const exportCitations = () => {
    const text = articles
      .map((a, i) => `${i + 1}. ${a.title}. ${a.journal}. ${a.year}. PMID: ${a.pmid}.`)
      .join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "citations.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Study type distribution
  const typeCounts = articles.reduce(
    (acc, a) => {
      acc[a.studyType] = (acc[a.studyType] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-4 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="section-label mb-0.5">Evidence Base</p>
          <h2 className="text-base font-bold text-white">
            Retrieved Articles
            <span className="ml-2 text-sm font-normal text-[var(--color-text-dim)]">({articles.length} total)</span>
          </h2>
        </div>
        <button
          onClick={exportCitations}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--color-text-muted)] hover:text-white border border-[var(--color-border)] hover:border-[var(--color-border-bright)] hover:bg-[var(--color-surface-2)] transition-all"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export Citations
        </button>
      </div>

      {/* Study type summary */}
      <div className="card flex flex-wrap gap-3">
        {Object.entries(typeCounts).map(([type, count]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`badge ${
              type === "Meta-analysis" ? "badge-meta" :
              type === "Systematic Review" ? "badge-sr" :
              type === "RCT" ? "badge-rct" : "badge-study"
            }`}>
              {type}
            </div>
            <span className="text-xs text-[var(--color-text-dim)] font-semibold">{count}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-dim)]">Sort:</span>
          {(["relevance", "year", "studyType"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                sortBy === s
                  ? "bg-blue-500/15 border-blue-500/40 text-blue-400"
                  : "border-[var(--color-border)] text-[var(--color-text-dim)] hover:border-[var(--color-border-bright)] hover:text-white"
              }`}
            >
              {s === "studyType" ? "Evidence Level" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Filter by type */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-dim)]">Filter:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {studyTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {visible.map((article, i) => (
          <ArticleCard
            key={article.pmid}
            article={article}
            index={sorted.indexOf(article) + 1}
          />
        ))}
      </div>

      {/* Show more */}
      {sorted.length > 5 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2.5 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] hover:text-white hover:border-[var(--color-border-bright)] hover:bg-[var(--color-surface-2)] transition-all"
        >
          Show {sorted.length - 5} more articles
        </button>
      )}

      {showAll && sorted.length > 5 && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full py-2.5 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] hover:text-white transition-all"
        >
          Show less
        </button>
      )}
    </div>
  );
}
