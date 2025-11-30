import { GoogleGenerativeAI } from "@google/generative-ai";
import { NovelConfig } from "../types"; // Pastikan types.ts Anda punya definisi ini, atau kita pakai 'any' dulu jika darurat

// --- Setup API ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  systemInstruction: "You are The SmutNovel Quilt, an expert erotic novel architect. Write visceral, high-retention prose."
});

// --- Fungsi 1: Untuk Chat Interface (Backup) ---
export class GeminiService {
  // Biarkan kosong atau sesuaikan jika nanti dipakai
}
export const geminiService = new GeminiService();

// --- Fungsi 2: Untuk Novel Generator (YANG WAJIB ADA) ---
export const generateNovelContent = async (config: any): Promise<string> => {
  try {
    const prompt = `
      WRITE A NOVEL OUTLINE & OPENING CHAPTER.
      
      Configuration:
      - Language: ${config.language}
      - Genre: ${config.genre}
      - Trope: ${config.trope}
      - Tone: ${config.tone}
      - Explicit Level: ${config.explicitLevel}
      - POV: ${config.pov}
      - Protagonist: ${config.protagonist}
      - Plot Summary: ${config.plotSummary}
      
      Fetishes/Elements to Include:
      ${config.fetishes.join(', ')}

      Please provide:
      1. A Catchy Title
      2. A Blurb
      3. Chapter 1 (Full Prose, applying "Show, Don't Tell")
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error("Gagal membuat novel: " + error.message);
  }
};
