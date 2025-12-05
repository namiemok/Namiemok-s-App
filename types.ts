export interface DreamAnalysisResponse {
  analysis: string;
  stressLevel: number; // 0 to 10
  advice: string;
}

export interface DreamRecord {
  id: string;
  timestamp: number;
  dateStr: string;
  dreamContent: string;
  analysis: string;
  stressLevel: number;
  advice: string;
  imageUrl?: string; // Base64 string of the generated image
}

export enum ViewState {
  HOME = 'HOME',
  HISTORY = 'HISTORY',
  ANALYZE = 'ANALYZE'
}