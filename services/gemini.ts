
import { GoogleGenAI, GenerativeModel } from "@google/genai";
import { SYSTEM_INSTRUCTION, ONOMATOPOEIA_GUIDE } from "../constants";
import { NovelConfig } from "../types";

const apiKey = process.env.API_KEY; 
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const getModel = (): GenerativeModel => {
  return ai.models.getGenerativeModel({
    model: "gemini-2.5-flash", 
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.85, // High creativity for fiction
      topK: 40,
      topP: 0.95,
    }
  });
};

export const generateNovelContent = async (config: NovelConfig): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  const model = getModel();

  let userPrompt = "";

  // Language Instruction Wrapper
  const languageInstruction = `
  IMPORTANT: THE ENTIRE OUTPUT MUST BE WRITTEN IN ${config.language.toUpperCase()}.
  If the target language is Indonesian, use "Bahasa Indonesia yang jujur, lugas, dan berdampak emosional tinggi".
  If the target language is Russian, use natural, literary Russian suitable for web novels.
  If the target language is Chinese, use standard simplified Chinese suitable for web novels.
  `;

  if (config.draftContent) {
    // Review Mode
    userPrompt = `
      ${languageInstruction}
      
      MODE: REVIEW & ANALYSIS (The SmutNovel Quilt Protocol)
      
      Please review the following draft based on the "SmutNovel Quilt" standards.
      
      CONTEXT:
      - Genre: ${config.genre}
      - Trope: ${config.trope}
      - Tone: ${config.tone}
      - Explicit Level: ${config.explicitLevel}
      
      TASKS:
      1. **Retention Analysis**: Analyze adherence to the "Golden Three Chapters" or Cliffhanger rules.
      2. **Prose Analysis**: Check for euphemisms (replace with direct diction) and visceral impact.
      3. **Rewrite Suggestions**: Provide specific rewrite suggestions for the weakest paragraphs using the ONOMATOPOEIA DATABASE (e.g., ${ONOMATOPOEIA_GUIDE}).
      4. **Expansion**: Suggest specific areas to expand Internal Monologue (Psychology) or Sensory Detail.
      
      DRAFT CONTENT:
      ${config.draftContent}
    `;
  } else {
    // Creation Mode
    userPrompt = `
      ${languageInstruction}
      
      MODE: NOVEL CREATION (PROTOCOL OPTION #1)
      
      Create the initial blueprint and the FIRST CHAPTER for a new novel.
      
      PARAMETERS:
      - Genre: ${config.genre}
      - Trope: ${config.trope}
      - Tone: ${config.tone}
      - Fetishes/Kinks: ${config.fetishes.join(", ")}
      - Explicit Level: ${config.explicitLevel}
      - POV: ${config.pov}
      - Protagonist: ${config.protagonist}
      - Antagonist: ${config.antagonist}
      - Plot Idea: ${config.plotSummary}
      
      DELIVERABLES:
      1. **Catchy Title & Blurb**: High commercial value, click-baity but emotional.
      2. **Character Chemistry**: Brief analysis of their dynamic.
      3. **Chapter 1 Outline**: Beat by beat.
      4. **CHAPTER 1 FULL PROSE (Min 2000 words)**:
         - **Style**: ${config.explicitLevel} intensity.
         - **Diction**: Use the specified audio/onomatopoeia (e.g., "Plok-plok!", "Slup-Smack!") where appropriate for the genre.
         - **Pacing**: Slow burn for tension, fast for action.
         - **Internal Monologue**: Must be at least 30% of the text.
         - **Ending**: Must be a high-stakes cliffhanger.
    `;
  }

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
    });
    return result.response.text() || "No content generated.";
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate content. Please check API key or try again.");
  }
};
