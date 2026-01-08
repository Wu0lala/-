import { GoogleGenAI, Type } from "@google/genai";
import { Activity, AppSettings } from '../types';

// Declare process manually to satisfy TS compiler in environments where @types/node might be missing or conflicting
declare const process: any;

const getClient = (settings: AppSettings) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing in environment variables");
  }
  
  // Support custom Base URL for regions where Google is blocked (China/Russia)
  // The SDK allows passing baseUrl in the constructor options
  const options: any = { apiKey };
  if (settings.baseUrl && settings.baseUrl.trim() !== '') {
    options.baseUrl = settings.baseUrl.trim();
  }

  return new GoogleGenAI(options);
};

export const analyzeDailyLog = async (activities: Activity[], settings: AppSettings) => {
  const ai = getClient(settings);
  
  if (activities.length === 0) {
    throw new Error("No activities to analyze.");
  }

  // Convert activities to a readable prompt string
  const activitiesText = activities.map(a => 
    `- [${a.startTime}, ${a.durationMinutes} mins] ${a.category}: ${a.title} (Energy: ${a.energy}) ${a.description ? `Note: ${a.description}` : ''}`
  ).join('\n');

  const langInstruction = settings.language === 'zh' 
    ? "IMPORTANT: Please provide the response in Simplified Chinese (简体中文)." 
    : "Please provide the response in English.";

  const prompt = `
    You are an expert productivity coach. Analyze the following daily activity log.
    
    Log:
    ${activitiesText}

    ${langInstruction}

    Please provide a structured analysis containing:
    1. An efficiency score (0-100).
    2. A brief summary of the day.
    3. Key insights (positive or negative patterns, e.g., "Too much switching context").
    4. Actionable suggestions to improve.
    5. A revised, optimized version of this schedule for a similar day (Markdown format).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Efficiency score from 0 to 100" },
            summary: { type: Type.STRING, description: "Brief summary of the day" },
            insights: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of insights about the schedule"
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of actionable suggestions"
            },
            revisedSchedule: { 
              type: Type.STRING, 
              description: "A rewritten schedule in Markdown format suggesting improvements" 
            }
          },
          required: ["score", "summary", "insights", "suggestions", "revisedSchedule"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI");
    
    return JSON.parse(resultText);

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};