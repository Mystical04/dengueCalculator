import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FluidRateSelector } from "@/components/fluid-rate-selector";
import { PrimaryButton } from "@/components/primary-button";
import { ResultCard } from "@/components/result-card";
import { ShockStatusSelector } from "@/components/shock-status-selector";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { FluidRateOption, HistoryRecord, ShockStatus } from "@/types/dengue";
import {
    calculateFluidVolume,
    getAvailableFluidRates,
    roundTo2,
} from "@/utils/calculations";
import { getHistoryRecordById, saveHistoryRecord } from "@/utils/history-db";

export default function NewRegimeScreen() {
  const { baseId } = useLocalSearchParams<{ baseId: string }>();
  const [baseRecord, setBaseRecord] = useState<HistoryRecord | null>(null);
  const [shockStatus, setShockStatus] = useState<ShockStatus | null>(null);
  const [selectedRate, setSelectedRate] = useState<FluidRateOption | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (baseId) getHistoryRecordById(baseId).then(setBaseRecord);
  }, [baseId]);

  const availableRates = useMemo(
    () => (shockStatus ? getAvailableFluidRates(shockStatus) : []),
    [shockStatus],
  );

  const fluidResult =
    selectedRate && baseRecord
      ? calculateFluidVolume(baseRecord.weightKg, selectedRate)
      : null;

  async function handleSave() {
    if (!baseRecord || !selectedRate || fluidResult === null || !shockStatus)
      return;
    setSaving(true);
    await saveHistoryRecord({
      name: baseRecord.name,
      mrn: baseRecord.mrn,
      gender: baseRecord.gender,
      weight: baseRecord.weight,
      height: baseRecord.height,
      bmi: baseRecord.bmi,
      ibw: baseRecord.ibw,
      abw: baseRecord.abw,
      classification: baseRecord.classification,
      basis: baseRecord.basis,
      weightKg: baseRecord.weightKg,
      shockStatus,
      fluidRateId: selectedRate.id,
      fluidRateLabel: selectedRate.label,
      fluidRateMode: selectedRate.mode,
      fluidResult,
    });
    setSaving(false);
    router.back();
  }

  if (!baseRecord) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText type="small" themeColor="textSecondary">
            Loading…
          </ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="subtitle">New Fluid Regime</ThemedText>

          <ResultCard
            title="Patient"
            rows={[
              { label: "Name", value: baseRecord.name },
              { label: "MRN", value: baseRecord.mrn },
              {
                label: baseRecord.basis === "abw" ? "ABW" : "Actual Weight",
                value: `${roundTo2(baseRecord.weightKg).toFixed(2)} kg`,
              },
            ]}
          />

          <ThemedView style={styles.section}>
            <ThemedText type="smallBold">Shock Status</ThemedText>
            <ShockStatusSelector
              value={shockStatus}
              onChange={setShockStatus}
            />
          </ThemedView>

          {shockStatus && (
            <ThemedView style={styles.section}>
              <ThemedText type="smallBold">Select Fluid Rate</ThemedText>
              <FluidRateSelector
                rates={availableRates}
                selectedId={selectedRate?.id ?? null}
                onSelect={setSelectedRate}
              />
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
              label={saving ? "Saving…" : "Save New Regime"}
              onPress={handleSave}
              disabled={saving}
            />
          )}
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
