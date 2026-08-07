import { FluidRateOption } from "@/types/dengue";

export const WEIGHT_MIN_KG = 20;
export const WEIGHT_MAX_KG = 300;
export const HEIGHT_MIN_CM = 100;
export const HEIGHT_MAX_CM = 250;

// Standard WHO BMI classification bands.
export const BMI_UNDERWEIGHT_MAX = 18.5; // BMI below this is Underweight
export const BMI_OVERWEIGHT_MIN = 25; // BMI at/above this is Overweight
// Between the two bounds is Normal.

export const OBESITY_BMI_THRESHOLD = 27.5; // BMI at/above this uses Adjusted Body Weight for fluid calc

export const FLUID_RATES: FluidRateOption[] = [
  { id: "bolus-20", label: "20 cc/kg", ccPerKg: 20, mode: "bolus", durationLabel: "within 15–30 minutes" },
  { id: "rate-10", label: "10 cc/kg/hour", ccPerKg: 10, mode: "hourly", durationLabel: "per hour" },
  { id: "rate-7", label: "7 cc/kg/hour", ccPerKg: 7, mode: "hourly", durationLabel: "per hour" },
  { id: "rate-5", label: "5 cc/kg/hour", ccPerKg: 5, mode: "hourly", durationLabel: "per hour" },
  { id: "rate-3", label: "3 cc/kg/hour", ccPerKg: 3, mode: "hourly", durationLabel: "per hour" },
  { id: "rate-2", label: "2 cc/kg/hour", ccPerKg: 2, mode: "hourly", durationLabel: "per hour" },
  { id: "rate-1.5", label: "1.5 cc/kg/hour", ccPerKg: 1.5, mode: "hourly", durationLabel: "per hour" },
  { id: "rate-1.2", label: "1.2 cc/kg/hour", ccPerKg: 1.2, mode: "hourly", durationLabel: "per hour" },
];
