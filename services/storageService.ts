import { Activity, AppSettings } from '../types';

const ACTIVITIES_KEY = 'dailyflow_activities';
const SETTINGS_KEY = 'dailyflow_settings';

export const saveActivities = (activities: Activity[]): void => {
  try {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  } catch (e) {
    console.error("Failed to save activities", e);
  }
};

export const loadActivities = (): Activity[] => {
  try {
    const stored = localStorage.getItem(ACTIVITIES_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load activities", e);
    return [];
  }
};

export const clearActivities = (): void => {
  localStorage.removeItem(ACTIVITIES_KEY);
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings", e);
  }
};

export const loadSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    // Default to Chinese if not set, as requested by user context, otherwise English
    if (!stored) return { language: 'zh' };
    return JSON.parse(stored);
  } catch (e) {
    return { language: 'zh' };
  }
};