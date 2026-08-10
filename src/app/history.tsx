import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BiometricGate } from "@/components/biometric-gate";
import { HistoryListItem } from "@/components/history-list-item";
import { PrimaryButton } from "@/components/primary-button";
import { TextField } from "@/components/text-field";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { HistoryRecord } from "@/types/dengue";
import {
    getAllHistoryRecords,
    purgeExpiredHistoryRecords,
} from "@/utils/history-db";

export default function HistoryScreen() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

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
            ></TextField>
          </ThemedView>

          <FlatList
            data={filteredRecords}
            keyExtractor={(item) => item.id}
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
              <HistoryListItem
                record={item}
                onPress={() =>
                  router.push({
                    pathname: "/history-detail",
                    params: { id: item.id },
                  })
                }
              ></HistoryListItem>
            )}
          ></FlatList>
          <PrimaryButton
            label="Back"
            variant="secondary"
            onPress={() => router.back()}
          />
        </SafeAreaView>
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
