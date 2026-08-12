import { useState } from "react";
import { Modal, StyleSheet } from "react-native";

import { PrimaryButton } from "@/components/primary-button";
import { TextField } from "@/components/text-field";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

type PatientIdentityModalProps = {
  visible: boolean;
  initialName?: string;
  initialMrn?: string;
  onCancel: () => void;
  onSubmit: (name: string, mrn: string) => void;
};

export function PatientIdentityModal({
  visible,
  initialName = "",
  initialMrn = "",
  onCancel,
  onSubmit,
}: PatientIdentityModalProps) {
  const [name, setName] = useState(initialName);
  const [mrn, setMrn] = useState(initialMrn);
  const [touched, setTouched] = useState(false);

  const nameError =
    touched && !name.trim() ? "Patient name is required." : undefined;
  const mrnError = touched && !mrn.trim() ? "MRN is required." : undefined;

  function handleSubmit() {
    setTouched(true);
    if (!name.trim() || !mrn.trim()) return;
    onSubmit(name.trim(), mrn.trim());
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <ThemedView style={styles.backdrop}>
        <ThemedView type="card" style={styles.card}>
          <ThemedText type="smallBold">Patient Details Required</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Enter the patient &apos;s name and MRN to save this record to
            history.
          </ThemedText>

          <TextField
            label="Patient Name"
            value={name}
            onChangeText={setName}
            error={nameError}
            placeholder="e.g. Ahmad bin Ali"
          />
          <TextField
            label="MRN"
            value={mrn}
            onChangeText={setMrn}
            error={mrnError}
            placeholder="e.g. A123456"
            autoCapitalize="characters"
          />
          <PrimaryButton label="Save" onPress={handleSubmit} />
          <PrimaryButton
            label="Cancel"
            variant="secondary"
            onPress={onCancel}
          />
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.five,
  },
  card: {
    width: "100%",
    borderRadius: Spacing.four,
    padding: Spacing.five,
    gap: Spacing.three,
  },
});
