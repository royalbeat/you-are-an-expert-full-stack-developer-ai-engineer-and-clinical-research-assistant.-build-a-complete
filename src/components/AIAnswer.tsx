"use client";

import { useState } from "react";

interface AIAnswerProps {
  answer: string;
  articleCount: number;
}

function formatAnswer(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={key++} className="text-sm font-bold text-white mt-4 mb-2 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full flex-shrink-0" />
          {line.replace("## ", "")}
        </h3>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h4 key={key++} className="text-sm font-semibold text-blue-300 mt-3 mb-1.5">
          {line.replace("### ", "")}
        </h4>
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={key++} className="text-sm font-semibold text-white my-1">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <div key={key++} className="flex gap-2 my-1">
          <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
          <p className="text-sm text-[var(--color-text)] leading-relaxed">
            {formatInline(line.slice(2))}
          </p>
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\.\s/)?.[1];
      elements.push(
        <div key={key++} className="flex gap-2 my-1">
          <span className="text-blue-400 font-mono text-xs mt-0.5 flex-shrink-0 w-4 text-right">{num}.</span>
          <p className="text-sm text-[var(--color-text)] leading-relaxed">
            {formatInline(line.replace(/^\d+\.\s/, ""))}
          </p>
        </div>
      );
    } else if (line.trim() === "" || line.trim() === "---") {
      if (elements.length > 0) {
        elements.push(<div key={key++} className="h-1" />);
      }
    } else if (line.trim()) {
      elements.push(
        <p key={key++} className="text-sm text-[var(--color-text)] leading-relaxed my-1">
          {formatInline(line)}
        </p>
      );
    }
  }

  return elements;
}

function formatInline(text: string): React.ReactNode {
  // Replace **bold** and citation references like [1], [2], etc.
  const parts = text.split(/(\*\*[^*]+\*\*|\[\d+(?:,\s*\d+)*\])/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    if (/^\[\d+(?:,\s*\d+)*\]$/.test(part)) {
      return (
        <span key={i} className="text-blue-400 font-mono text-xs font-semibold">
          {part}
        </span>
      );
    }
    return part;
  });
}

export function AIAnswer({ answer, articleCount }: AIAnswerProps) {
  const [copied, setCopied] = useState(false);

  const copyAnswer = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card-elevated fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="section-label mb-0">AI Evidence-Based Answer</p>
            <h2 className="text-base font-bold text-white">Clinical Analysis</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-semibold">
            Based on {articleCount} articles
          </div>
          <button
            onClick={copyAnswer}
            className="p-1.5 rounded-lg hover:bg-[var(--color-bg)] transition-colors text-[var(--color-text-dim)] hover:text-white"
            title="Copy answer"
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 mb-5">
        <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-xs text-amber-300/80">
          This analysis is based solely on retrieved PubMed abstracts. It is intended for research and educational purposes only — not as a substitute for clinical judgment or professional medical advice.
        </p>
      </div>

      {/* Answer Content */}
      <div className="prose prose-sm max-w-none">
        {formatAnswer(answer)}
      </div>
    </div>
  );
}
