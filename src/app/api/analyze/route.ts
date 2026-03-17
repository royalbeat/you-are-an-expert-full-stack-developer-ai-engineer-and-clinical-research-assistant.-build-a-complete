import { NextRequest, NextResponse } from "next/server";

const PUBMED_API_KEY = "59b990857d18c6d83a609e928893ec469e08";
const PUBMED_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const OPENROUTER_API_KEY =
  "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";
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const AI_MODEL = "nvidia/nemotron-super-49b-v1:free";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PicoBreakdown {
  P: string;
  I: string;
  C: string;
  O: string;
  clinicalQuestion: string;
}

export interface PubMedQuery {
  raw: string;
  pComponents: {
    P: string;
    I: string;
    C: string;
    O: string;
  };
}

export interface Article {
  pmid: string;
  title: string;
  abstract: string;
  journal: string;
  year: string;
  studyType: string;
  authors: string;
  keyFindings?: string;
}

export interface AnalysisResult {
  userQuestion: string;
  picoBreakdown: PicoBreakdown;
  pubmedQuery: PubMedQuery;
  articles: Article[];
  aiAnswer: string;
  references: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://ai-clinical-evidence-assistant.app",
      "X-Title": "AI Clinical Evidence Assistant",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// ─── Step 1 + 2 + 3: PICO + Keywords + Boolean Query ─────────────────────────

async function generatePicoAndQuery(
  question: string
): Promise<{ pico: PicoBreakdown; query: PubMedQuery }> {
  const systemPrompt = `You are an expert clinical research librarian and evidence-based medicine specialist.
Your task is to convert clinical questions into structured PICO format and generate optimized PubMed Boolean search queries.
Always respond with valid JSON only — no markdown, no explanation, just the raw JSON object.`;

  const userPrompt = `Convert the following clinical question into PICO format and generate a PubMed search query.

Clinical Question: "${question}"

Return ONLY a JSON object with this exact structure:
{
  "P": "Population description",
  "I": "Intervention description",
  "C": "Comparison description (use 'placebo', 'standard care', or 'no intervention' if not specified)",
  "O": "Outcome description",
  "clinicalQuestion": "A clear, complete PICO-formatted clinical question",
  "P_keywords": "((keyword1) OR (keyword2) OR (MeSH[MeSH Terms]) OR (synonym*))",
  "I_keywords": "((keyword1) OR (keyword2) OR (MeSH[MeSH Terms]) OR (synonym*))",
  "C_keywords": "((keyword1) OR (keyword2) OR (MeSH[MeSH Terms]) OR (synonym*))",
  "O_keywords": "((keyword1) OR (keyword2) OR (MeSH[MeSH Terms]) OR (synonym*))"
}

For keywords:
- Include synonyms, MeSH terms, truncated forms with *, related clinical terms
- Use proper PubMed syntax
- Join synonyms with OR, wrap in parentheses
- Include MeSH terms like: "Diabetes Mellitus"[MeSH Terms]`;

  const raw = await callAI(systemPrompt, userPrompt);

  let parsed: {
    P: string;
    I: string;
    C: string;
    O: string;
    clinicalQuestion: string;
    P_keywords: string;
    I_keywords: string;
    C_keywords: string;
    O_keywords: string;
  };

  try {
    // Strip potential markdown code fences
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Failed to parse PICO JSON from AI: ${raw.slice(0, 200)}`);
  }

  const booleanQuery = `(${parsed.P_keywords})\nAND\n(${parsed.I_keywords})\nAND\n(${parsed.C_keywords})\nAND\n(${parsed.O_keywords})`;

  return {
    pico: {
      P: parsed.P,
      I: parsed.I,
      C: parsed.C,
      O: parsed.O,
      clinicalQuestion: parsed.clinicalQuestion,
    },
    query: {
      raw: booleanQuery,
      pComponents: {
        P: parsed.P_keywords,
        I: parsed.I_keywords,
        C: parsed.C_keywords,
        O: parsed.O_keywords,
      },
    },
  };
}

// ─── Step 4 + 5: PubMed Search ───────────────────────────────────────────────

function buildStudyTypeFilter(studyType: string): string {
  switch (studyType) {
    case "Meta-analysis":
      return "(meta-analysis[pt] OR systematic review[pt] OR randomized controlled trial[pt])";
    case "Systematic Review":
      return "(systematic review[pt] OR meta-analysis[pt])";
    case "RCT":
      return "randomized controlled trial[pt]";
    case "All":
    default:
      return "";
  }
}

async function searchPubMed(
  query: PubMedQuery,
  studyType: string,
  maxResults: number
): Promise<string[]> {
  const studyFilter = buildStudyTypeFilter(studyType);
  const baseQuery = `(${query.pComponents.P}) AND (${query.pComponents.I}) AND (${query.pComponents.O})`;
  const fullQuery = studyFilter ? `(${baseQuery}) AND ${studyFilter}` : baseQuery;

  const searchUrl = new URL(`${PUBMED_BASE}/esearch.fcgi`);
  searchUrl.searchParams.set("db", "pubmed");
  searchUrl.searchParams.set("term", fullQuery);
  searchUrl.searchParams.set("retmax", String(maxResults));
  searchUrl.searchParams.set("retmode", "json");
  searchUrl.searchParams.set("sort", "relevance");
  searchUrl.searchParams.set("api_key", PUBMED_API_KEY);

  const searchResp = await fetch(searchUrl.toString());
  if (!searchResp.ok) throw new Error(`PubMed esearch failed: ${searchResp.status}`);

  const searchData = await searchResp.json();
  let pmids: string[] = searchData.esearchresult?.idlist ?? [];

  // Fallback: if restricted search returns too few, try broader
  if (pmids.length < 5 && studyType === "Meta-analysis") {
    const fallbackUrl = new URL(`${PUBMED_BASE}/esearch.fcgi`);
    const fallbackFilter =
      "(meta-analysis[pt] OR systematic review[pt] OR randomized controlled trial[pt] OR clinical trial[pt])";
    fallbackUrl.searchParams.set(
      "term",
      `(${baseQuery}) AND ${fallbackFilter}`
    );
    fallbackUrl.searchParams.set("db", "pubmed");
    fallbackUrl.searchParams.set("retmax", String(maxResults));
    fallbackUrl.searchParams.set("retmode", "json");
    fallbackUrl.searchParams.set("sort", "relevance");
    fallbackUrl.searchParams.set("api_key", PUBMED_API_KEY);
    const fallbackResp = await fetch(fallbackUrl.toString());
    if (fallbackResp.ok) {
      const fallbackData = await fallbackResp.json();
      pmids = fallbackData.esearchresult?.idlist ?? pmids;
    }
  }

  return pmids;
}

async function fetchArticles(pmids: string[]): Promise<Article[]> {
  if (pmids.length === 0) return [];

  const fetchUrl = new URL(`${PUBMED_BASE}/efetch.fcgi`);
  fetchUrl.searchParams.set("db", "pubmed");
  fetchUrl.searchParams.set("id", pmids.join(","));
  fetchUrl.searchParams.set("rettype", "xml");
  fetchUrl.searchParams.set("retmode", "xml");
  fetchUrl.searchParams.set("api_key", PUBMED_API_KEY);

  const resp = await fetch(fetchUrl.toString());
  if (!resp.ok) throw new Error(`PubMed efetch failed: ${resp.status}`);

  const xml = await resp.text();
  return parseArticlesFromXML(xml);
}

function parseArticlesFromXML(xml: string): Article[] {
  const articles: Article[] = [];

  // Extract all PubmedArticle blocks
  const articleMatches = xml.matchAll(/<PubmedArticle>([\s\S]*?)<\/PubmedArticle>/g);

  for (const match of articleMatches) {
    const block = match[1];

    const pmid = extractTag(block, "PMID") ?? "";
    const title = extractTag(block, "ArticleTitle") ?? "No title";
    const abstract = extractAbstract(block);
    const journal =
      extractTag(block, "ISOAbbreviation") ??
      extractTag(block, "Title") ??
      "Unknown Journal";
    const year =
      extractTag(block, "PubDate>Year") ??
      extractTag(block, "Year") ??
      extractTag(block, "MedlineDate")?.slice(0, 4) ??
      "N/A";
    const studyType = detectStudyType(block);
    const authors = extractAuthors(block);

    if (pmid && abstract) {
      articles.push({
        pmid,
        title: cleanXML(title),
        abstract: cleanXML(abstract),
        journal: cleanXML(journal),
        year,
        studyType,
        authors,
      });
    }
  }

  return articles;
}

function extractTag(xml: string, tag: string): string | null {
  const parts = tag.split(">");
  let current = xml;
  for (const part of parts) {
    const match = current.match(new RegExp(`<${part}[^>]*>([\\s\\S]*?)<\\/${part}>`, "i"));
    if (!match) return null;
    current = match[1];
  }
  return current.trim();
}

function extractAbstract(block: string): string {
  // Handle structured abstracts with multiple AbstractText elements
  const abstractBlock = block.match(/<Abstract>([\s\S]*?)<\/Abstract>/);
  if (!abstractBlock) return "";

  const texts: string[] = [];
  const labeledMatches = abstractBlock[1].matchAll(
    /<AbstractText[^>]*Label="([^"]*)"[^>]*>([\s\S]*?)<\/AbstractText>/g
  );

  let hasLabeled = false;
  for (const m of labeledMatches) {
    hasLabeled = true;
    texts.push(`${m[1]}: ${m[2].trim()}`);
  }

  if (!hasLabeled) {
    const simple = abstractBlock[1].match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/);
    if (simple) texts.push(simple[1].trim());
  }

  return texts.join(" ").trim();
}

function extractAuthors(block: string): string {
  const authors: string[] = [];
  const matches = block.matchAll(
    /<Author[^>]*>[\s\S]*?<LastName>([\s\S]*?)<\/LastName>[\s\S]*?(?:<ForeName>([\s\S]*?)<\/ForeName>)?[\s\S]*?<\/Author>/g
  );
  let count = 0;
  for (const m of matches) {
    if (count >= 3) {
      authors.push("et al.");
      break;
    }
    const foreName = m[2] ? ` ${m[2].trim().charAt(0)}.` : "";
    authors.push(`${m[1].trim()}${foreName}`);
    count++;
  }
  return authors.join(", ");
}

function detectStudyType(block: string): string {
  const pubTypes = block.match(/<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g) ?? [];
  const allTypes = pubTypes.map((t) => t.toLowerCase()).join(" ");

  if (allTypes.includes("meta-analysis")) return "Meta-analysis";
  if (allTypes.includes("systematic review")) return "Systematic Review";
  if (allTypes.includes("randomized controlled trial")) return "RCT";
  if (allTypes.includes("clinical trial")) return "Clinical Trial";
  if (allTypes.includes("review")) return "Review";
  return "Study";
}

function cleanXML(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x[0-9A-Fa-f]+;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Step 6 + 7: AI Analysis and Summary ─────────────────────────────────────

async function generateAIAnswer(
  userQuestion: string,
  picoBreakdown: PicoBreakdown,
  articles: Article[]
): Promise<{ aiAnswer: string; articlesWithFindings: Article[] }> {
  if (articles.length === 0) {
    return {
      aiAnswer:
        "No relevant articles were found in PubMed for this query. Please try broadening your search terms, selecting 'All' study types, or rephrasing your clinical question.",
      articlesWithFindings: [],
    };
  }

  // Build abstract corpus for AI
  const abstractCorpus = articles
    .map(
      (a, i) =>
        `[${i + 1}] PMID: ${a.pmid} | ${a.studyType} | ${a.year} | ${a.journal}
Title: ${a.title}
Abstract: ${a.abstract}`
    )
    .join("\n\n---\n\n");

  const systemPrompt = `You are a senior clinical researcher and evidence-based medicine expert with decades of experience in systematic review methodology and clinical guideline development.

Your task is to synthesize medical evidence from PubMed abstracts to answer a specific clinical question.

CRITICAL RULES:
1. ONLY use information from the provided abstracts — never hallucinate data
2. Directly answer the user's original clinical question
3. Reflect the consensus across studies honestly
4. Highlight conflicting evidence if present
5. Explicitly state uncertainty when evidence is limited
6. Reference articles by their number [1], [2], etc.
7. Maintain scientific rigor and clinical accuracy`;

  const userPrompt = `ORIGINAL CLINICAL QUESTION: "${userQuestion}"

PICO FRAMEWORK:
- Population: ${picoBreakdown.P}
- Intervention: ${picoBreakdown.I}  
- Comparison: ${picoBreakdown.C}
- Outcome: ${picoBreakdown.O}

RETRIEVED EVIDENCE (${articles.length} articles):

${abstractCorpus}

Please provide:

## 1. KEY FINDINGS PER STUDY
For each article [1] through [${articles.length}], extract 1-2 key findings in 1-2 sentences.

## 2. EVIDENCE SYNTHESIS
Synthesize findings across all studies addressing the clinical question. Identify:
- Areas of agreement
- Conflicting evidence
- Strength of evidence (high/moderate/low)

## 3. CLINICAL ANSWER
Provide a clear, direct answer to the original clinical question: "${userQuestion}"
- State the main conclusion supported by evidence
- Include effect sizes, statistics, or clinical significance where available
- Note limitations or gaps in evidence

## 4. CLINICAL IMPLICATIONS
2-3 practical bullet points for clinicians

Format your response clearly with these exact section headers.`;

  const aiResponse = await callAI(systemPrompt, userPrompt);

  // Now extract key findings per article
  const findingsPrompt = `Based on these ${articles.length} PubMed abstracts, extract one concise key finding (1 sentence) for EACH article.

${abstractCorpus}

Return ONLY a JSON array of strings, one per article in order:
["Finding for article 1", "Finding for article 2", ...]

Be factual and concise. Extract the single most important finding from each abstract.`;

  let findings: string[] = [];
  try {
    const findingsRaw = await callAI(
      "You are a clinical research expert. Extract key findings from medical abstracts. Return only valid JSON arrays.",
      findingsPrompt
    );
    const cleaned = findingsRaw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    findings = JSON.parse(cleaned);
  } catch {
    findings = articles.map(() => "Key finding extraction unavailable.");
  }

  const articlesWithFindings = articles.map((a, i) => ({
    ...a,
    keyFindings: findings[i] ?? "See abstract for details.",
  }));

  return { aiAnswer: aiResponse, articlesWithFindings };
}

// ─── Main API Route ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      question,
      maxResults = 20,
      studyType = "Meta-analysis",
    }: { question: string; maxResults: number; studyType: string } = body;

    if (!question?.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    // Step 1-3: PICO + Query
    const { pico, query } = await generatePicoAndQuery(question);

    // Step 4-5: PubMed Search + Fetch
    const pmids = await searchPubMed(query, studyType, maxResults);
    const articles = await fetchArticles(pmids);

    // Step 6-7: AI Analysis
    const { aiAnswer, articlesWithFindings } = await generateAIAnswer(question, pico, articles);

    // Step 8: References
    const references = articlesWithFindings.map(
      (a, i) => `${i + 1}. ${a.title} (PMID: ${a.pmid})`
    );

    const result: AnalysisResult = {
      userQuestion: question,
      picoBreakdown: pico,
      pubmedQuery: query,
      articles: articlesWithFindings,
      aiAnswer,
      references,
    };

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Analysis error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
