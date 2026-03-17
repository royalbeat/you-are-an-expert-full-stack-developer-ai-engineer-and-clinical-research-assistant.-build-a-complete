"use client";

export function HeroSection() {
  return (
    <div className="text-center py-10 px-4">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/8 text-xs font-semibold text-blue-400 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        Powered by PubMed · NCBI Entrez · Advanced AI
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
        AI Clinical
        <br />
        <span className="gradient-text">Evidence Assistant</span>
      </h1>

      {/* Subtitle */}
      <p className="text-base text-[var(--color-text-muted)] max-w-xl mx-auto leading-relaxed mb-8">
        Ask any clinical question. Our AI searches PubMed, converts your question to PICO format, 
        retrieves real research evidence, and synthesizes a doctor-level answer.
      </p>

      {/* Feature Pills */}
      <div className="flex flex-wrap justify-center gap-2 text-xs">
        {[
          { icon: "🔬", text: "PICO Conversion" },
          { icon: "📊", text: "MeSH + Boolean Search" },
          { icon: "📚", text: "PubMed Evidence" },
          { icon: "🧠", text: "AI Synthesis" },
          { icon: "📋", text: "Citations Export" },
        ].map((f) => (
          <div
            key={f.text}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)]"
          >
            <span>{f.icon}</span>
            <span>{f.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
