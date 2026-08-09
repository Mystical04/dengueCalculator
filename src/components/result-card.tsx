import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

type ResultCardProps = {
  title: string;
  rows: { label: string; value: string }[];
};

export function ResultCard({ title, rows }: ResultCardProps) {
  return (
    <ThemedView type="card" style={styles.card}>
      <ThemedText
        type="smallBold"
        themeColor="textSecondary"
        style={styles.title}
      >
        {title.toUpperCase()}
      </ThemedText>
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <ThemedText type="default">{row.label}</ThemedText>
          <ThemedText type="smallBold">{row.value}</ThemedText>
        </View>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    marginBottom: Spacing.one,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
