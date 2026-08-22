import { motion } from 'framer-motion';
import { Lock, CheckCircle2, XCircle, Crown, Calendar } from 'lucide-react';
import type { DayRecord } from '../types';
import { formatDisplayDate } from '../utils/campaign';

interface CalendarMatrixProps {
  days: Record<number, DayRecord>;
  currentDay: number;
  selectedDay: number;
  onSelectDay: (day: number) => void;
  onGoToToday: () => void;
}

function DayCell({
  day,
  record,
  isSelected,
  isCurrent,
  onClick,
}: {
  day: number;
  record: DayRecord | undefined;
  isSelected: boolean;
  isCurrent: boolean;
  onClick: () => void;
}) {
  const status = record?.status ?? 'locked';
  const score = record?.totalScore ?? 0;
  const isLocked = status === 'locked';

  const statusClasses: Record<string, string> = {
    locked: 'day-cell-locked',
    active: 'day-cell-active',
    passed: 'day-cell-passed',
    failed: 'day-cell-failed',
    titan: 'day-cell-titan',
  };

  return (
    <motion.button
      whileHover={!isLocked ? { scale: 1.05 } : undefined}
      whileTap={!isLocked ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={isLocked}
      className={`day-cell ${statusClasses[status]} ${isSelected ? 'day-cell-selected' : ''} ${isCurrent ? 'day-cell-current' : ''}`}
      aria-label={`Day ${day}${isLocked ? ' (locked)' : `, score ${score}`}`}
    >
      <span className="day-number">{day}</span>
      {isLocked ? (
        <Lock className="w-3 h-3 opacity-40" />
      ) : status === 'titan' ? (
        <Crown className="w-3.5 h-3.5 text-radiant-gold" />
      ) : status === 'passed' ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      ) : status === 'failed' ? (
        <XCircle className="w-3.5 h-3.5 text-red-400" />
      ) : (
        <span className="day-score">{score}</span>
      )}
    </motion.button>
  );
}

export function CalendarMatrix({
  days,
  currentDay,
  selectedDay,
  onSelectDay,
  onGoToToday,
}: CalendarMatrixProps) {
  const selectedRecord = days[selectedDay];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel gradient-border p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-electric-blue" />
          <h2 className="font-display text-base sm:text-lg font-semibold text-white">
            30-Day Campaign Matrix
          </h2>
        </div>
        {selectedDay !== currentDay && currentDay > 0 && (
          <button onClick={onGoToToday} className="today-btn text-xs sm:text-sm">
            Return to Today
          </button>
        )}
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 sm:gap-2.5 mb-4">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
          <DayCell
            key={day}
            day={day}
            record={days[day]}
            isSelected={day === selectedDay}
            isCurrent={day === currentDay}
            onClick={() => onSelectDay(day)}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-3 text-[10px] sm:text-xs text-white/50 font-body mb-3">
        <span className="flex items-center gap-1"><span className="legend-dot legend-active" /> Active</span>
        <span className="flex items-center gap-1"><span className="legend-dot legend-passed" /> Passed (70+)</span>
        <span className="flex items-center gap-1"><span className="legend-dot legend-failed" /> Failed</span>
        <span className="flex items-center gap-1"><span className="legend-dot legend-titan" /> Titan (100)</span>
        <span className="flex items-center gap-1"><span className="legend-dot legend-locked" /> Locked</span>
      </div>

      {selectedRecord && (
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="selected-day-info"
        >
          <p className="text-sm font-body text-white/70">
            Viewing <span className="text-electric-blue font-semibold">Day {selectedDay}</span>
            {' — '}
            {formatDisplayDate(selectedRecord.date)}
            {' — '}
            <span className="font-display font-bold text-white">{selectedRecord.totalScore} PTS</span>
          </p>
        </motion.div>
      )}
    </motion.section>
  );
}
