// Formula per CPG Management of Dengue Infection in Adults

import {
  BMI_OVERWEIGHT_MIN,
  BMI_UNDERWEIGHT_MAX,
} from "@/constants/clinical";
import {
  BmiClassification,
  BodyWeightBasis,
  FluidRateOption,
  Gender,
} from "@/types/dengue";

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

export function classifyBmi(bmi: number): BmiClassification {
  if (bmi < BMI_UNDERWEIGHT_MAX) return "underweight";
  if (bmi >= BMI_OVERWEIGHT_MIN) return "overweight";
  return "normal";
}

export function getFluidBodyWeight(
  classification: BmiClassification,
  actualWeightKg: number,
  abwKg: number,
): { weightKg: number; basis: BodyWeightBasis } {
  if (classification === "overweight") {
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
