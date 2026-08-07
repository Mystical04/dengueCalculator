import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { BmiClassification } from "@/types/dengue";

const LABELS: Record<BmiClassification, string> = {
  underweight: "Underweight",
  normal: "Normal",
  overweight: "Overweight",
};

type BmiBadgeProps = {
  classification: BmiClassification;
};

export function BmiBadge({ classification }: BmiBadgeProps) {
  const theme = useTheme();

  const colors =
    classification === "underweight"
      ? { text: theme.bmiUnderweight, bg: theme.bmiUnderweightBg }
      : classification === "normal"
        ? { text: theme.bmiNormal, bg: theme.bmiNormalBg }
        : { text: theme.bmiOverweight, bg: theme.bmiOverweightBg };

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <ThemedText
        type="smallBold"
        style={[styles.label, { color: colors.text }]}
      >
        {LABELS[classification]}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.five,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: 12,
  },
});
