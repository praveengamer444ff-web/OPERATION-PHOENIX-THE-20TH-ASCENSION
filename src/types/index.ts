export interface QuestItem {
  id: string;
  label: string;
  points: number;
}

export interface QuestModule {
  id: string;
  title: string;
  emoji: string;
  accent: string;
  quests: QuestItem[];
}

export type DayStatus = 'locked' | 'active' | 'passed' | 'failed' | 'titan';

export interface DayRecord {
  dayNumber: number;
  date: string;
  questStates: Record<string, boolean>;
  totalScore: number;
  status: DayStatus;
}

export interface AppState {
  commanderName: string;
  campaignStartDate: string;
  campaignEndDate: string;
  streak: number;
  totalXP: number;
  soundEnabled: boolean;
  days: Record<number, DayRecord>;
  selectedDay: number;
  lastStreakDate: string | null;
}

export interface RankInfo {
  title: string;
  emoji: string;
  tier: number;
  minPoints: number;
  maxPoints: number;
}

export const RANKS: RankInfo[] = [
  { title: 'Novice Phoenix', emoji: '🐣', tier: 0, minPoints: 0, maxPoints: 49 },
  { title: 'Rising Warrior', emoji: '⚔️', tier: 1, minPoints: 50, maxPoints: 69 },
  { title: 'Apex Commander', emoji: '🔥', tier: 2, minPoints: 70, maxPoints: 89 },
  { title: 'Phoenix Titan', emoji: '👑', tier: 3, minPoints: 90, maxPoints: 100 },
];

export const STORAGE_KEY = 'operation-phoenix-state-v1';
export const CAMPAIGN_DAYS = 30;
export const PASS_THRESHOLD = 70;
export const TITAN_THRESHOLD = 100;
