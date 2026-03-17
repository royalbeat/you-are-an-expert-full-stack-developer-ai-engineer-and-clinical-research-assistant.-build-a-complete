"use client";

import { useState } from "react";

interface ReferencesProps {
  references: string[];
}

export function References({ references }: ReferencesProps) {
  const [copied, setCopied] = useState(false);

  const copyAll = () => {
    navigator.clipboard.writeText(references.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportBibtex = () => {
    const bibtex = references
      .map((ref, i) => {
        const pmidMatch = ref.match(/PMID:\s*(\d+)/);
        const pmid = pmidMatch?.[1] ?? `ref${i + 1}`;
        const title = ref.replace(/\d+\.\s/, "").replace(/\s*\(PMID:.*\)/, "");
        return `@article{pmid${pmid},\n  title={${title}},\n  note={PMID: ${pmid}, PubMed. https://pubmed.ncbi.nlm.nih.gov/${pmid}/}\n}`;
      })
      .join("\n\n");

    const blob = new Blob([bibtex], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "references.bib";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-label mb-0.5">Citations</p>
          <h2 className="text-base font-bold text-white">
            References
            <span className="ml-2 text-sm font-normal text-[var(--color-text-dim)]">({references.length})</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportBibtex}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--color-text-muted)] hover:text-white border border-[var(--color-border)] hover:border-[var(--color-border-bright)] hover:bg-[var(--color-surface-2)] transition-all"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            BibTeX
          </button>
          <button
            onClick={copyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--color-text-muted)] hover:text-white border border-[var(--color-border)] hover:border-[var(--color-border-bright)] hover:bg-[var(--color-surface-2)] transition-all"
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
                Copy All
              </>
            )}
          </button>
        </div>
      </div>

      <ol className="space-y-2">
        {references.map((ref, i) => {
          const pmidMatch = ref.match(/PMID:\s*(\d+)/);
          const pmid = pmidMatch?.[1];
          const displayText = ref.replace(/^\d+\.\s/, "");

          return (
            <li key={i} className="flex gap-3 group">
              <span className="text-xs font-mono text-[var(--color-text-dim)] mt-0.5 w-6 flex-shrink-0 text-right">
                {i + 1}.
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {displayText.replace(/\s*\(PMID:.*\)/, "")}
                </span>
                {pmid && (
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-xs text-blue-400/70 hover:text-blue-400 font-mono transition-colors"
                  >
                    PMID:{pmid}
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
