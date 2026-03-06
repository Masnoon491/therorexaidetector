export interface AiBlock { text: string; fake: number; real: number; }
export interface GrammarMatch { message: string; shortMessage: string; offset: number; length: number; replacements: string[]; }
export interface FactCheck { fact: string; truthfulness: string; explanation: string; }
export interface ScanResults {
  ai?: { score: number; originalScore: number; classification: string; blocks: AiBlock[]; };
  plagiarism?: { score: number };
  readability?: { fleschReadingEase?: number; fleschGradeLevel?: number; gunningFoxIndex?: number; smogIndex?: number; avgReadingTime?: number; sentenceCount?: number; wordCount?: number; };
  grammar?: GrammarMatch[];
  facts?: FactCheck[];
}
