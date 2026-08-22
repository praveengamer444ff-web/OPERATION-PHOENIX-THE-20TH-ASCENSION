export const MOTIVATIONAL_QUOTES: string[] = [
  'Discipline is the bridge between goals and accomplishment. Cross it every single day.',
  'Your mind is a weapon. Sharpen it. Your body is armor. Forge it. Stop negotiating with weakness.',
  'Overthinking is the enemy of execution. Act now. Adjust later. Victory favors the relentless.',
  'Every urge you resist is a vote for the man you are becoming. Cast that vote without hesitation.',
  'Comfort is the silent killer of greatness. Embrace the grind. The Phoenix rises from fire, not comfort.',
  'You do not rise to the level of your goals. You fall to the level of your systems. Build them ruthlessly.',
  'The version of you that completes this mission already exists. Walk toward him with every action today.',
  'Pain is temporary. Regret is permanent. Choose the temporary fire and become unbreakable.',
  'Silence the noise. Kill the excuses. Execute the protocol. That is how Commanders operate.',
  'Self-control is not restriction — it is liberation. Master yourself and you master everything.',
  'While others scroll, you ascend. While others sleep in comfort, you rebuild. That is your edge.',
  'Doubt is a liar wearing the mask of logic. Starve it with action. Feed your destiny with discipline.',
  'The 20th Ascension is not a wish. It is a war. Win today\'s battle before tomorrow demands more.',
  'Your future self is watching you through the eyes of history. Do not disappoint the Commander you are becoming.',
  'Momentum is built one checkbox at a time. Check them all. Leave no room for mediocrity.',
  'The grind never lies. Your reflection will show the truth of your effort. Make it undeniable.',
  'Focus is a superpower in a distracted world. Lock in. Destroy every distraction without mercy.',
  'Relapse is not an option. Recovery is not optional. You are rebuilding an empire — act like it.',
  'Fear fades when you move. Paralysis dies when you decide. Move. Decide. Ascend.',
  'Champions are not born in comfort zones. They are forged in the fire of daily non-negotiables.',
  'Your streak is your reputation with yourself. Protect it like your life depends on it — because it does.',
  'Water. Work. Wisdom. Sleep. Control. These are not tasks — they are the code of the Phoenix.',
  'The calendar does not care about your feelings. Day by day, execute or fall behind forever.',
  'Every morning is a redeployment. Every night is a debrief. Win both or lose the war.',
  'You are not tired. You are untrained in resilience. Train harder. Become the Apex Commander.',
  'Comparison is poison. Your only competition is yesterday\'s version of you. Destroy him.',
  'Small daily victories compound into legendary transformation. Stack them without mercy.',
  'The mind quits a thousand times before the body does. Command your mind. Lead from the front.',
  'Digital sunset is not weakness — it is strategic recovery. Rest like a warrior, fight like a titan.',
  'This is Day One energy every single day. Never coast. Never settle. The Ascension demands everything.',
];

export function getQuoteForDay(dayNumber: number): string {
  const index = (dayNumber - 1) % MOTIVATIONAL_QUOTES.length;
  return MOTIVATIONAL_QUOTES[index];
}
