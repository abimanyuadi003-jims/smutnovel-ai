
export type Language = 'Indonesian' | 'English' | 'Russian' | 'Chinese';

export type OutputMode = 'Novel_From_Scratch' | 'Review_Full_Draft' | 'Review_Chapter';

export type ExplicitLevel = 'Mild' | 'Standard' | 'Intense' | 'Extreme';

export type NovelConfig = {
  language: Language;
  genre: string;
  trope: string;
  tone: string;
  fetishes: string[];
  explicitLevel: ExplicitLevel;
  pov: 'First' | 'Third' | 'Dual Alternating' | 'Second';
  protagonist: string;
  antagonist: string;
  plotSummary?: string; // For scratch
  draftContent?: string; // For review
};

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}
