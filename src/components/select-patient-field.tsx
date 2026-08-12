import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type SelectPatientFieldProps = {
  disabled: boolean;
  onPress: () => void;
};

export function SelectPatientField({ disabled, onPress }: SelectPatientFieldProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">Existing Patient</ThemedText>
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        style={[
          styles.field,
          { backgroundColor: theme.card, borderColor: theme.border, opacity: disabled ? 0.5 : 1 },
        ]}
      >
        <ThemedText type="default" themeColor="textSecondary">
          {disabled ? "No saved patients yet" : "Tap to select a previous patient"}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.two },
  field: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
});
