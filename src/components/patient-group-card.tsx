import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { DeleteIconButton } from "@/components/delete-icon-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { PatientGroup } from "@/types/dengue";

type PatientGroupCardProps = {
  group: PatientGroup;
  onDeleteRecord: (id: string) => void;
};

const MAX_VISIBLE = 3;

export function PatientGroupCard({
  group,
  onDeleteRecord,
}: PatientGroupCardProps) {
  const theme = useTheme();
  const visibleRecords = group.records.slice(0, MAX_VISIBLE);
  const hasMore = group.records.length > MAX_VISIBLE;

  return (
    <ThemedView type="card" style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="smallBold">{group.name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          MRN: {group.mrn}
        </ThemedText>
      </View>

      {visibleRecords.map((record, index) => (
        <View key={record.id} style={styles.recordRow}>
          <Pressable
            style={styles.recordPressable}
            onPress={() =>
              router.push({
                pathname: "/history-detail",
                params: { id: record.id },
              })
            }
          >
            <View style={styles.recordLabelRow}>
              <ThemedText type="small">
                {record.fluidRateLabel} · {record.fluidResult.toFixed(2)} mL
                {record.fluidRateMode === "hourly" ? "/hour" : ""}
              </ThemedText>
              {index === 0 && (
                <View
                  style={[styles.badge, { backgroundColor: theme.primary }]}
                >
                  <ThemedText
                    type="small"
                    themeColor="primaryText"
                    style={styles.badgeText}
                  >
                    Latest
                  </ThemedText>
                </View>
              )}
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              {new Date(record.createdAt).toLocaleString()}
            </ThemedText>
          </Pressable>
          <View style={styles.deleteOverlay}>
            <DeleteIconButton onPress={() => onDeleteRecord(record.id)} />
          </View>
        </View>
      ))}

      {hasMore && (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/patient-history",
              params: { mrn: group.mrn },
            })
          }
        >
          <ThemedText type="linkPrimary">
            View all {group.records.length} records
          </ThemedText>
        </Pressable>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  header: { gap: 2 },
  recordRow: { position: "relative" },
  recordPressable: { gap: 2, paddingRight: Spacing.six },
  recordLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Spacing.five,
  },
  badgeText: { fontSize: 11 },
  deleteOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});
