import { motion } from 'framer-motion';
import { Flame, Volume2, VolumeX, Zap, Crown } from 'lucide-react';
import type { RankInfo } from '../types';

interface TopHUDProps {
  commanderName: string;
  rank: RankInfo;
  todayScore: number;
  streak: number;
  totalXP: number;
  currentDay: number;
  progressToNextRank: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function TopHUD({
  commanderName,
  rank,
  todayScore,
  streak,
  totalXP,
  currentDay,
  progressToNextRank,
  soundEnabled,
  onToggleSound,
}: TopHUDProps) {
  const xpPercent = Math.min(100, todayScore);

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative z-10 mb-6"
    >
      <div className="glass-panel gradient-border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="status-ring w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">{rank.emoji}</span>
              </div>
            </div>
            <div>
              <p className="text-electric-blue/70 text-xs sm:text-sm font-body tracking-widest uppercase">
                Operation Phoenix
              </p>
              <h1 className="font-display text-lg sm:text-2xl font-bold text-white tracking-wide">
                {commanderName}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="rank-badge">{rank.emoji} {rank.title}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-center">
              <p className="text-xs text-white/50 uppercase tracking-wider font-body">Day</p>
              <p className="font-display text-2xl sm:text-3xl font-bold text-radiant-gold">
                {currentDay > 0 ? currentDay : '—'}
                <span className="text-sm text-white/40">/30</span>
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-white/50 uppercase tracking-wider font-body flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-fire-orange" /> Streak
              </p>
              <p className="font-display text-2xl sm:text-3xl font-bold text-fire-orange streak-flame">
                {streak}
              </p>
            </div>

            <div className="text-center hidden sm:block">
              <p className="text-xs text-white/50 uppercase tracking-wider font-body flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-electric-blue" /> Total XP
              </p>
              <p className="font-display text-2xl font-bold text-electric-blue">{totalXP}</p>
            </div>

            <button
              onClick={onToggleSound}
              className="sound-toggle"
              aria-label={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-electric-blue" />
              ) : (
                <VolumeX className="w-5 h-5 text-white/40" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm font-body text-white/60 uppercase tracking-wider">
              Daily XP Progress
            </span>
            <span className="font-display text-sm sm:text-base font-bold text-white">
              {todayScore}
              <span className="text-white/40"> / 100 PTS</span>
              {todayScore >= 100 && (
                <Crown className="inline w-4 h-4 ml-1 text-radiant-gold" />
              )}
            </span>
          </div>

          <div className="xp-bar-track">
            <motion.div
              className="xp-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <div
              className="xp-bar-glow"
              style={{ width: `${xpPercent}%` }}
            />
          </div>

          {rank.tier < 3 && (
            <div className="flex justify-between items-center pt-1">
              <span className="text-[10px] sm:text-xs text-white/40 font-body">
                Next Rank Progress
              </span>
              <div className="flex items-center gap-2 flex-1 max-w-[200px] ml-3">
                <div className="rank-progress-track flex-1">
                  <motion.div
                    className="rank-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNextRank}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
