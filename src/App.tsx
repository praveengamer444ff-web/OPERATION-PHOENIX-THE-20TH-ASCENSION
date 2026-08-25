import { motion } from 'framer-motion';
import { Shield, Clock } from 'lucide-react';
import { ParticleBackground } from './components/ParticleBackground';
import { TopHUD } from './components/TopHUD';
import { QuestModuleCard } from './components/QuestModuleCard';
import { CalendarMatrix } from './components/CalendarMatrix';
import { DailyQuote } from './components/DailyQuote';
import { WhatsAppExport } from './components/WhatsAppExport';
import { QUEST_MODULES } from './data/quests';
import { usePhoenixState } from './hooks/usePhoenixState';
import { CAMPAIGN_START, formatDisplayDate, parseDate } from './utils/campaign';
import { useAuth } from './auth/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { ChallengeSetup } from './components/ChallengeSetup';

function App() {
  const { user, signOut } = useAuth();
  const {
    state,
    currentDay,
    selectedDayRecord,
    todayScore,
    rank,
    isViewingPast,
    isEditable,
    progressToNextRank,
    toggleQuest,
    selectDay,
    goToToday,
    toggleSound,
  } = usePhoenixState(user?.id ?? null, user?.startDate, user?.endDate);

  if (!user) {
    return (
      <>
        <ParticleBackground />
        <AuthScreen />
      </>
    );
  }

  if (!user.startDate || !user.endDate || !user.whatsappNumber) {
    return (
      <>
        <ParticleBackground />
        <ChallengeSetup />
      </>
    );
  }

  const daysUntilStart =
    currentDay === 0
      ? Math.ceil(
          (parseDate(CAMPAIGN_START).getTime() - new Date().setHours(0, 0, 0, 0)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const questStates = selectedDayRecord?.questStates ?? {};

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-fire-orange" />
            <span className="text-xs sm:text-sm font-body tracking-[0.3em] text-white/40 uppercase">
              Classified Mission Brief
            </span>
          </div>
          <h1 className="font-display text-xl sm:text-3xl md:text-4xl font-black tracking-wide title-glow">
            <span className="text-fire-orange">OPERATION PHOENIX</span>
            <span className="text-white/60">:</span>{' '}
            <span className="text-radiant-gold">THE 20TH ASCENSION</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/40 font-body mt-2 tracking-wider">
            {formatDisplayDate(state.campaignStartDate)} — {formatDisplayDate(state.campaignEndDate)} • 30-Day Campaign
          </p>
        </motion.div>

        {currentDay === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pre-campaign-banner"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-radiant-gold" />
              <span className="font-display font-bold text-radiant-gold">
                Campaign Launch In {daysUntilStart} Day{daysUntilStart !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-sm text-white/60 font-body">
              Prepare for deployment on {formatDisplayDate(CAMPAIGN_START)}. Review your protocols below.
            </p>
          </motion.div>
        )}

        <TopHUD
          commanderName={user.fullName}
          rank={rank}
          todayScore={todayScore}
          streak={state.streak}
          totalXP={state.totalXP}
          currentDay={currentDay}
          progressToNextRank={progressToNextRank}
          soundEnabled={state.soundEnabled}
          onToggleSound={toggleSound}
        />

        <div className="flex justify-center -mt-2 mb-6">
          <button type="button" onClick={signOut} className="text-xs text-white/40 hover:text-fire-orange font-body transition-colors">
            Sign out {user.email}
          </button>
        </div>

        <DailyQuote dayNumber={state.selectedDay} commanderName={user.fullName} />

        {isViewingPast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mb-4"
          >
            <span className="viewing-badge">
              📋 Reviewing Day {state.selectedDay} — Read Only
            </span>
          </motion.div>
        )}

        {!isEditable && currentDay > 0 && !isViewingPast && state.selectedDay === currentDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mb-4"
          >
            <span className="viewing-badge">
              ⚠️ Campaign Complete — Final Review Mode
            </span>
          </motion.div>
        )}

        <section className="mb-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-display text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2"
          >
            <span className="text-fire-orange">⚡</span> Daily Quest Grid
            {currentDay > 0 && (
              <span className="text-xs text-white/40 font-body font-normal ml-auto">
                Day {state.selectedDay}
              </span>
            )}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {QUEST_MODULES.map((mod, i) => (
              <QuestModuleCard
                key={mod.id}
                module={mod}
                questStates={questStates}
                onToggle={toggleQuest}
                disabled={!isEditable}
                index={i}
              />
            ))}
          </div>
        </section>

        <CalendarMatrix
          days={state.days}
          currentDay={currentDay}
          selectedDay={state.selectedDay}
          onSelectDay={selectDay}
          onGoToToday={goToToday}
        />

        {selectedDayRecord && (
          <WhatsAppExport
            commanderName={user.fullName}
            whatsappNumber={user.whatsappNumber}
            dayNumber={state.selectedDay}
            streak={state.streak}
            todayScore={todayScore}
            rank={rank}
            dayRecord={selectedDayRecord}
          />
        )}

        <footer className="text-center py-6 text-[10px] sm:text-xs text-white/25 font-body tracking-widest uppercase">
          Operation Phoenix • The 20th Ascension • No Retreat • No Surrender
        </footer>
      </div>
    </div>
  );
}

export default App;
