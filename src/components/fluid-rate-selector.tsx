import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { FLUID_RATES } from "@/constants/clinical";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { FluidRateOption } from "@/types/dengue";

type FluidRateSelectorProps = {
  selectedId: string | null;
  onSelect: (rate: FluidRateOption) => void;
};

export function FluidRateSelector({
  selectedId,
  onSelect,
}: FluidRateSelectorProps) {
  const theme = useTheme();

  return (
    <View style={styles.grid}>
      {FLUID_RATES.map((rate) => {
        const selected = rate.id === selectedId;
        return (
          <Pressable
            key={rate.id}
            onPress={() => onSelect(rate)}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? theme.primary : theme.card,
                borderColor: selected ? theme.primary : theme.border,
              },
            ]}
          >
            <ThemedText
              type="smallBold"
              themeColor={selected ? "primaryText" : "text"}
            >
              {rate.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  chip: {
    borderWidth: 1,
    borderRadius: Spacing.five,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
});
