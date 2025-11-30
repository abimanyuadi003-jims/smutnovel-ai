import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Setup API dengan Jalur Beta (Wajib untuk Flash) ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// Kita buat model instance khusus dengan apiVersion 'v1beta'
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  systemInstruction: "You are The SmutNovel Quilt, an expert erotic novel architect. Your goal is to write visceral, high-retention prose and provide brutal, constructive feedback.",
}, { apiVersion: 'v1beta' });

// --- Class GeminiService (Untuk Chat) ---
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private modelName = 'gemini-1.5-flash';

  constructor() {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  public async *streamChat(history: any[], newMessage: string, language: string): AsyncGenerator<string, void, unknown> {
    try {
      // Paksa v1beta juga di sini
      const chatModel = this.genAI.getGenerativeModel({ 
        model: this.modelName,
        systemInstruction: "You are The SmutNovel Quilt. Help the user write and review their novel." 
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
      yield "Error connecting to AI (Chat).";
    }
  }
}
export const geminiService = new GeminiService();

// --- Fungsi Utama: Generate & Review ---
export const generateNovelContent = async (config: any): Promise<string> => {
  try {
    let prompt = "";

    // Logika Cerdas: Cek apakah ini permintaan Review atau Buat Baru
    if (config.draftContent && config.draftContent.length > 50) {
      // MODE REVIEW
      prompt = `
        ACT AS AN EDITOR. REVIEW THIS DRAFT.
        
        Context:
        - Genre: ${config.genre}
        - Tone: ${config.tone}
        
        THE DRAFT TO REVIEW:
        "${config.draftContent}"

        Please provide:
        1. 💎 Strengths (What works well?)
        2. 🚩 Weaknesses (Pacing, Dialogue, Show Don't Tell issues)
        3. 🔥 Spice/Tension Check (Is the chemistry working?)
        4. ✍️ Rewrite Suggestion (Rewrite a small weak section to be better)
      `;
    } else {
      // MODE CREATE NOVEL
      prompt = `
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
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini Error:", error);
    // Menampilkan pesan error yang lebih jelas
    throw new Error(`Gagal memproses (API Error): ${error.message}`);
  }
};
