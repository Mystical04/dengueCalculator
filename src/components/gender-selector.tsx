import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Gender } from "@/types/dengue";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

type GenderSelectorProps = {
  value: Gender | null;
  onChange: (gender: Gender) => void;
};

const OPTIONS: { label: string; value: Gender }[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export function GenderSelector({ value, onChange }: GenderSelectorProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      {OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
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
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.three,
  },
  option: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: "center",
  },
});
