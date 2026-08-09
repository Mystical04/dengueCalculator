import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type NoticeBannerProps = {
  message: string;
};

export function NoticeBanner({ message }: NoticeBannerProps) {
  const theme = useTheme();

  return (
    <ThemedView
      style={[
        styles.banner,
        { backgroundColor: theme.warningBg, borderColor: theme.warning },
      ]}
    >
      <ThemedText
        type="small"
        style={{ color: theme.warning, textAlign: "center", lineHeight: 22 }}
      >
        {message}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
});
