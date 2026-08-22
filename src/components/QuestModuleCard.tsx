import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { QuestModule } from '../types';
import { getModuleScore, getModuleMaxScore } from '../data/quests';

interface QuestModuleCardProps {
  module: QuestModule;
  questStates: Record<string, boolean>;
  onToggle: (questId: string) => void;
  disabled: boolean;
  index: number;
}

export function QuestModuleCard({
  module,
  questStates,
  onToggle,
  disabled,
  index,
}: QuestModuleCardProps) {
  const earned = getModuleScore(module.id, questStates);
  const max = getModuleMaxScore(module.id);
  const percent = max > 0 ? (earned / max) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-panel module-border p-4 sm:p-5"
      style={{ '--module-accent': module.accent } as React.CSSProperties}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl">{module.emoji}</span>
          <div>
            <h3 className="font-display text-sm sm:text-base font-semibold text-white">
              {module.title}
            </h3>
            <p className="text-xs text-white/50 font-body">{max} PTS Total</p>
          </div>
        </div>
        <div className="module-score-badge">
          <span className="font-display font-bold text-sm" style={{ color: module.accent }}>
            {earned}/{max}
          </span>
        </div>
      </div>

      <div className="module-progress-track mb-4">
        <motion.div
          className="module-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6 }}
          style={{ background: `linear-gradient(90deg, ${module.accent}88, ${module.accent})` }}
        />
      </div>

      <ul className="space-y-3">
        {module.quests.map((quest) => {
          const checked = questStates[quest.id] ?? false;
          return (
            <li key={quest.id}>
              <button
                onClick={() => onToggle(quest.id)}
                disabled={disabled}
                className={`quest-item w-full text-left ${checked ? 'quest-item-checked' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ '--quest-accent': module.accent } as React.CSSProperties}
              >
                <div className={`quest-checkbox ${checked ? 'quest-checkbox-checked' : ''}`}>
                  {checked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-body leading-snug ${checked ? 'text-white/90 line-through decoration-white/30' : 'text-white/80'}`}>
                    {quest.label}
                  </p>
                </div>
                <span className="quest-points font-display text-xs font-bold shrink-0" style={{ color: module.accent }}>
                  {quest.points} PTS
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
