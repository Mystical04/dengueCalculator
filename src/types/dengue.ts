export type Gender = "male" | "female";

export type FluidMode = "bolus" | "hourly";

export type FluidRateOption = {
  id: string;
  label: string;
  ccPerKg: number;
  mode: FluidMode;
  durationLabel: string;
};

export type BodyWeightBasis = "actual" | "abw";

export type BmiClassification = "underweight" | "normal" | "overweight";
