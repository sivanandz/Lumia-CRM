import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ChatResponse {
  text: string;
  groundingMetadata?: any;
}

/**
 * Sends a message to Gemini with configurable modes.
 * @param prompt User input
 * @param history Chat history
 * @param mode 'thinking' for deep reasoning (Pro) or 'research' for web grounding (Flash)
 */
export const sendChatQuery = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[] = [],
  mode: 'thinking' | 'research' = 'thinking'
): Promise<ChatResponse> => {
  try {
    const systemContext = `
      You are an expert Financial Advisor assistant for the Indian market.
      You act as the "Brain" of a CRM system called Lumina Wealth.
      You have deep knowledge of:
      1. Indian Mutual Funds (Equity, Debt, Hybrid, ELSS).
      2. Insurance products (Term, Endowment, ULIP, Health).
      3. Market regulations (SEBI, IRDAI).
      
      Your goal is to help the advisor brainstorm strategies, analyze client portfolios, and suggest features for this CRM.
    `;

    const fullPrompt = `${systemContext}\n\nUser Query: ${prompt}`;
    const contents = [
      ...history.map(h => ({ role: h.role, parts: h.parts })),
      { role: 'user', parts: [{ text: fullPrompt }] }
    ];

    let response: GenerateContentResponse;

    if (mode === 'thinking') {
      // Use Gemini 3.0 Pro with Thinking capability
      response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: contents,
        config: {
          thinkingConfig: {
            thinkingBudget: 32768, // Max budget for deep reasoning
          },
        },
      });
    } else {
      // Use Gemini 2.5 Flash with Google Search Grounding
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
    }

    return {
      text: response.text || "I couldn't generate a response.",
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };

  } catch (error) {
    console.error("Error querying Gemini:", error);
    return { text: "I encountered an issue connecting to the neural network. Please try again." };
  }
};
