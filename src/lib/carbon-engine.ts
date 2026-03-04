
/**
 * @fileOverview Production-grade Carbon Calculation Engine.
 * Implements SIH-level precision coefficients.
 */

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
  },
  BENCHMARK: 150 // Average monthly kg CO2 for a student in India
};

export type CarbonInput = {
  carKM: number;
  busKM: number;
  electricityKWh: number;
  dietType: 'VEG' | 'MIXED' | 'NON_VEG';
};

export function calculateMonthlyCarbon(input: CarbonInput) {
  const travelCO2 = (input.carKM * CARBON_COEFFICIENTS.TRAVEL.CAR) + 
                   (input.busKM * CARBON_COEFFICIENTS.TRAVEL.BUS);
  
  const energyCO2 = input.electricityKWh * CARBON_COEFFICIENTS.ELECTRICITY;
  
  const foodCO2 = CARBON_COEFFICIENTS.FOOD[input.dietType] * 30; // Monthly estimate
  
  const total = travelCO2 + energyCO2 + foodCO2;

  return {
    total,
    breakdown: {
      travel: travelCO2,
      energy: energyCO2,
      food: foodCO2
    },
    comparison: total > CARBON_COEFFICIENTS.BENCHMARK ? 'Above Average' : 'Eco-Champion'
  };
}
