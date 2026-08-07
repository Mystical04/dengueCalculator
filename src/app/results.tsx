import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BmiBadge } from "@/components/bmi-badge";
import { FluidRateSelector } from "@/components/fluid-rate-selector";
import { PrimaryButton } from "@/components/primary-button";
import { ResultCard } from "@/components/result-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { OBESITY_BMI_THRESHOLD } from "@/constants/clinical";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { FluidRateOption, Gender } from "@/types/dengue";
import {
  calculateABW,
  calculateBMI,
  calculateFluidVolume,
  calculateIBW,
  classifyBmi,
  getFluidBodyWeight,
  roundTo2,
} from "@/utils/calculations";

export default function ResultsScreen() {
  const params = useLocalSearchParams<{
    gender: Gender;
    weight: string;
    height: string;
  }>();
  const [selectedRate, setSelectedRate] = useState<FluidRateOption | null>(
    null,
  );

  const calculation = useMemo(() => {
    const weight = Number(params.weight);
    const height = Number(params.height);
    const gender = params.gender;

    const bmi = calculateBMI(weight, height);
    const ibw = calculateIBW(gender, height);
    const abw = calculateABW(weight, ibw);
    const classification = classifyBmi(bmi);
    const { weightKg, basis } = getFluidBodyWeight(bmi, weight, abw);

    return { weight, height, bmi, ibw, abw, classification, weightKg, basis };
  }, [params.weight, params.height, params.gender]);

  const fluidResult = selectedRate
    ? calculateFluidVolume(calculation.weightKg, selectedRate)
    : null;

  function handleReset() {
    setSelectedRate(null);
    router.replace("/");
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
                <BmiBadge
                  classification={calculation.classification}
                ></BmiBadge>
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
            {`This patient's BMI is ${
              calculation.basis === "abw" ? "≥" : "<"
            } ${OBESITY_BMI_THRESHOLD}, so ${
              calculation.basis === "abw" ? "Adjusted" : "Actual"
            } Body Weight is used for fluid calculation.`}
          </ThemedText>

          <ResultCard
            title="Fluid Calculation Weight"
            rows={[
              {
                label: `Fluid Calculation Weight: ${calculation.basis === "abw" ? "ABW" : "Actual"}`,
                value: `${roundTo2(calculation.weightKg).toFixed(2)} kg`,
              },
            ]}
          ></ResultCard>

          <ThemedView style={styles.section}>
            <ThemedText type="smallBold">Select Fluid Rate</ThemedText>
            <FluidRateSelector
              selectedId={selectedRate?.id ?? null}
              onSelect={setSelectedRate}
            />
          </ThemedView>

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
  bmiValue: { alignItems: "flex-end", gap: Spacing.one },
  centerText: { textAlign: "center" },
});
