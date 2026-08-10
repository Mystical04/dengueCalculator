import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { HistoryRecord } from "@/types/dengue";

type HistoryListItemProps = {
  record: HistoryRecord;
  onPress: () => void;
};

export function HistoryListItem({ record, onPress }: HistoryListItemProps) {
  const theme = useTheme();
  const date = new Date(record.createdAt);

  return (
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
      <View style={styles.row}>
        <ThemedText type="smallBold">{record.name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {date.toLocaleDateString()}
        </ThemedText>
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        MRN:{record.mrn}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {record.fluidRateLabel} · {record.fluidResult.toFixed(2)} mL{" "}
        {record.fluidRateMode === "hourly" ? "/hour" : ""}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
