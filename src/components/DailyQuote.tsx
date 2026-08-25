import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { getQuoteForDay } from '../data/quotes';

interface DailyQuoteProps {
  dayNumber: number;
  commanderName: string;
}

export function DailyQuote({ dayNumber, commanderName }: DailyQuoteProps) {
  const quote = getQuoteForDay(dayNumber);
  const hasSpokenGreeting = useRef(false);

  useEffect(() => {
    if (hasSpokenGreeting.current || !('speechSynthesis' in window)) return;

    hasSpokenGreeting.current = true;
    const name = commanderName.replace(/^COMMANDER\s+/i, '').trim();
    const greeting = new SpeechSynthesisUtterance(
      `Welcome to day ${dayNumber}, ${name}. Your daily motivational protocol is ready.`
    );
    greeting.rate = 0.92;
    greeting.pitch = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(greeting);
  }, [commanderName, dayNumber]);

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
          <p className="text-xs text-fire-orange/70 uppercase tracking-[0.2em] font-body mb-2">
            Daily Motivational Protocol
          </p>
          <blockquote className="font-display text-sm sm:text-base md:text-lg font-medium text-white/90 leading-relaxed italic">
            "{quote}"
          </blockquote>
        </div>
      </div>
    </motion.section>
  );
}
