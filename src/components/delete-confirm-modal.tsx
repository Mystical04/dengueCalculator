import { useState } from "react";
import { Modal, StyleSheet } from "react-native";

import { PrimaryButton } from "@/components/primary-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

type DeleteConfirmModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmModal({
  visible,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [step, setStep] = useState<1 | 2>(1);

  function handleClose() {
    setStep(1);
    onCancel();
  }

  function handleDelete() {
    setStep(1);
    onConfirm();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <ThemedView style={styles.backdrop}>
        <ThemedView type="card" style={styles.card}>
          {step === 1 ? (
            <>
              <ThemedText type="smallBold">Delete this record?</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Are you sure you want to delete this record?
              </ThemedText>
              <PrimaryButton label="Continue" onPress={() => setStep(2)} />
              <PrimaryButton
                label="Cancel"
                variant="secondary"
                onPress={handleClose}
              />
            </>
          ) : (
            <>
              <ThemedText type="smallBold" themeColor="danger">
                This action cannot be undone.
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Delete this record permanently?
              </ThemedText>
              <PrimaryButton label="Delete Record" onPress={handleDelete} />
              <PrimaryButton
                label="Cancel"
                variant="secondary"
                onPress={handleClose}
              />
            </>
          )}
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
