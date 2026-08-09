export type Gender = "male" | "female";

export type FluidMode = "bolus" | "hourly";

export type FluidRateOption = {
  id: string;
  label: string;
  ccPerKg: number;
  mode: FluidMode;
  durationLabel: string;
  requiresShock?: boolean;
};

export type BodyWeightBasis = "abw" | "actual";

export type BmiClassification = "underweight" | "normal" | "overweight";

export type ShockStatus = "yes" | "no";
