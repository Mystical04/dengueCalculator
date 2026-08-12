import * as LocalAuthentication from "expo-local-authentication";

export type BiometricResult = "success" | "failed" | "no-lock-set-up";

export async function authenticateDevice(promptMessage: string): Promise<BiometricResult> {
  try {
    const securityLevel = await LocalAuthentication.getEnrolledLevelAsync();

    if (securityLevel === LocalAuthentication.SecurityLevel.NONE) {
      return "no-lock-set-up";
    }

    const result = await LocalAuthentication.authenticateAsync({ promptMessage });
    return result.success ? "success" : "failed";
  } catch {
    return "no-lock-set-up";
  }
}
