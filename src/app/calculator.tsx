import { GenderSelector } from "@/components/gender-selector";
import { NoticeBanner } from "@/components/notice-banner";
import { NumericField } from "@/components/numeric-field";
import { PatientPickerModal } from "@/components/patient-picker-modal";
import { PrimaryButton } from "@/components/primary-button";
import { SelectPatientField } from "@/components/select-patient-field";
import { TextField } from "@/components/text-field";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  HEIGHT_MAX_CM,
  HEIGHT_MIN_CM,
  WEIGHT_MAX_KG,
  WEIGHT_MIN_KG,
} from "@/constants/clinical";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Gender, PatientSummary } from "@/types/dengue";
import { authenticateDevice } from "@/utils/biometric";
import { getPatientList, hasHistoryRecords } from "@/utils/history-db";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const theme = useTheme();
  const [gender, setGender] = useState<Gender | null>(null);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [name, setName] = useState("");
  const [mrn, setMrn] = useState("");
  const [touched, setTouched] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [patients, setPatients] = useState<PatientSummary[]>([]);

  const weightError = touched ? validateWeight(weight) : undefined;
  const heightError = touched ? validateHeight(height) : undefined;
  const genderError = touched && !gender ? "Select a gender." : undefined;

  useFocusEffect(
    useCallback(() => {
      hasHistoryRecords().then(setHasHistory);
    }, []),
  );

  async function handleSelectPatientPress() {
    const result = await authenticateDevice("Unlock to select a patient");
    if (result === "failed") return;
    setPatients(await getPatientList());
    setPickerVisible(true);
  }

  function handlePatientSelected(patient: PatientSummary) {
    setName(patient.name);
    setMrn(patient.mrn);
    setGender(patient.gender);
    setWeight(String(patient.weight));
    setHeight(String(patient.height));
    setPickerVisible(false);
  }

  function handleCalculate() {
    setTouched(true);
    if (!gender || validateWeight(weight) || validateHeight(height)) return;
    router.push({
      pathname: "/results",
      params: { gender, weight, height, name, mrn },
    });
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerRow}>
            <ThemedText type="subtitle">Patient Information</ThemedText>
            <Pressable onPress={() => router.push("/history")} hitSlop={8}>
              <Ionicons name="time-outline" size={24} color={theme.primary} />
            </Pressable>
          </View>
          <NoticeBanner message="Please double-check the measurements before proceeding. Accurate height and weight are essential for a correct calculation."></NoticeBanner>

          <SelectPatientField disabled={!hasHistory} onPress={handleSelectPatientPress} />

          <TextField
            label="Patient Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Ahmad bin Ali"
          />
          <TextField
            label="MRN"
            value={mrn}
            onChangeText={setMrn}
            placeholder="e.g. A123456"
            autoCapitalize="characters"
          />

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

      <PatientPickerModal
        visible={pickerVisible}
        patients={patients}
        onSelect={handlePatientSelected}
        onCancel={() => setPickerVisible(false)}
      />
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  section: { gap: Spacing.two },
});
