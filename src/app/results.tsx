import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BmiBadge } from "@/components/bmi-badge";
import { FluidRateSelector } from "@/components/fluid-rate-selector";
import { PrimaryButton } from "@/components/primary-button";
import { ResultCard } from "@/components/result-card";
import { ShockStatusSelector } from "@/components/shock-status-selector";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { FluidRateOption, Gender, ShockStatus } from "@/types/dengue";
import {
  calculateABW,
  calculateBMI,
  calculateFluidVolume,
  calculateIBW,
  classifyBmi,
  getAvailableFluidRates,
  getFluidBodyWeight,
  roundTo2,
} from "@/utils/calculations";
import { saveHistoryRecord } from "@/utils/history-db";

export default function ResultsScreen() {
  const params = useLocalSearchParams<{
    gender: Gender;
    weight: string;
    height: string;
    name: string;
    mrn: string;
  }>();
  const [shockStatus, setShockStatus] = useState<ShockStatus | null>(null);
  const [selectedRate, setSelectedRate] = useState<FluidRateOption | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const calculation = useMemo(() => {
    const weight = Number(params.weight);
    const height = Number(params.height);
    const gender = params.gender;

    const bmi = calculateBMI(weight, height);
    const ibw = calculateIBW(gender, height);
    const abw = calculateABW(weight, ibw);
    const classification = classifyBmi(bmi);
    const { weightKg, basis } = getFluidBodyWeight(classification, weight, abw);

    return { weight, height, bmi, ibw, abw, classification, weightKg, basis };
  }, [params.weight, params.height, params.gender]);

  const avalaibleRates = useMemo(
    () => (shockStatus ? getAvailableFluidRates(shockStatus) : []),
    [shockStatus],
  );

  const fluidResult = selectedRate
    ? calculateFluidVolume(calculation.weightKg, selectedRate)
    : null;

  function handleShockStatusChange(status: ShockStatus) {
    setShockStatus(status);
    setSelectedRate(null);
    setSaved(false);
  }

  function handleSelectRate(rate: FluidRateOption) {
    setSelectedRate(rate);
    setSaved(false);
  }

  function handleReset() {
    router.dismissAll();
    router.push("/calculator");
  }

  async function handleSaveToHistory() {
    if (!selectedRate || fluidResult === null || !shockStatus) return;
    setSaving(true);
    await saveHistoryRecord({
      name: params.name,
      mrn: params.mrn,
      gender: params.gender,
      weight: calculation.weight,
      height: calculation.height,
      bmi: calculation.bmi,
      ibw: calculation.ibw,
      abw: calculation.abw,
      classification: calculation.classification,
      basis: calculation.basis,
      weightKg: calculation.weightKg,
      shockStatus,
      fluidRateId: selectedRate.id,
      fluidRateLabel: selectedRate.label,
      fluidRateMode: selectedRate.mode,
      fluidResult,
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="subtitle">Results</ThemedText>

          <ResultCard
            title="Patient Details"
            rows={[
              {
                label: "Weight",
                value: `${roundTo2(calculation.weight).toFixed(2)} kg`,
              },
              {
                label: "Height",
                value: `${roundTo2(calculation.height).toFixed(2)} cm`,
              },
            ]}
          ></ResultCard>

          <ThemedView type="card" style={styles.card}>
            <ThemedText
              type="smallBold"
              themeColor="textSecondary"
              style={styles.cardTitle}
            >
              BODY MEASUREMENTS
            </ThemedText>

            <View style={styles.row}>
              <ThemedText type="default">BMI</ThemedText>
              <View style={styles.bmiValue}>
                <ThemedText type="smallBold">
                  {roundTo2(calculation.bmi).toFixed(2)} kg/m²
                </ThemedText>
                <BmiBadge classification={calculation.classification} />
              </View>
            </View>

            <View style={styles.row}>
              <ThemedText type="default">Ideal Body Weight (IBW)</ThemedText>
              <ThemedText type="smallBold">
                {roundTo2(calculation.ibw).toFixed(2)} kg
              </ThemedText>
            </View>

            <View style={styles.row}>
              <ThemedText type="default">Adjusted Body Weight (ABW)</ThemedText>
              <ThemedText type="smallBold">
                {roundTo2(calculation.abw).toFixed(2)} kg
              </ThemedText>
            </View>
          </ThemedView>

          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.centerText}
          >
            {calculation.basis === "abw"
              ? "BMI is above the specified threshold; hence, ABW is used for fluid calculation."
              : "BMI is within the specified range; hence, Actual Body Weight is used for fluid calculation."}
          </ThemedText>

          <ThemedView type="card" style={styles.card}>
            <ThemedText
              type="smallBold"
              themeColor="textSecondary"
              style={styles.cardTitle}
            >
              RESULT
            </ThemedText>
            <ThemedText type="smallBold" style={styles.resultValue}>
              {`${calculation.basis === "abw" ? "ABW" : "Actual Weight"}, ${roundTo2(calculation.weightKg).toFixed(2)}kg`}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="smallBold">Shock Status</ThemedText>
            <ShockStatusSelector
              value={shockStatus}
              onChange={handleShockStatusChange}
            ></ShockStatusSelector>
          </ThemedView>

          {shockStatus && (
            <ThemedView style={styles.section}>
              <ThemedText type="smallBold">Select Fluid Rate</ThemedText>
              <FluidRateSelector
                rates={avalaibleRates}
                selectedId={selectedRate?.id ?? null}
                onSelect={handleSelectRate}
              ></FluidRateSelector>
            </ThemedView>
          )}

          {selectedRate && fluidResult !== null && (
            <ResultCard
              title="Fluid Requirement"
              rows={[
                {
                  label: selectedRate.label,
                  value: `${roundTo2(fluidResult).toFixed(2)} mL${selectedRate.mode === "hourly" ? "/hour" : ""}`,
                },
                { label: "Duration", value: selectedRate.durationLabel },
              ]}
            />
          )}

          {selectedRate && fluidResult !== null && (
            <PrimaryButton
              label={saved ? "Saved to History" : saving ? "Saving…" : "Save to History"}
              onPress={handleSaveToHistory}
              disabled={saving || saved}
            />
          )}

          <PrimaryButton
            label="Reset"
            variant="secondary"
            onPress={handleReset}
          ></PrimaryButton>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", justifyContent: "center" },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    width: "100%",
  },
  scrollContent: { padding: Spacing.five, gap: Spacing.four },
  section: { gap: Spacing.two },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  cardTitle: { marginBottom: Spacing.one, letterSpacing: 0.5 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bmiValue: {
    alignItems: "flex-end",
    gap: Spacing.one,
  },
  centerText: { textAlign: "center" },
  resultValue: { textAlign: "center", fontSize: 20, lineHeight: 26 },
});
