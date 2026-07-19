// Computes current study streak from a list of ISO date strings (one per progress entry).
// Streak increases for consecutive calendar days; a single missed day resets it to zero.
export const calculateStreak = (dates) => {
  if (!dates || dates.length === 0) return { streak: 0, lastDate: null };

  const uniqueDays = [...new Set(dates.map((d) => (d || '').slice(0, 10)))]
    .filter(Boolean)
    .sort()
    .reverse(); // newest first

  if (uniqueDays.length === 0) return { streak: 0, lastDate: null };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const mostRecent = new Date(uniqueDays[0]);
  mostRecent.setHours(0, 0, 0, 0);

  const gapFromToday = Math.round((today - mostRecent) / 86400000);

  // If the most recent study day is not today or yesterday, the streak is broken.
  if (gapFromToday > 1) {
    return { streak: 0, lastDate: uniqueDays[0] };
  }

  let streak = 1;
  for (let i = 0; i < uniqueDays.length - 1; i += 1) {
    const current = new Date(uniqueDays[i]);
    const next = new Date(uniqueDays[i + 1]);
    const gap = Math.round((current - next) / 86400000);
    if (gap === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return { streak, lastDate: uniqueDays[0] };
};
