import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Quote, Volume2 } from 'lucide-react';
import { getQuoteForDay } from '../data/quotes';

interface DailyQuoteProps {
  dayNumber: number;
  commanderName: string;
}

export function DailyQuote({ dayNumber, commanderName }: DailyQuoteProps) {
  const quote = getQuoteForDay(dayNumber);
  const hasSpokenGreeting = useRef(false);

  const speakGreeting = () => {
    if (!('speechSynthesis' in window)) return;

    const name = commanderName.replace(/^COMMANDER\s+/i, '').trim() || 'Commander';
    const greeting = new SpeechSynthesisUtterance(
      `Welcome back, ${name}! Ready for today's challenge? Today's protocol: ${quote}`
    );
    greeting.rate = 0.92;
    greeting.pitch = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(greeting);
  };

  useEffect(() => {
    if (hasSpokenGreeting.current || !('speechSynthesis' in window)) return;

    hasSpokenGreeting.current = true;
    speakGreeting();
  }, [commanderName, dayNumber, quote]);

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-panel quote-panel p-5 sm:p-6 mb-6"
    >
      <div className="flex items-start gap-3">
        <div className="quote-icon-wrap shrink-0">
          <Quote className="w-5 h-5 text-fire-orange" />
        </div>
        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <p className="text-xs text-fire-orange/70 uppercase tracking-[0.2em] font-body">
              Daily Motivational Protocol
            </p>
            <button
              type="button"
              onClick={speakGreeting}
              className="sound-toggle"
              aria-label="Play daily greeting"
              title="Play daily greeting"
            >
              <Volume2 className="w-4 h-4 text-electric-blue" />
            </button>
          </div>
          <blockquote className="font-display text-sm sm:text-base md:text-lg font-medium text-white/90 leading-relaxed italic">
            "{quote}"
          </blockquote>
        </div>
      </div>
    </motion.section>
  );
}
