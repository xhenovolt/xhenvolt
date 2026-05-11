import "dotenv/config";
import { config } from "dotenv";
import { setDefaultResultOrder } from "node:dns";
import { neonClient } from "./neon-http";

setDefaultResultOrder("ipv4first");
config({ path: ".env.local" });

const STOPWORDS = new Set([
  "the","a","an","is","are","was","were","be","been","being",
  "i","you","we","they","he","she","it","this","that","these",
  "what","how","when","where","why","who","which","of","to","in",
  "for","on","at","by","with","from","and","or","but","not",
  "do","does","did","have","has","had","can","could","would",
  "should","will","may","might","tell","me","about","your","my",
  "us","our","please",
]);

function tokens(s: string): string[] {
  return s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/).filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

async function main() {
  const client = neonClient(process.env.DATABASE_URL!);

  const queries = [
    "What is DRAIS?",
    "How much does it cost?",
    "Tell me about Xhaira",
    "Who are your reference clients?",
    "When was Xhenvolt founded?",
    "completely unrelated question about astronauts",
  ];

  const faqs = (
    await client.exec<{ id: string; question: string; answer: string; keywords: string[] | null }>(
      `SELECT id, question, answer, keywords FROM faqs WHERE published = true AND deleted_at IS NULL`,
    )
  ).rows;

  for (const q of queries) {
    const qt = new Set(tokens(q));
    let bestFaq = { id: "", q: "", score: 0 };
    for (const f of faqs) {
      const ft = new Set([
        ...tokens(f.question),
        ...(Array.isArray(f.keywords) ? f.keywords.flatMap((k) => tokens(k)) : []),
      ]);
      let overlap = 0;
      for (const t of qt) if (ft.has(t)) overlap++;
      const score = qt.size === 0 ? 0 : overlap / qt.size;
      if (score > bestFaq.score) bestFaq = { id: f.id, q: f.question, score };
    }
    const docMatch = (
      await client.exec<{ id: string; title: string; score: number }>(
        `SELECT id, title,
          (CASE WHEN lower(title) LIKE $1 THEN 3 ELSE 0 END) +
          (CASE WHEN lower(coalesce(summary,'')) LIKE $1 THEN 2 ELSE 0 END) +
          (CASE WHEN lower(content) LIKE $1 THEN 1 ELSE 0 END) AS score
         FROM ai_training_documents
         WHERE lower(title) LIKE $1 OR lower(content) LIKE $1
         ORDER BY score DESC LIMIT 1`,
        ["%" + q.toLowerCase().split(/\s+/).filter((t) => !STOPWORDS.has(t))[0] + "%"],
      )
    ).rows[0];
    console.log(`Q: ${q}`);
    console.log(
      `  best FAQ : score=${bestFaq.score.toFixed(2)}  "${bestFaq.q || "(none)"}"`,
    );
    console.log(
      `  best DOC : score=${docMatch?.score ?? "—"}  "${docMatch?.title ?? "(none)"}"`,
    );
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
