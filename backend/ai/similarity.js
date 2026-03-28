const { pipeline } = require("@xenova/transformers");

let embedder;

(async () => {
  embedder = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
})();

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

exports.findSimilar = async (text, complaints) => {
  if (!embedder || complaints.length === 0) return [];

  const newVec = (await embedder(text))[0];

  let results = [];

  for (let c of complaints) {
    const oldVec = (await embedder(c.text))[0];

    const score = cosineSimilarity(newVec, oldVec);

    if (score > 0.85) {
      results.push({ text: c.text, score });
    }
  }

  return results;
};