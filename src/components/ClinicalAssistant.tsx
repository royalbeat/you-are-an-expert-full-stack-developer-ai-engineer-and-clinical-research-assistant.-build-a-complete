"use client";

import { useState, useRef } from "react";
import { SearchForm } from "./SearchForm";
import { LoadingState } from "./LoadingState";
import { PicoDisplay } from "./PicoDisplay";
import { QueryDisplay } from "./QueryDisplay";
import { AIAnswer } from "./AIAnswer";
import { ArticlesList } from "./ArticlesList";
import { References } from "./References";
import { ErrorDisplay } from "./ErrorDisplay";
import { HeroSection } from "./HeroSection";

interface PicoBreakdown {
  P: string;
  I: string;
  C: string;
  O: string;
  clinicalQuestion: string;
}

interface PubMedQuery {
  raw: string;
  pComponents: {
    P: string;
    I: string;
    C: string;
    O: string;
  };
}

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

interface AnalysisResult {
  userQuestion: string;
  picoBreakdown: PicoBreakdown;
  pubmedQuery: PubMedQuery;
  articles: Article[];
  aiAnswer: string;
  references: string[];
}

type LoadingStage = "pico" | "search" | "analyze" | "summarize";

export function ClinicalAssistant() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>("pico");
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Track last search params for retry
  const lastSearch = useRef<{ question: string; maxResults: number; studyType: string } | null>(
    null
  );

  const handleSearch = async (question: string, maxResults: number, studyType: string) => {
    lastSearch.current = { question, maxResults, studyType };
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLoadingStage("pico");

    // Simulate progressive loading stages
    const stageTimer1 = setTimeout(() => setLoadingStage("search"), 3000);
    const stageTimer2 = setTimeout(() => setLoadingStage("analyze"), 8000);
    const stageTimer3 = setTimeout(() => setLoadingStage("summarize"), 15000);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, maxResults, studyType }),
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "Unknown server error" }));
        throw new Error(errData.error ?? `Server error ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastSearch.current) {
      handleSearch(
        lastSearch.current.question,
        lastSearch.current.maxResults,
        lastSearch.current.studyType
      );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      {!result && !isLoading && <HeroSection />}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Search Form */}
        <div className="mb-6">
          <SearchForm onSubmit={handleSearch} isLoading={isLoading} />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="mb-6">
            <LoadingState stage={loadingStage} />
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="mb-6">
            <ErrorDisplay error={error} onRetry={handleRetry} />
          </div>
        )}

        {/* Results */}
        {result && !isLoading && (
          <div ref={resultsRef} className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-[var(--color-border)]" />
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Analysis Complete
              </div>
              <div className="flex-1 h-px bg-[var(--color-border)]" />
            </div>

            {/* PICO + Query side-by-side on large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PicoDisplay
                pico={result.picoBreakdown}
                userQuestion={result.userQuestion}
              />
              <QueryDisplay
                query={result.pubmedQuery}
                articleCount={result.articles.length}
              />
            </div>

            {/* AI Answer */}
            <AIAnswer
              answer={result.aiAnswer}
              articleCount={result.articles.length}
            />

            {/* Articles */}
            {result.articles.length > 0 && (
              <ArticlesList articles={result.articles} />
            )}

            {/* References */}
            {result.references.length > 0 && (
              <References references={result.references} />
            )}

            {/* New Search CTA */}
            <div className="text-center py-4">
              <button
                onClick={() => {
                  setResult(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-sm text-[var(--color-text-dim)] hover:text-white transition-colors flex items-center gap-1.5 mx-auto"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
                </svg>
                Start a new search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
