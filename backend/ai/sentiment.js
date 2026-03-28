// sentiment.js - Fallback
exports.analyzeSentiment = async (text) => {
  const lower = text.toLowerCase();
  if (lower.includes("bad") || lower.includes("worst") || lower.includes("broken") || lower.includes("hate")) {
    return "NEGATIVE";
  }
  if (lower.includes("good") || lower.includes("great") || lower.includes("excellent") || lower.includes("love")) {
    return "POSITIVE";
  }
  return "NEUTRAL";
};