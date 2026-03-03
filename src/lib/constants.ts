
export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
};

export const CARBON_COEFFICIENTS = {
  TRAVEL: {
    CAR: 0.21,   // kg/km
    BUS: 0.08,   // kg/km
    BIKE: 0.00,  // Zero emission
    EV: 0.05,    // kg/km
  },
  ELECTRICITY: 0.82, // kg CO2 per kWh (India average)
  FOOD: {
    VEG: 1.5,      // kg/day
    MIXED: 2.5,    // kg/day
    NON_VEG: 4.0,  // kg/day
  }
};

export const GAMIFICATION = {
  XP_PER_MISSION: 100,
  LEVELS: [
    { level: 1, minXP: 0 },
    { level: 2, minXP: 100 },
    { level: 3, minXP: 300 },
    { level: 4, minXP: 700 },
    { level: 5, minXP: 1500 },
  ],
  calcLevel: (xp: number) => {
    if (xp < 100) return 1;
    if (xp < 300) return 2;
    if (xp < 700) return 3;
    if (xp < 1500) return 4;
    return 5;
  }
};

export const MOCK_USER = {
  id: 'u1',
  name: 'Alex Green',
  role: 'student',
  schoolId: 's1',
  xp: 450,
  level: 3,
  streak: 5,
  badges: ['Early Bird', 'Tree Planter', 'Waste Warrior'],
  stats: {
    treesPlanted: 2,
    plasticReducedKg: 4.5,
    waterSavedLiters: 120,
    co2SavedKg: 71,
    monthlyCO2: 145.2
  }
};
