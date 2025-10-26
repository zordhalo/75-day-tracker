
import { GoogleGenAI } from "@google/genai";
import type { ChallengeData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. In a real environment, the key would be set.
  console.warn("Gemini API key not found. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function getMotivationalMessage(challengeData: ChallengeData, userQuery: string): Promise<string> {
    if(!API_KEY) return "The AI assistant is currently unavailable. Keep up the great work!";
    
    try {
        const prompt = `
            You are a supportive but firm accountability coach for the 75 Hard challenge.
            The user is on Day ${challengeData.currentDay} of 75.
            Here is their progress history (a summary):
            - Total days completed: ${challengeData.currentDay}
            - Days remaining: ${75 - challengeData.currentDay}
            - History length: ${challengeData.history.length} entries.

            The user's query is: "${userQuery}"

            Based on this context, provide a concise, motivational, and helpful response.
            - If they ask for motivation, give them a powerful, relevant message.
            - If they ask for statistics or insights, analyze their request based on the provided data.
            - If they ask about rules, be clear and strict, referencing the core tenets of 75 Hard.
            - Keep your response in Markdown format.
            - Be encouraging but always uphold the "no excuses" philosophy of the challenge.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating content with Gemini:", error);
        return "I'm having a little trouble connecting right now. But don't let that stop you. Stay focused on your goals for today!";
    }
}
