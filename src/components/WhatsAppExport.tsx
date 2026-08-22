import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import type { RankInfo } from '../types';
import type { DayRecord } from '../types';
import {
  QUEST_MODULES,
  getModuleScore,
  getCompletedQuestCount,
} from '../data/quests';
import { getQuoteForDay } from '../data/quotes';

interface WhatsAppExportProps {
  commanderName: string;
  dayNumber: number;
  streak: number;
  todayScore: number;
  rank: RankInfo;
  dayRecord: DayRecord;
}

function buildWhatsAppMessage({
  commanderName,
  dayNumber,
  streak,
  todayScore,
  rank,
  dayRecord,
}: WhatsAppExportProps): string {
  const questStates = dayRecord.questStates;

  const moduleLines = QUEST_MODULES.map((mod) => {
    const { completed, total } = getCompletedQuestCount(mod.id, questStates);
    const score = getModuleScore(mod.id, questStates);
    const max = mod.quests.reduce((s, q) => s + q.points, 0);
    const shortName =
      mod.id === 'physical'
        ? 'Physical'
        : mod.id === 'mental'
          ? 'Mental Reset'
          : mod.id === 'skill'
            ? 'Skill & Goals'
            : 'Discipline';
    return `• ${shortName}: ${completed}/${total} Tasks (${score}/${max} PTS)`;
  }).join('\n');

  const quote = getQuoteForDay(dayNumber);

  return [
    '🦅 *OPERATION PHOENIX: DAILY DISPATCH*',
    `👤 *Commander:* ${commanderName.replace('COMMANDER ', '')}`,
    `📅 *Day:* ${dayNumber} / 30`,
    `🔥 *Streak:* ${streak} Days`,
    `📊 *Today's Score:* ${todayScore} / 100 PTS`,
    `👑 *Rank:* ${rank.emoji} ${rank.title}`,
    '',
    '*Quest Checklist:*',
    moduleLines,
    '',
    `💬 *Daily Mindset:* "${quote}"`,
  ].join('\n');
}

export function WhatsAppExport(props: WhatsAppExportProps) {
  const handleSend = () => {
    const message = buildWhatsAppMessage(props);
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/94775259852?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative z-10 mt-8 mb-6"
    >
      <button onClick={handleSend} className="whatsapp-btn group">
        <span className="whatsapp-btn-glow" />
        <Send className="w-5 h-5 relative z-10 group-hover:translate-x-0.5 transition-transform" />
        <span className="relative z-10 font-display text-sm sm:text-base font-bold tracking-wide">
          SEND DAILY DISPATCH TO WHATSAPP
        </span>
      </button>
    </motion.div>
  );
}
