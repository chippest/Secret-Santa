
import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface GenerationResult {
  starMessage: string;
  ornamentMessages: string[];
}

export const generateOrnamentMessages = async (prefs: UserPreferences): Promise<GenerationResult> => {
  try {
    const prompt = `Generate a set of Christmas messages based on these details:
    Activity: ${prefs.favoriteActivity}, Flavor: ${prefs.favoriteFlavor}, Vibe: ${prefs.holidayVibe}, Wish: ${prefs.wish}.

    Return a JSON object with:
    1. "starMessage": A deeply personal, glowing, and heartwarming message that makes the user feel amazing about who they are. It should be sincere and positive, focusing on their inner light.
    2. "ornamentMessages": An array of 5 strings:
       - The first one MUST be sarcastically positive and end with ":)". (e.g., "Wow, look at you being all festive and stuff. Truly a miracle of nature :)")
       - The other 4 should be humorously positive notes written as if Santa left them. They should be funny, a bit informal, and festive.

    Return only JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            starMessage: { type: Type.STRING },
            ornamentMessages: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["starMessage", "ornamentMessages"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      starMessage: data.starMessage || "You are a brilliant light in this world, and your kindness is the greatest gift of all.",
      ornamentMessages: data.ornamentMessages?.length >= 5 ? data.ornamentMessages : [
        "So glad you're trying your best to be on the nice list this late in the game :)",
        "Santa saw that. But Santa also likes cookies, so we can negotiate.",
        "Note to self: This person needs extra cocoa and fewer adult responsibilities.",
        "Your holiday spirit is almost as loud as my reindeer's footsteps on a tin roof!",
        "I checked the list twice. You're still in the 'mostly okay' category. Good job!"
      ]
    };
  } catch (error) {
    console.error("Error generating messages:", error);
    return {
      starMessage: "You are a brilliant light in this world, and your kindness is the greatest gift of all.",
      ornamentMessages: [
        "So glad you're trying your best to be on the nice list this late in the game :)",
        "Santa saw that. But Santa also likes cookies, so we can negotiate.",
        "Note to self: This person needs extra cocoa and fewer adult responsibilities.",
        "Your holiday spirit is almost as loud as my reindeer's footsteps on a tin roof!",
        "I checked the list twice. You're still in the 'mostly okay' category. Good job!"
      ]
    };
  }
};
