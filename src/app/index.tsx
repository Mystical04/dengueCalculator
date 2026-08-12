import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/primary-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.hero}>
          <ThemedText type="title" style={styles.title}>
            Dengue Fluid{"\n"}Calculator
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Maintenance fluid requirement calculator for adult dengue patients.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.footer}>
          <PrimaryButton
            label="Start Calculation"
            onPress={() => router.push("/calculator")}
          ></PrimaryButton>
          <PrimaryButton
            label="View History"
            variant="secondary"
            onPress={() => router.push("/history")}
          />
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.disclaimer}
          >
            For adult dengue patient only. Not for pediatric use or general
            fluid therapy. Follow your supposedly Clinical Practice Guideline.
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", justifyContent: "center" },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.five,
    justifyContent: "space-between",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    width: "100%",
  },
  hero: { flex: 1, justifyContent: "center", gap: Spacing.three },
  title: { fontSize: 36, lineHeight: 42 },
  subtitle: { fontSize: 16, lineHeight: 24 },
  footer: { gap: Spacing.three, paddingBottom: Spacing.six },
  disclaimer: { textAlign: "center", lineHeight: 18 },
});
