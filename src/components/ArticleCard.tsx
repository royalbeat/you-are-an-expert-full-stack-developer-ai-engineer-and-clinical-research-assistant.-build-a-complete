"use client";

import { useState } from "react";

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

interface ArticleCardProps {
  article: Article;
  index: number;
}

function StudyBadge({ type }: { type: string }) {
  const classMap: Record<string, string> = {
    "Meta-analysis": "badge badge-meta",
    "Systematic Review": "badge badge-sr",
    "RCT": "badge badge-rct",
    "Clinical Trial": "badge badge-review",
    "Review": "badge badge-review",
    "Study": "badge badge-study",
  };

  return (
    <span className={classMap[type] ?? "badge badge-study"}>
      {type}
    </span>
  );
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  const [expanded, setExpanded] = useState(false);

  const pubmedUrl = `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`;

  return (
    <div className="card fade-in group hover:border-[var(--color-border-bright)] transition-all">
      {/* Card Header */}
      <div className="flex items-start gap-3">
        {/* Index */}
        <div className="w-7 h-7 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0 text-xs font-bold text-[var(--color-text-muted)]">
          {index}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-sm font-semibold text-white leading-snug mb-2 group-hover:text-blue-300 transition-colors">
            {article.title}
          </h3>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <StudyBadge type={article.studyType} />
            <span className="text-xs text-[var(--color-text-dim)]">{article.year}</span>
            {article.journal && (
              <>
                <span className="text-[var(--color-border-bright)]">·</span>
                <span className="text-xs text-[var(--color-text-dim)] truncate max-w-[200px]">{article.journal}</span>
              </>
            )}
            {article.authors && (
              <>
                <span className="text-[var(--color-border-bright)]">·</span>
                <span className="text-xs text-[var(--color-text-dim)]">{article.authors}</span>
              </>
            )}
          </div>

          {/* Key Finding */}
          {article.keyFindings && article.keyFindings !== "Key finding extraction unavailable." && (
            <div className="mb-3 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/15">
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-3 h-3 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Key Finding</span>
              </div>
              <p className="text-xs text-blue-100/80 leading-relaxed">{article.keyFindings}</p>
            </div>
          )}

          {/* Abstract toggle */}
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-[var(--color-text-dim)] hover:text-[var(--color-text-muted)] flex items-center gap-1 transition-colors"
            >
              <svg
                className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {expanded ? "Hide" : "Show"} abstract
            </button>

            {expanded && (
              <div className="mt-2 text-xs text-[var(--color-text-muted)] leading-relaxed bg-[var(--color-bg)] rounded-lg p-3 border border-[var(--color-border)]">
                {article.abstract || "Abstract not available."}
              </div>
            )}
          </div>
        </div>

        {/* PMID Link */}
        <a
          href={pubmedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono text-[var(--color-text-dim)] hover:text-blue-400 hover:bg-blue-500/10 transition-all border border-transparent hover:border-blue-500/20 flex-shrink-0"
          title="Open on PubMed"
        >
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
          {article.pmid}
        </a>
      </div>
    </div>
  );
}
