export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  code?: string;
  timestamp: number;
}

export interface GenerationState {
  isGenerating: boolean;
  progress: number; // 0-100
  status: string;
}

export enum GeminiModel {
  BASIC = 'gemini-2.5-flash',
  PRO = 'gemini-3-pro-preview',
}