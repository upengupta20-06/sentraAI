const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.analyzeDeeply = async (text) => {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("YOUR_OPENAI_API_KEY")) {
      return { 
        category: "General", 
        product: "Unknown", 
        severity: "Medium", 
        rootCause: "Awaiting analysis", 
        regulatoryFlag: false, 
        nextBestAction: "Review manually" 
      };
    }

    const prompt = `Analyze this customer complaint: "${text}"
    Extract the following in JSON format:
    1. category: One of [Payment Issue, Delivery Issue, Auth Issue, Technical, General]
    2. product: Use "Unknown" if not mentioned.
    3. severity: One of [Low, Medium, High, Critical]
    4. rootCause: Brief likely reason for the issue.
    5. regulatoryFlag: boolean, set to true if it mentions legal action, fraud, or data privacy.
    6. nextBestAction: Actionable step for the agent (e.g., "Issue full refund", "Reset password", etc.)
    
    Response MUST be valid JSON only.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "You are a professional support analyst." }, { role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content);

  } catch (err) {
    console.error("Deep Analysis error:", err.message);
    return { 
        category: "General", 
        product: "Unknown", 
        severity: "Medium", 
        rootCause: "Error during analysis", 
        regulatoryFlag: false, 
        nextBestAction: "Contact developer" 
    };
  }
};
