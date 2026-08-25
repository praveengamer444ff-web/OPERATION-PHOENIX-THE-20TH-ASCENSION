import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppState } from '../types';
import {
  calculateStreak,
  calculateTotalXP,
  getCurrentCampaignDay,
  recalculateDayRecord,
} from '../utils/campaign';
import {
  loadState,
  saveState,
  playLevelUpSound,
  playQuestCompleteSound,
} from '../utils/storage';
import { getRankForScore } from '../utils/campaign';
import { RANKS } from '../types';

export function usePhoenixState(userId: string | null = null, campaignStart?: string, campaignEnd?: string) {
  const startDate = campaignStart ?? undefined;
  const endDate = campaignEnd ?? undefined;
  const [state, setState] = useState<AppState>(() => loadState(userId ?? 'guest', startDate, endDate));
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const currentDay = useMemo(() => getCurrentCampaignDay(state.campaignStartDate, state.campaignEndDate), [currentDate, state.campaignStartDate, state.campaignEndDate]);

  useEffect(() => {
    const refreshTimer = window.setInterval(() => setCurrentDate(new Date()), 60_000);
    return () => window.clearInterval(refreshTimer);
  }, []);

  useEffect(() => {
    if (userId) setState(loadState(userId, startDate, endDate));
  }, [userId, startDate, endDate]);

  const selectedDayRecord = state.days[state.selectedDay];
  const todayScore = selectedDayRecord?.totalScore ?? 0;
  const rank = getRankForScore(todayScore);
  const isViewingPast = state.selectedDay < currentDay;
  const isViewingFuture = state.selectedDay > currentDay;
  const isEditable = state.selectedDay === currentDay && currentDay > 0;

  useEffect(() => {
    if (userId) saveState(state, userId);
  }, [state, userId]);

  const toggleQuest = useCallback(
    (questId: string) => {
      if (!isEditable) return;

      setState((prev) => {
        const day = prev.days[prev.selectedDay];
        if (!day) return prev;

        const wasChecked = day.questStates[questId] ?? false;
        const newQuestStates = {
          ...day.questStates,
          [questId]: !wasChecked,
        };

        const updatedDay = recalculateDayRecord(
          { ...day, questStates: newQuestStates },
          currentDay
        );

        const newDays = { ...prev.days, [prev.selectedDay]: updatedDay };
        const streak = calculateStreak(newDays, currentDay);
        const totalXP = calculateTotalXP(newDays);

        if (prev.soundEnabled) {
          if (!wasChecked) playQuestCompleteSound();
          const oldRank = getRankForScore(day.totalScore);
          const newRank = getRankForScore(updatedDay.totalScore);
          if (newRank.tier > oldRank.tier) playLevelUpSound();
        }

        return {
          ...prev,
          days: newDays,
          streak,
          totalXP,
        };
      });
    },
    [isEditable, currentDay]
  );

  const selectDay = useCallback(
    (dayNumber: number) => {
      if (dayNumber > currentDay) return;
      setState((prev) => ({ ...prev, selectedDay: dayNumber }));
    },
    [currentDay]
  );

  const goToToday = useCallback(() => {
    if (currentDay > 0) {
      setState((prev) => ({ ...prev, selectedDay: currentDay }));
    }
  }, [currentDay]);

  const toggleSound = useCallback(() => {
    setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const progressToNextRank = useMemo(() => {
    const currentRankIndex = RANKS.findIndex((r) => r.title === rank.title);
    if (currentRankIndex >= RANKS.length - 1) return 100;
    const nextRank = RANKS[currentRankIndex + 1];
    const range = nextRank.minPoints - rank.minPoints;
    const progress = todayScore - rank.minPoints;
    return Math.min(100, Math.max(0, (progress / range) * 100));
  }, [rank, todayScore]);

  return {
    state,
    currentDay,
    selectedDayRecord,
    todayScore,
    rank,
    isViewingPast,
    isViewingFuture,
    isEditable,
    progressToNextRank,
    toggleQuest,
    selectDay,
    goToToday,
    toggleSound,
  };
}
