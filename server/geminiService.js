import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

/**
 * Gemini Service
 * Handles all interactions with Google Gemini AI, including grounding and safety.
 */
export const geminiService = {
  /**
   * Generates a travel itinerary stream with Google Search grounding.
   * @param {string} destination - The target city/country
   * @param {string} dates - Travel dates
   * @returns {Promise<Object>} - The response stream
   */
  async generateItineraryStream(destination, dates) {
    const model = ai.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      // Google Services: Enable Google Search Grounding for real-time travel data
      tools: [{ googleSearch: {} }] 
    });

    const generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const prompt = `Create a professional, highly detailed travel itinerary for ${destination} for the dates: ${dates}. 
    Use the Google Search tool to ensure all attractions, restaurants, and tips are currently open and accurate.
    Format in Markdown. Include daily schedules, top attractions, local food recommendations, and travel tips.`;

    return model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });
  }
};
