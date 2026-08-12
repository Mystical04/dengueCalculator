import { Pressable, StyleSheet, View } from "react-native";

import { DeleteIconButton } from "@/components/delete-icon-button";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { HistoryRecord } from "@/types/dengue";

type HistoryListItemProps = {
  record: HistoryRecord;
  onPress: () => void;
  onDelete?: () => void;
  isLatest?: boolean;
};

export function HistoryListItem({
  record,
  onPress,
  onDelete,
  isLatest,
}: HistoryListItemProps) {
  const theme = useTheme();
  const date = new Date(record.createdAt);

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <ThemedText type="smallBold">{record.name}</ThemedText>
          <View style={styles.headerRight}>
            {isLatest && (
              <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                <ThemedText
                  type="small"
                  themeColor="primaryText"
                  style={styles.badgeText}
                >
                  Latest
                </ThemedText>
              </View>
            )}
            <ThemedText type="small" themeColor="textSecondary">
              {date.toLocaleString()}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          MRN: {record.mrn}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {record.fluidRateLabel} · {record.fluidResult.toFixed(2)} mL
          {record.fluidRateMode === "hourly" ? "/hour" : ""}
        </ThemedText>
      </Pressable>
      {onDelete && (
        <View style={styles.deleteOverlay}>
          <DeleteIconButton onPress={onDelete} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { position: "relative" },
  card: {
    borderWidth: 1,
    borderRadius: Spacing.four,
    padding: Spacing.four,
    paddingRight: Spacing.six,
    gap: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Spacing.five,
  },
  badgeText: { fontSize: 11 },
  deleteOverlay: {
    position: "absolute",
    top: Spacing.two,
    right: Spacing.two,
  },
});
