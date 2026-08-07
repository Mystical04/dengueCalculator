import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    const { weightKg, basis } = getFluidBodyWeight(bmi, weight, abw);

    return { bmi, ibw, abw, weightKg, basis };
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
            title="Body Measurements"
            rows={[
              {
                label: "BMI",
                value: `${roundTo2(calculation.bmi).toFixed(2)} kg/m\u00b2`,
              },
              {
                label: "Ideal Body Weight",
                value: `${roundTo2(calculation.ibw).toFixed(2)} kg`,
              },
            ]}
          ></ResultCard>

          <ResultCard
            title="Fluid Calculation Weight"
            rows={[
              {
                label:
                  calculation.basis === "abw"
                    ? "Adjusted Body Weight (ABW)"
                    : "Actual Body Weight",
                value: `${roundTo2(calculation.weightKg).toFixed(2)} kg`,
              },
            ]}
          ></ResultCard>

          <ThemedText type="small" themeColor="textSecondary">
            {calculation.basis === "abw"
              ? `BMI is \u2265 ${OBESITY_BMI_THRESHOLD}, SO Adjusted Body Weight is used for fluid calculation.`
              : `BMI is < ${OBESITY_BMI_THRESHOLD}, so Actual Body Weight is used for fluid calculation.`}
          </ThemedText>

          <ThemedView style={styles.section}>
            <ThemedText type="smallBold">Select Fluid Rate</ThemedText>
            <FluidRateSelector
              selectedId={selectedRate?.id ?? null}
              onSelect={setSelectedRate}
            ></FluidRateSelector>
          </ThemedView>

          {selectedRate && fluidResult !== null && (
            <ResultCard
              title="Fluid Requirement"
              rows={[
                {
                  label: selectedRate.label,
                  value: `${roundTo2(fluidResult).toFixed(2)}mL${selectedRate.mode === "hourly" ? "/hour" : ""}`,
                },
                { label: "Duration", value: selectedRate.durationLabel },
              ]}
            ></ResultCard>
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
});
