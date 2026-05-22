import { getPool, endPool } from "./_tidb";

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
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

async function main() {
  const pool = getPool();

  const queries = [
    "What is DRAIS?",
    "How much does it cost?",
    "Tell me about Xhaira",
    "Who are your reference clients?",
    "When was Xhenvolt founded?",
    "completely unrelated question about astronauts",
  ];

  const [faqs] = (await pool.query(
    `SELECT id, question, answer, keywords FROM faqs WHERE published = 1 AND deleted_at IS NULL`,
  )) as [
    Array<{ id: string; question: string; answer: string; keywords: unknown }>,
    unknown,
  ];

  for (const q of queries) {
    const qt = new Set(tokens(q));
    let bestFaq = { id: "", q: "", score: 0 };
    for (const f of faqs) {
      const kwList = Array.isArray(f.keywords)
        ? (f.keywords as string[])
        : [];
      const ft = new Set([
        ...tokens(f.question),
        ...kwList.flatMap((k) => tokens(k)),
      ]);
      let overlap = 0;
      for (const t of qt) if (ft.has(t)) overlap++;
      const score = qt.size === 0 ? 0 : overlap / qt.size;
      if (score > bestFaq.score) bestFaq = { id: f.id, q: f.question, score };
    }

    const needle = "%" +
      q.toLowerCase().split(/\s+/).filter((t) => !STOPWORDS.has(t))[0] +
      "%";
    const [docs] = (await pool.query(
      `SELECT id, title,
        (CASE WHEN LOWER(title) LIKE ? THEN 3 ELSE 0 END) +
        (CASE WHEN LOWER(COALESCE(summary,'')) LIKE ? THEN 2 ELSE 0 END) +
        (CASE WHEN LOWER(content) LIKE ? THEN 1 ELSE 0 END) AS score
       FROM ai_training_documents
       WHERE LOWER(title) LIKE ? OR LOWER(content) LIKE ?
       ORDER BY score DESC LIMIT 1`,
      [needle, needle, needle, needle, needle],
    )) as [Array<{ id: string; title: string; score: number }>, unknown];
    const docMatch = docs[0];
    console.log(`Q: ${q}`);
    console.log(
      `  best FAQ : score=${bestFaq.score.toFixed(2)}  "${bestFaq.q || "(none)"}"`,
    );
    console.log(
      `  best DOC : score=${docMatch?.score ?? "—"}  "${docMatch?.title ?? "(none)"}"`,
    );
  }
}

main()
  .then(() => endPool())
  .catch(async (e) => {
    console.error(e);
    await endPool();
    process.exit(1);
  });
