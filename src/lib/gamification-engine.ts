
/**
 * @fileOverview System-level logic for XP, Levels, and Badges.
 */

export const LEVEL_THRESHOLDS = [
  { level: 1, minXP: 0 },
  { level: 2, minXP: 100 },
  { level: 3, minXP: 300 },
  { level: 4, minXP: 700 },
  { level: 5, minXP: 1500 },
];

export function getLevelFromXP(xp: number): number {
  const sortedLevels = [...LEVEL_THRESHOLDS].sort((a, b) => b.level - a.level);
  const found = sortedLevels.find(l => xp >= l.minXP);
  return found ? found.level : 1;
}

export function getXPProgress(xp: number) {
  const currentLevel = getLevelFromXP(xp);
  const nextLevelInfo = LEVEL_THRESHOLDS.find(l => l.level === currentLevel + 1);
  const currentLevelInfo = LEVEL_THRESHOLDS.find(l => l.level === currentLevel);

  if (!nextLevelInfo || !currentLevelInfo) return 100;

  const range = nextLevelInfo.minXP - currentLevelInfo.minXP;
  const progress = xp - currentLevelInfo.minXP;
  return Math.min(Math.floor((progress / range) * 100), 100);
}

export const BADGE_DEFINITIONS = [
  { id: 'first_step', title: 'First Step', description: 'Submitted your first eco-task.', icon: '🌱' },
  { id: 'carbon_clipper', title: 'Carbon Clipper', description: 'Reduced footprint below benchmark.', icon: '✂️' },
  { id: 'streak_master', title: 'Streak Master', description: 'Maintained a 7-day action streak.', icon: '🔥' },
  { id: 'top_school', title: 'School Hero', description: 'Contributed 1000+ points to your school.', icon: '🏫' }
];
