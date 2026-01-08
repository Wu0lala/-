export enum ActivityCategory {
  WORK = 'Work',
  LEARNING = 'Learning',
  HEALTH = 'Health',
  LEISURE = 'Leisure',
  CHORE = 'Chore',
  SOCIAL = 'Social',
  OTHER = 'Other'
}

export enum EnergyLevel {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO string or HH:mm
  durationMinutes: number;
  category: ActivityCategory;
  energy: EnergyLevel;
  timestamp: number; // For sorting
}

export interface AnalysisResponse {
  score: number;
  summary: string;
  insights: string[];
  suggestions: string[];
  revisedSchedule: string;
}

export type ViewState = 'timeline' | 'analysis' | 'settings';

export type Language = 'en' | 'zh';

export interface AppSettings {
  language: Language;
  baseUrl?: string; // Custom API endpoint for proxy access
}