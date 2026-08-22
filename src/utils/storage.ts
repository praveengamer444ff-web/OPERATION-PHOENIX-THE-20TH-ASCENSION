import type { AppState } from '../types';
import { STORAGE_KEY } from '../types';
import {
  CAMPAIGN_END,
  CAMPAIGN_START,
  createEmptyDayRecord,
  getCurrentCampaignDay,
  recalculateDayRecord,
  calculateStreak,
  calculateTotalXP,
} from './campaign';
import { CAMPAIGN_DAYS } from '../types';

function createInitialDays(): Record<number, ReturnType<typeof createEmptyDayRecord>> {
  const days: Record<number, ReturnType<typeof createEmptyDayRecord>> = {};
  const currentDay = getCurrentCampaignDay();
  for (let i = 1; i <= CAMPAIGN_DAYS; i++) {
    days[i] = createEmptyDayRecord(i);
    if (i < currentDay) {
      days[i] = recalculateDayRecord(days[i], currentDay);
    }
  }
  return days;
}

export function createInitialState(): AppState {
  const currentDay = getCurrentCampaignDay();
  const days = createInitialDays();
  return {
    commanderName: 'COMMANDER PRAVEEN',
    campaignStartDate: CAMPAIGN_START,
    campaignEndDate: CAMPAIGN_END,
    streak: 0,
    totalXP: 0,
    soundEnabled: false,
    days,
    selectedDay: currentDay > 0 ? Math.min(currentDay, CAMPAIGN_DAYS) : 1,
    lastStreakDate: null,
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();

    const parsed = JSON.parse(raw) as AppState;
    const currentDay = getCurrentCampaignDay();

    const days = { ...createInitialDays(), ...parsed.days };
    for (let i = 1; i <= CAMPAIGN_DAYS; i++) {
      if (days[i]) {
        days[i] = recalculateDayRecord(days[i], currentDay);
      } else {
        days[i] = createEmptyDayRecord(i);
      }
    }

    const streak = calculateStreak(days, currentDay);
    const totalXP = calculateTotalXP(days);
    const selectedDay = Number.isInteger(parsed.selectedDay)
      ? Math.min(Math.max(parsed.selectedDay, 1), CAMPAIGN_DAYS)
      : currentDay > 0
        ? currentDay
        : 1;

    return {
      ...createInitialState(),
      ...parsed,
      campaignStartDate: CAMPAIGN_START,
      campaignEndDate: CAMPAIGN_END,
      days,
      streak,
      totalXP,
      selectedDay,
    };
  } catch {
    return createInitialState();
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or unavailable */
  }
}

export function playLevelUpSound(): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    /* audio unavailable */
  }
}

export function playQuestCompleteSound(): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523, ctx.currentTime);
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    /* audio unavailable */
  }
}
