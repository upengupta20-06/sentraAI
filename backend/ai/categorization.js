const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.categorize = async (text) => {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("YOUR_OPENAI_API_KEY")) {
      return "General";
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "Categorize this customer complaint into exactly one of these categories: Payment Issue, Delivery Issue, Auth Issue, or General." 
        },
        { role: "user", content: text }
      ],
      max_tokens: 10,
      temperature: 0
    });

    const categories = ["Payment Issue", "Delivery Issue", "Auth Issue", "General"];
    const result = completion.choices[0].message.content.trim();
    return categories.find(c => result.toLowerCase().includes(c.toLowerCase())) || "General";

  } catch (err) {
    console.warn("Categorization AI error:", err.message);
    // Simple fallback logic
    const t = text.toLowerCase();
    if (t.includes("payment")) return "Payment Issue";
    if (t.includes("delivery")) return "Delivery Issue";
    if (t.includes("login")) return "Auth Issue";
    return "General";
  }
};