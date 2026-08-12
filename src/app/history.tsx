import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BiometricGate } from "@/components/biometric-gate";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { PatientGroupCard } from "@/components/patient-group-card";
import { PrimaryButton } from "@/components/primary-button";
import { TextField } from "@/components/text-field";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { HistoryRecord } from "@/types/dengue";
import {
  deleteHistoryRecord,
  getAllHistoryRecords,
  groupHistoryRecordsByPatient,
  purgeExpiredHistoryRecords,
} from "@/utils/history-db";

export default function HistoryScreen() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    await purgeExpiredHistoryRecords();
    setRecords(await getAllHistoryRecords());
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [loadRecords]),
  );

  const filteredRecords = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (record) =>
        record.name.toLowerCase().includes(q) ||
        record.mrn.toLowerCase().includes(q),
    );
  }, [records, query]);

  const groups = useMemo(
    () => groupHistoryRecordsByPatient(filteredRecords),
    [filteredRecords],
  );

  async function confirmDelete() {
    if (!pendingDeleteId) return;
    await deleteHistoryRecord(pendingDeleteId);
    setPendingDeleteId(null);
    loadRecords();
  }

  return (
    <BiometricGate>
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedView style={styles.header}>
            <ThemedText type="subtitle">History</ThemedText>
            <TextField
              label="Search"
              value={query}
              onChangeText={setQuery}
              placeholder="Search by name or MRN"
              autoCapitalize="none"
            />
          </ThemedView>

          <FlatList
            data={groups}
            keyExtractor={(item) => item.mrn}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              !loading ? (
                <ThemedText
                  type="small"
                  themeColor="textSecondary"
                  style={styles.empty}
                >
                  No saved records yet.
                </ThemedText>
              ) : null
            }
            renderItem={({ item }) => (
              <PatientGroupCard
                group={item}
                onDeleteRecord={setPendingDeleteId}
              />
            )}
          />

          <PrimaryButton
            label="Back"
            variant="secondary"
            onPress={() => router.back()}
          />
        </SafeAreaView>

        <DeleteConfirmModal
          visible={pendingDeleteId !== null}
          onCancel={() => setPendingDeleteId(null)}
          onConfirm={confirmDelete}
        />
      </ThemedView>
    </BiometricGate>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", justifyContent: "center" },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: Spacing.five,
    gap: Spacing.four,
  },
  header: { gap: Spacing.three, paddingTop: Spacing.five },
  listContent: { gap: Spacing.three, paddingBottom: Spacing.five },
  empty: { textAlign: "center", paddingVertical: Spacing.six },
});
