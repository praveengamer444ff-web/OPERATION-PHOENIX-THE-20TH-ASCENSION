import type { QuestModule } from '../types';

export const QUEST_MODULES: QuestModule[] = [
  {
    id: 'physical',
    title: 'Physical Mastery',
    emoji: '🏋️',
    accent: '#F97316',
    quests: [
      {
        id: 'physical-workout',
        label: '5kg Dumbbell Workout + Pushups Sets (To Failure)',
        points: 15,
      },
      {
        id: 'physical-water',
        label: '3 - 4 Liters Water Intake',
        points: 10,
      },
    ],
  },
  {
    id: 'mental',
    title: 'Mental & Spiritual Reset',
    emoji: '🧠',
    accent: '#38BDF8',
    quests: [
      {
        id: 'mental-meditation',
        label: '10 Mins Meditation & Deep Breathing Reset',
        points: 10,
      },
      {
        id: 'mental-chill',
        label: 'Mindful Chill (Uplifting Music / Cinema - Zero Doom-Scrolling)',
        points: 10,
      },
      {
        id: 'mental-sunset',
        label: 'Digital Sunset (No Screens 30 mins before sleep)',
        points: 5,
      },
    ],
  },
  {
    id: 'skill',
    title: 'Skill & Goal Execution',
    emoji: '🎓',
    accent: '#EAB308',
    quests: [
      {
        id: 'skill-prep',
        label: 'Commerce / Academic Prep / Skill Mastery (45 mins)',
        points: 15,
      },
      {
        id: 'skill-creative',
        label: 'Creative Art & Content Strategy (30 mins)',
        points: 10,
      },
    ],
  },
  {
    id: 'discipline',
    title: 'Discipline & Character Protocol',
    emoji: '🌙',
    accent: '#A855F7',
    quests: [
      {
        id: 'discipline-sleep',
        label: 'Rest & Recovery Protocol (7–8 Hours Sleep)',
        points: 15,
      },
      {
        id: 'discipline-urge',
        label: 'Absolute Urge Control & Zero Relapse',
        points: 10,
      },
    ],
  },
];

export const ALL_QUEST_IDS = QUEST_MODULES.flatMap((m) =>
  m.quests.map((q) => q.id)
);

export function getQuestById(id: string) {
  for (const mod of QUEST_MODULES) {
    const quest = mod.quests.find((q) => q.id === id);
    if (quest) return { module: mod, quest };
  }
  return null;
}

export function getModuleScore(
  moduleId: string,
  questStates: Record<string, boolean>
): number {
  const mod = QUEST_MODULES.find((m) => m.id === moduleId);
  if (!mod) return 0;
  return mod.quests.reduce(
    (sum, q) => sum + (questStates[q.id] ? q.points : 0),
    0
  );
}

export function getModuleMaxScore(moduleId: string): number {
  const mod = QUEST_MODULES.find((m) => m.id === moduleId);
  if (!mod) return 0;
  return mod.quests.reduce((sum, q) => sum + q.points, 0);
}

export function calculateTotalScore(questStates: Record<string, boolean>): number {
  return QUEST_MODULES.reduce(
    (total, mod) =>
      total +
      mod.quests.reduce(
        (sum, q) => sum + (questStates[q.id] ? q.points : 0),
        0
      ),
    0
  );
}

export function getCompletedQuestCount(
  moduleId: string,
  questStates: Record<string, boolean>
): { completed: number; total: number } {
  const mod = QUEST_MODULES.find((m) => m.id === moduleId);
  if (!mod) return { completed: 0, total: 0 };
  const completed = mod.quests.filter((q) => questStates[q.id]).length;
  return { completed, total: mod.quests.length };
}
