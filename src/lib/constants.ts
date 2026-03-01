export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
};

export const IMPACT_FORMULAS = {
  TREES_PLANTED: (count: number) => count,
  PLASTIC_REDUCED_KG: (days: number) => days * 0.05, // 50g per day estimated
  WATER_SAVED_LITERS: (actions: number) => actions * 10,
  CO2_SAVED_KG: (plasticReducedKg: number, treesPlanted: number) => 
    (plasticReducedKg * 6) + (treesPlanted * 22), // 6kg CO2 per kg plastic, 22kg per tree/year
};

export const GAMIFICATION = {
  XP_PER_TASK: 50,
  XP_PER_QUIZ_CORRECT: 10,
  XP_PER_MODULE: 100,
  LEVEL_MULTIPLIER: 200, // XP needed = level * multiplier
  calcLevel: (totalXp: number) => Math.floor(totalXp / 200) + 1,
};

export const MOCK_USER = {
  id: 'u1',
  name: 'Alex Green',
  role: 'student',
  xp: 450,
  level: 3,
  streak: 5,
  badges: ['Early Bird', 'Tree Planter', 'Waste Warrior'],
  stats: {
    treesPlanted: 2,
    plasticReducedKg: 4.5,
    waterSavedLiters: 120,
    co2SavedKg: 71,
  }
};