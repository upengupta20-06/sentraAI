const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateResponse = async (text) => {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("YOUR_OPENAI_API_KEY")) {
       throw new Error("Missing API Key");
    }

    const prompt = `You are SentraAI, an elite customer resolution assistant. 

Customer Complaint: "${text}"

Generate a response that:
1. Acknowledges the customer's frustration (if present)
2. Shows empathy and understanding
3. Provides a clear next step or solution
4. Maintains professional but friendly tone
5. Is concise but complete

Format your response as a JSON object with:
{
  "response": "The actual customer response",
  "nextAction": "Specific action for the agent",
  "priority": "High/Medium/Low",
  "estimatedResolution": "Time estimate"
}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are an AI-powered customer service expert. Always respond with valid JSON only." 
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (err) {
    console.warn("AI Response Fallback triggered:", err.message);
    return {
      response: `We've received your concern regarding "${text.slice(0, 40)}...". Our AI systems have flagged this for priority review, and an agent will follow up within our standard SLA.`,
      nextAction: "Review and categorize manually",
      priority: "Medium",
      estimatedResolution: "24-48 hours"
    };
  }
};
