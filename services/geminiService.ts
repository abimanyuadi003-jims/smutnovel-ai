import { GoogleGenerativeAI } from "@google/generative-ai";
import { NovelConfig } from "../types"; 

// --- Setup API ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// PERBAIKAN DI SINI: Kita tambahkan { apiVersion: 'v1beta' }
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  systemInstruction: "You are The SmutNovel Quilt, an expert erotic novel architect. Write visceral, high-retention prose.",
}, { apiVersion: 'v1beta' });

// --- Fungsi 1: Untuk Chat Interface (Backup) ---
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private modelName = 'gemini-1.5-flash';

  constructor() {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  public async *streamChat(history: any[], newMessage: string, language: string): AsyncGenerator<string, void, unknown> {
    try {
      // Kita pakai v1beta juga di sini
      const chatModel = this.genAI.getGenerativeModel({ 
        model: this.modelName,
        systemInstruction: "You are a helpful assistant." 
      }, { apiVersion: 'v1beta' });

      const chat = chatModel.startChat({
        history: history
          .filter(msg => msg.text && msg.text.trim() !== "")
          .map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
          })),
      });

      const result = await chat.sendMessageStream(newMessage);
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) yield chunkText;
      }
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      yield "Error connecting to AI.";
    }
  }
}
export const geminiService = new GeminiService();

// --- Fungsi 2: Untuk Novel Generator ---
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
      ${config.fetishes?.join(', ') || 'None'}

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
