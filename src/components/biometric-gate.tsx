import { ReactNode, useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { PrimaryButton } from "@/components/primary-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { authenticateDevice } from "@/utils/biometric";

type BiometricGateProps = {
  children: ReactNode;
};

type GateState = "checking" | "unlocked" | "locked" | "no-lock-set-up";

export function BiometricGate({ children }: BiometricGateProps) {
  const [state, setState] = useState<GateState>("checking");

  async function authenticate() {
    setState("checking");
    const result = await authenticateDevice("Unlock patient history");
    if (result === "success") setState("unlocked");
    else if (result === "failed") setState("locked");
    else setState("no-lock-set-up");
  }

  useEffect(() => {
    authenticate();
  }, []);

  if (state === "checking") {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="small" themeColor="textSecondary">
          Checking device security…
        </ThemedText>
      </ThemedView>
    );
  }

  if (state === "locked") {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="smallBold">Authentication required</ThemedText>
        <PrimaryButton label="Try Again" onPress={authenticate} />
      </ThemedView>
    );
  }

  if (state === "no-lock-set-up") {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="smallBold">No Screen Lock Detected</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.message}>
          This device has no fingerprint, face unlock, or passcode set up, so patient history
          can&apos;t be locked. Anyone with access to this phone can view saved records.
        </ThemedText>
        <PrimaryButton label="Continue" onPress={() => setState("unlocked")} />
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
  message: {
    textAlign: "center",
  },
});
