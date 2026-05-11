import { listFaqs, searchTrainingDocumentsByKeywords } from "@/lib/repositories";
import type { Faq, AiTrainingDocument } from "@/lib/repositories";

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "i", "you", "we", "they", "he", "she", "it", "this", "that", "these",
  "what", "how", "when", "where", "why", "who", "which", "of", "to", "in",
  "for", "on", "at", "by", "with", "from", "and", "or", "but", "not",
  "do", "does", "did", "have", "has", "had", "can", "could", "would",
  "should", "will", "may", "might", "tell", "me", "about", "your", "my",
  "us", "our", "please",
]);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function scoreFaq(query: string, faq: Faq): number {
  const qt = new Set(tokens(query));
  if (qt.size === 0) return 0;
  const ft = new Set([
    ...tokens(faq.question),
    ...((faq.keywords as string[] | null) ?? []).flatMap((k) => tokens(k)),
  ]);
  let overlap = 0;
  for (const t of qt) if (ft.has(t)) overlap++;
  return overlap / qt.size;
}

export interface RetrievalResult {
  answer: string;
  confidence: number;
  source: "faq" | "doc" | "fallback";
  matchedFaqIds: string[];
  matchedDocIds: string[];
}

export async function retrieveAnswer(
  query: string,
  fallbackMessage: string,
): Promise<RetrievalResult> {
  const q = query.trim();
  if (!q) {
    return {
      answer: fallbackMessage,
      confidence: 0,
      source: "fallback",
      matchedFaqIds: [],
      matchedDocIds: [],
    };
  }

  const [faqs, docs] = await Promise.all([
    listFaqs("public"),
    searchTrainingDocumentsByKeywords(q, 3),
  ]);

  const scoredFaqs = faqs
    .map((f) => ({ faq: f, score: scoreFaq(q, f) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const bestFaq = scoredFaqs[0];
  const bestDoc = docs[0] as (AiTrainingDocument & { score: number }) | undefined;

  if (bestFaq && bestFaq.score >= 0.4) {
    return {
      answer: bestFaq.faq.answer,
      confidence: Math.min(0.95, 0.55 + bestFaq.score * 0.4),
      source: "faq",
      matchedFaqIds: [bestFaq.faq.id],
      matchedDocIds: bestDoc ? [bestDoc.id] : [],
    };
  }

  if (bestDoc && bestDoc.score >= 2) {
    return {
      answer: bestDoc.summary ?? bestDoc.content.slice(0, 600),
      confidence: Math.min(0.85, 0.4 + bestDoc.score * 0.1),
      source: "doc",
      matchedFaqIds: bestFaq ? [bestFaq.faq.id] : [],
      matchedDocIds: [bestDoc.id],
    };
  }

  if (bestFaq && bestFaq.score >= 0.2) {
    return {
      answer: bestFaq.faq.answer,
      confidence: 0.5,
      source: "faq",
      matchedFaqIds: [bestFaq.faq.id],
      matchedDocIds: [],
    };
  }

  return {
    answer: fallbackMessage,
    confidence: 0.1,
    source: "fallback",
    matchedFaqIds: [],
    matchedDocIds: [],
  };
}

export function buildSuggestedActions(source: RetrievalResult["source"]): string[] {
  if (source === "fallback") {
    return ["Book a Free Demo", "WhatsApp Us", "Call +256 741 341 483"];
  }
  return ["Book a Demo", "See Pricing", "Talk to Sales"];
}
