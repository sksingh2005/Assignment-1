
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

export async function generateAIAnalysis(review: string, rating: number) {
    const prompt = `
You are a helpful customer support AI.
A user left a ${rating}-star review:
"${review}"

Please generate:
1. A polite, empathetic response to the user (max 50 words).
2. A very brief summary for the admin (max 15 words).
3. A list of 3 recommended actions for the business based on this feedback.

Return the result STRICTLY as a valid JSON object with the following structure:
{
  "userResponse": "string",
  "summary": "string",
  "actions": ["action1", "action2", "action3"]
}
`;

    if (!API_KEY) {
        console.warn("GEMINI_API_KEY is missing in environment variables.");
        return {
            userResponse: "Thank you for your feedback! (AI features are currently unavailable)",
            summary: "AI analysis unavailable.",
            actions: []
        };
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        // Use gemini-pro as it's the standard text model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text) throw new Error("No text in response");

        // Clean markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);

    } catch (error) {
        console.error("LLM Generation Failed:", error);
        return {
            userResponse: "Thank you for your feedback! We are processing it.",
            summary: "Error generating summary.",
            actions: ["Check system logs"]
        };
    }
}
