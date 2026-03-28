const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.analyzeSentiment = async (text) => {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("YOUR_OPENAI_API_KEY")) {
      return "NEUTRAL";
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are a sentiment analyzer. Reply with exactly one word: POSITIVE, NEGATIVE, or NEUTRAL." 
        },
        { role: "user", content: text }
      ],
      max_tokens: 5,
      temperature: 0
    });

    const sentiment = completion.choices[0].message.content.toUpperCase().trim();
    if (["POSITIVE", "NEGATIVE", "NEUTRAL"].includes(sentiment)) {
      return sentiment;
    }
    return "NEUTRAL";
  } catch (err) {
    console.error("Sentiment AI error:", err.message);
    // Simple fallback logic
    const lower = text.toLowerCase();
    if (lower.includes("bad") || lower.includes("worst") || lower.includes("broken") || lower.includes("hate")) return "NEGATIVE";
    if (lower.includes("good") || lower.includes("great") || lower.includes("excellent") || lower.includes("love")) return "POSITIVE";
    return "NEUTRAL";
  }
};