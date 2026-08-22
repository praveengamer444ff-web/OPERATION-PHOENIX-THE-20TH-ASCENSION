import {
  CAMPAIGN_DAYS,
  PASS_THRESHOLD,
  TITAN_THRESHOLD,
  type DayRecord,
  type DayStatus,
  type RankInfo,
  RANKS,
} from '../types';
import { calculateTotalScore } from '../data/quests';

export const CAMPAIGN_START = '2026-08-24';
export const CAMPAIGN_END = '2026-09-22';

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDateForDay(dayNumber: number): string {
  const start = parseDate(CAMPAIGN_START);
  const date = new Date(start);
  date.setDate(start.getDate() + dayNumber - 1);
  return formatDateISO(date);
}

export function getCurrentCampaignDay(): number {
  const today = formatDateISO(new Date());
  const start = parseDate(CAMPAIGN_START);
  const end = parseDate(CAMPAIGN_END);
  const now = parseDate(today);

  if (now < start) return 0;
  if (now > end) return CAMPAIGN_DAYS;

  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

export function getDayStatus(
  dayNumber: number,
  score: number,
  currentDay: number
): DayStatus {
  if (dayNumber > currentDay) return 'locked';
  if (score >= TITAN_THRESHOLD) return 'titan';
  if (score >= PASS_THRESHOLD) return 'passed';
  if (dayNumber === currentDay) return 'active';
  return 'failed';
}

export function createEmptyDayRecord(dayNumber: number): DayRecord {
  return {
    dayNumber,
    date: getDateForDay(dayNumber),
    questStates: {},
    totalScore: 0,
    status: dayNumber > getCurrentCampaignDay() ? 'locked' : 'active',
  };
}

export function getRankForScore(score: number): RankInfo {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (score >= RANKS[i].minPoints) return RANKS[i];
  }
  return RANKS[0];
}

export function formatDisplayDate(dateStr: string): string {
  const date = parseDate(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function recalculateDayRecord(
  record: DayRecord,
  currentDay: number
): DayRecord {
  const totalScore = calculateTotalScore(record.questStates);
  const status = getDayStatus(record.dayNumber, totalScore, currentDay);
  return { ...record, totalScore, status };
}

export function calculateStreak(
  days: Record<number, DayRecord>,
  currentDay: number
): number {
  let streak = 0;
  for (let d = currentDay; d >= 1; d--) {
    const day = days[d];
    if (!day) break;
    if (day.totalScore >= PASS_THRESHOLD) {
      streak++;
    } else if (d < currentDay) {
      break;
    }
  }
  return streak;
}

export function calculateTotalXP(days: Record<number, DayRecord>): number {
  return Object.values(days).reduce((sum, d) => sum + d.totalScore, 0);
}
