# Active Context: AI Clinical Evidence Assistant

## Current State

**Application Status**: ✅ Production-ready — full-stack AI clinical evidence system

The application is a complete, production-ready "AI Clinical Evidence Assistant" built on Next.js 16 with TypeScript and Tailwind CSS 4.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] **AI Clinical Evidence Assistant — full application**
  - [x] `/api/analyze` route — orchestrates all 8 steps
  - [x] PICO conversion via OpenRouter AI (nvidia/nemotron model)
  - [x] MeSH + Boolean query generation
  - [x] PubMed search via NCBI Entrez esearch + efetch
  - [x] XML article parsing with structured abstract support
  - [x] Evidence hierarchy filtering (Meta-analysis > SR > RCT > All)
  - [x] AI abstract analysis and evidence synthesis
  - [x] Key findings extraction per article
  - [x] All 9 React components built with clean dark-mode UI

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page (imports ClinicalAssistant) | ✅ Ready |
| `src/app/layout.tsx` | Root layout with SEO metadata | ✅ Ready |
| `src/app/globals.css` | Global styles + custom CSS classes | ✅ Ready |
| `src/app/api/analyze/route.ts` | Main API route — all 8 steps | ✅ Ready |
| `src/components/Header.tsx` | Sticky header with status indicators | ✅ Ready |
| `src/components/HeroSection.tsx` | Landing hero with feature pills | ✅ Ready |
| `src/components/ClinicalAssistant.tsx` | Main orchestrator component | ✅ Ready |
| `src/components/SearchForm.tsx` | Question input + controls | ✅ Ready |
| `src/components/LoadingState.tsx` | Progressive loading stages UI | ✅ Ready |
| `src/components/PicoDisplay.tsx` | PICO breakdown display | ✅ Ready |
| `src/components/QueryDisplay.tsx` | PubMed query + article count | ✅ Ready |
| `src/components/AIAnswer.tsx` | AI evidence synthesis answer | ✅ Ready |
| `src/components/ArticlesList.tsx` | Sortable/filterable articles list | ✅ Ready |
| `src/components/ArticleCard.tsx` | Individual article with abstract toggle | ✅ Ready |
| `src/components/References.tsx` | Citation list with export features | ✅ Ready |
| `src/components/ErrorDisplay.tsx` | Error state with retry button | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## API Configuration

- **PubMed (NCBI Entrez)**: API key configured, uses esearch + efetch
- **OpenRouter AI**: nvidia/nemotron-super-49b model for PICO + synthesis
- **Base URL**: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/`

## Architecture Flow

1. User submits question + selects article count + study type
2. `/api/analyze` POST endpoint:
   - **Step 1-3**: AI generates PICO breakdown + MeSH keywords + Boolean query
   - **Step 4-5**: PubMed esearch for PMIDs, efetch for XML article data
   - **Step 6-7**: AI reads all abstracts, extracts key findings, synthesizes answer
   - **Step 8**: References compiled
3. Results displayed progressively in UI with animations

## Key Features

- PICO framework auto-conversion from plain questions
- Evidence hierarchy filtering (Meta-analysis > Systematic Review > RCT > All)
- Fallback search when restricted study type returns too few results
- Article sorting by relevance, year, or evidence level
- Filter by study type
- Export citations (.txt) and BibTeX (.bib)
- Copy query and AI answer to clipboard
- Direct PubMed links for each article
- Responsive dark-mode UI

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-03-17 | Built complete AI Clinical Evidence Assistant — frontend + backend + AI integration |
