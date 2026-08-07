import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GenderSelector } from "@/components/gender-selector";
import { NumericField } from "@/components/numeric-field";
import { PrimaryButton } from "@/components/primary-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  HEIGHT_MAX_CM,
  HEIGHT_MIN_CM,
  WEIGHT_MAX_KG,
  WEIGHT_MIN_KG,
} from "@/constants/clinical";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { Gender } from "@/types/dengue";

function validateWeight(value: string): string | undefined {
  if (!value) return "Weight is required.";
  const num = Number(value);
  if (Number.isNaN(num)) return "Enter a valid number.";
  if (num < WEIGHT_MIN_KG || num > WEIGHT_MAX_KG) {
    return `Weight must be between ${WEIGHT_MIN_KG} and ${WEIGHT_MAX_KG} kg.`;
  }
  return undefined;
}

function validateHeight(value: string): string | undefined {
  if (!value) return "Height is required.";
  const num = Number(value);
  if (Number.isNaN(num)) return "Enter a valid number.";
  if (num < HEIGHT_MIN_CM || num > HEIGHT_MAX_CM) {
    return `Height must be between ${HEIGHT_MIN_CM} and ${HEIGHT_MAX_CM} cm.`;
  }
  return undefined;
}

export default function CalculatorScreen() {
  const [gender, setGender] = useState<Gender | null>(null);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [touched, setTouched] = useState(false);

  const weightError = touched ? validateWeight(weight) : undefined;
  const heightError = touched ? validateHeight(height) : undefined;
  const genderError = touched && !gender ? "Select a gender." : undefined;

  function handleCalculate() {
    setTouched(true);
    if (!gender || validateWeight(weight) || validateHeight(height)) return;
    router.push({ pathname: "/results", params: { gender, weight, height } });
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="subtitle">Patient Information</ThemedText>
          <ThemedView style={styles.section}>
            <ThemedText type="smallBold">Gender</ThemedText>
            <GenderSelector
              value={gender}
              onChange={setGender}
            ></GenderSelector>
            {genderError ? (
              <ThemedText type="small" themeColor="danger">
                {genderError}
              </ThemedText>
            ) : null}
          </ThemedView>

          <NumericField
            label="Weight"
            unit="kg"
            value={weight}
            onChangeText={setWeight}
            error={weightError}
            placeholder="e.g. 65"
          ></NumericField>

          <NumericField
            label="Height"
            unit="cm"
            value={height}
            onChangeText={setHeight}
            error={heightError}
            placeholder="e.g. 165"
          ></NumericField>

          <PrimaryButton
            label="Calculate"
            onPress={handleCalculate}
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
