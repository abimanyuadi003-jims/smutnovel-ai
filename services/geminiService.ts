import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message, Role, Language } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private modelName = 'gemini-1.5-flash';

  constructor() {
    // KITA UBAH DI SINI:
    // Hapus 'import.meta.env' yang bikin error.
    // Kita pakai 'process.env' saja karena sudah diatur di vite.config.ts
    const apiKey = process.env.GEMINI_API_KEY as string;
    
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  public async *streamChat(history: Message[], newMessage: string, language: Language): AsyncGenerator<string, void, unknown> {
    try {
      const languageInstruction = language === 'ID' 
        ? "\n\n[INSTRUCTION: OUTPUT MUST BE IN INDONESIAN LANGUAGE]" 
        : "\n\n[INSTRUCTION: OUTPUT MUST BE IN ENGLISH LANGUAGE]";

      const model = this.genAI.getGenerativeModel({ 
        model: this.modelName,
        systemInstruction: SYSTEM_INSTRUCTION + languageInstruction
      });

      const chatHistory = history
        .filter(msg => msg.text && msg.text.trim() !== "")
        .map(msg => ({
          role: msg.role === Role.USER ? 'user' : 'model',
          parts: [{ text: msg.text }],
        }));

      const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
          temperature: 0.8,
        },
      });

      const result = await chat.sendMessageStream(newMessage);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          yield chunkText;
        }
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      yield "Error: Gagal terhubung. Cek API Key di Vercel.";
    }
  }
}

export const geminiService = new GeminiService();
