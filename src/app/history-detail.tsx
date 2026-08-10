import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BmiBadge } from "@/components/bmi-badge";
import { PrimaryButton } from "@/components/primary-button";
import { ResultCard } from "@/components/result-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { HistoryRecord } from "@/types/dengue";
import { roundTo2 } from "@/utils/calculations";
import { deleteHistoryRecord, getHistoryRecordById } from "@/utils/history-db";

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [record, setRecord] = useState<HistoryRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setRecord(id ? await getHistoryRecordById(id) : null);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete() {
    if (!id) return;
    await deleteHistoryRecord(id);
    router.back();
  }

  if (loading || !record) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText type="small" themeColor="textSecondary">
            {loading ? "Loading…" : "Record not found."}
          </ThemedText>
          {!loading && (
            <PrimaryButton
              label="Back to History"
              variant="secondary"
              onPress={() => router.back()}
            />
          )}
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="subtitle">Record Detail</ThemedText>

          <ResultCard
            title="Patient"
            rows={[
              { label: "Name", value: record.name },
              { label: "MRN", value: record.mrn },
              {
                label: "Date",
                value: new Date(record.createdAt).toLocaleString(),
              },
            ]}
          />

          <ResultCard
            title="Patient Details"
            rows={[
              {
                label: "Weight",
                value: `${roundTo2(record.weight).toFixed(2)} kg`,
              },
              {
                label: "Height",
                value: `${roundTo2(record.height).toFixed(2)} cm`,
              },
            ]}
          />

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
                  {roundTo2(record.bmi).toFixed(2)} kg/m²
                </ThemedText>
                <BmiBadge classification={record.classification} />
              </View>
            </View>

            <View style={styles.row}>
              <ThemedText type="default">Ideal Body Weight (IBW)</ThemedText>
              <ThemedText type="smallBold">
                {roundTo2(record.ibw).toFixed(2)} kg
              </ThemedText>
            </View>

            <View style={styles.row}>
              <ThemedText type="default">Adjusted Body Weight (ABW)</ThemedText>
              <ThemedText type="smallBold">
                {roundTo2(record.abw).toFixed(2)} kg
              </ThemedText>
            </View>
          </ThemedView>

          <ResultCard
            title="Result"
            rows={[
              {
                label: `${record.basis === "abw" ? "ABW" : "Actual Weight"}, ${roundTo2(record.weightKg).toFixed(2)} kg`,
                value: record.fluidRateLabel,
              },
              {
                label: "Fluid Requirement",
                value: `${roundTo2(record.fluidResult).toFixed(2)} mL${record.fluidRateMode === "hourly" ? "/hour" : ""}`,
              },
              {
                label: "Shock Status",
                value: record.shockStatus === "yes" ? "Yes" : "No",
              },
            ]}
          />

          <PrimaryButton
            label="Back to History"
            variant="secondary"
            onPress={() => router.back()}
          />
          <PrimaryButton
            label="Delete Record"
            variant="secondary"
            onPress={handleDelete}
          />
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
});
