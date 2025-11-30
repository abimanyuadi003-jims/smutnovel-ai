import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message, Role, Language } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private modelName = 'gemini-1.5-flash';

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.API_KEY || '');
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

      // Format history sesuai standar SDK resmi
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
      yield "Error: Unable to connect to The SmutNovel Quilt. Please check your API Key configuration.";
    }
  }
}

export const geminiService = new GeminiService();
