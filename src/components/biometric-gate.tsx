import * as LocalAuthentication from "expo-local-authentication";
import { ReactNode, useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { PrimaryButton } from "@/components/primary-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

type BiometricGateProps = {
  children: ReactNode;
};

export function BiometricGate({ children }: BiometricGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  async function authenticate() {
    setChecking(true);
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      setUnlocked(true);
      setChecking(true);
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Unlock patient history",
    });
    setUnlocked(result.success);
    setChecking(false);
  }

  useEffect(() => {
    authenticate();
  }, []);

  if (checking) {
    return (
      <ThemedText style={styles.center}>
        <ThemedText type="small" themeColor="textSecondary">
          Checking device security...
        </ThemedText>
      </ThemedText>
    );
  }

  if (!unlocked) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="smallBold">Authentication required</ThemedText>
        <PrimaryButton label="Try Again" onPress={authenticate}></PrimaryButton>
      </ThemedView>
    );
  }
  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
    padding: Spacing.five,
  },
});
