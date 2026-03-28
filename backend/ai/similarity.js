// similarity.js - Enhanced Duplicate Detection
exports.findSimilar = async (text, complaints) => {
  if (complaints.length === 0) return [];
  
  const results = [];
  const inputWords = text.toLowerCase().split(/\s+/);
  const inputPhrases = extractPhrases(text.toLowerCase());
  
  for (let complaint of complaints) {
    const complaintWords = complaint.text.toLowerCase().split(/\s+/);
    const complaintPhrases = extractPhrases(complaint.text.toLowerCase());
    
    // Multiple similarity metrics
    const wordSimilarity = calculateWordSimilarity(inputWords, complaintWords);
    const phraseSimilarity = calculatePhraseSimilarity(inputPhrases, complaintPhrases);
    const semanticSimilarity = calculateSemanticSimilarity(text, complaint.text);
    
    // Weighted score
    const finalScore = (wordSimilarity * 0.3) + (phraseSimilarity * 0.4) + (semanticSimilarity * 0.3);
    
    if (finalScore > 0.4) {
      results.push({ 
        text: complaint.text, 
        score: Math.round(finalScore * 100) / 100,
        id: complaint._id,
        category: complaint.category,
        status: complaint.status
      });
    }
  }
  
  return results.sort((a,b) => b.score - a.score).slice(0, 3);
};

function extractPhrases(text) {
  // Extract common complaint phrases
  const phrases = [];
  const words = text.split(/\s+/);
  
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(words[i] + ' ' + words[i + 1]);
  }
  
  return phrases;
}

function calculateWordSimilarity(words1, words2) {
  const intersect = words1.filter(w => words2.includes(w));
  return intersect.length / Math.max(words1.length, words2.length);
}

function calculatePhraseSimilarity(phrases1, phrases2) {
  const intersect = phrases1.filter(p => phrases2.includes(p));
  return intersect.length / Math.max(phrases1.length, phrases2.length);
}

function calculateSemanticSimilarity(text1, text2) {
  // Simple semantic similarity based on key complaint indicators
  const indicators = [
    'payment', 'failed', 'deducted', 'refund', 'charge',
    'delivery', 'late', 'missing', 'package', 'shipping',
    'login', 'password', 'account', 'access', 'auth',
    'broken', 'error', 'bug', 'crash', 'not working'
  ];
  
  const score1 = indicators.filter(ind => text1.toLowerCase().includes(ind)).length;
  const score2 = indicators.filter(ind => text2.toLowerCase().includes(ind)).length;
  
  return Math.min(score1, score2) / Math.max(score1, score2) || 0;
}