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

export type PatientIdentity = {
  name: string;
  mrn: string;
};

export type HistoryRecord = PatientIdentity & {
  id: string;
  createdAt: number;
  gender: Gender;
  weight: number;
  height: number;
  bmi: number;
  ibw: number;
  abw: number;
  classification: BmiClassification;
  basis: BodyWeightBasis;
  weightKg: number;
  shockStatus: ShockStatus;
  fluidRateId: string;
  fluidRateLabel: string;
  fluidRateMode: FluidMode;
  fluidResult: number;
};
