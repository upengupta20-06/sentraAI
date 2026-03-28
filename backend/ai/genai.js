const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateResponse = async (text) => {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("YOUR_OPENAI_API_KEY")) {
       throw new Error("Missing API Key");
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: `Reply professionally to: ${text}` }
      ]
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.warn("AI Response Fallback triggered:", err.message);
    return `Thank you for your feedback. We have received your complaint ("${text.slice(0, 30)}...") and our team is already looking into it according to our SLA.`;
  }
};