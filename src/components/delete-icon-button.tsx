import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type DeleteIconButtonProps = {
  onPress: () => void;
};

export function DeleteIconButton({ onPress }: DeleteIconButtonProps) {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress} hitSlop={10} style={styles.button}>
      <Ionicons name="trash-outline" size={20} color={theme.danger}></Ionicons>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: Spacing.two,
    marginLeft: Spacing.two,
  },
});
