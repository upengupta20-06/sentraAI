// similarity.js - Fallback
exports.findSimilar = async (text, complaints) => {
  if (complaints.length === 0) return [];
  
  const results = [];
  const words = text.toLowerCase().split(/\s+/);
  
  for (let c of complaints) {
    const cWords = c.text.toLowerCase().split(/\s+/);
    const intersect = words.filter(w => cWords.includes(w));
    const score = intersect.length / Math.max(words.length, cWords.length);
    
    if (score > 0.3) { // simple jaccard-like score
      results.push({ text: c.text, score });
    }
  }
  
  return results.sort((a,b) => b.score - a.score).slice(0, 5);
};