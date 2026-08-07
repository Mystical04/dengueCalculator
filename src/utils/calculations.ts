// Formula per CPG Management of Dengue Infection in Adults

import { OBESITY_BMI_THRESHOLD } from "@/constants/clinical";
import { BodyWeightBasis, FluidRateOption, Gender } from "@/types/dengue";

export function roundTo2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function calculateIBW(gender: Gender, heightCm: number): number {
  const base = gender === "male" ? 50.0 : 45.5;
  return base + 0.91 * (heightCm - 152);
}

export function calculateABW(actualWeightKg: number, ibwKg: number): number {
  return ibwKg + 0.4 * (actualWeightKg - ibwKg);
}

export function getFluidBodyWeight(
  bmi: number,
  actualWeightKg: number,
  abwKg: number,
): { weightKg: number; basis: BodyWeightBasis } {
  if (bmi >= OBESITY_BMI_THRESHOLD) {
    return { weightKg: abwKg, basis: "abw" };
  }
  return { weightKg: actualWeightKg, basis: "actual" };
}

export function calculateFluidVolume(
  weightKg: number,
  rate: FluidRateOption,
): number {
  return weightKg * rate.ccPerKg;
}
