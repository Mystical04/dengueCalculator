import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { HistoryListItem } from "@/components/history-list-item";
import { PrimaryButton } from "@/components/primary-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { HistoryRecord } from "@/types/dengue";
import { deleteHistoryRecord, getAllHistoryRecords } from "@/utils/history-db";

export default function PatientHistoryScreen() {
  const { mrn } = useLocalSearchParams<{ mrn: string }>();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const all = await getAllHistoryRecords();
    const matching = all.filter((record) => record.mrn === mrn);
    matching.sort((a, b) => a.createdAt - b.createdAt); // oldest → latest timeline
    setRecords(matching);
  }, [mrn]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const latestRecord = records[records.length - 1];

  async function confirmDelete() {
    if (!pendingDeleteId) return;
    await deleteHistoryRecord(pendingDeleteId);
    setPendingDeleteId(null);
    load();
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">
            {records[0]?.name ?? "Patient"} History
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            MRN: {mrn}
          </ThemedText>
        </ThemedView>

        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <HistoryListItem
              record={item}
              isLatest={index === records.length - 1}
              onPress={() =>
                router.push({
                  pathname: "/history-detail",
                  params: { id: item.id },
                })
              }
              onDelete={() => setPendingDeleteId(item.id)}
            />
          )}
        />

        {latestRecord && (
          <PrimaryButton
            label="Add New Fluid Regime"
            onPress={() =>
              router.push({
                pathname: "/new-regime",
                params: { baseId: latestRecord.id },
              })
            }
          />
        )}
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
  header: { gap: Spacing.two, paddingTop: Spacing.five },
  listContent: { gap: Spacing.three, paddingBottom: Spacing.five },
});
