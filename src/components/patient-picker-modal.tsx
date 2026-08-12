import { Modal, Pressable, ScrollView, StyleSheet } from "react-native";

import { PrimaryButton } from "@/components/primary-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { PatientSummary } from "@/types/dengue";

type PatientPickerModalProps = {
  visible: boolean;
  patients: PatientSummary[];
  onSelect: (patient: PatientSummary) => void;
  onCancel: () => void;
};

export function PatientPickerModal({
  visible,
  patients,
  onSelect,
  onCancel,
}: PatientPickerModalProps) {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <ThemedView style={styles.backdrop}>
        <ThemedView type="card" style={styles.card}>
          <ThemedText type="smallBold">Select Patient</ThemedText>
          <ScrollView style={styles.list}>
            {patients.map((patient) => (
              <Pressable
                key={patient.mrn}
                onPress={() => onSelect(patient)}
                style={({ pressed }) => [
                  styles.row,
                  { borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <ThemedText type="smallBold">{patient.name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  MRN: {patient.mrn}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
          <PrimaryButton label="Cancel" variant="secondary" onPress={onCancel} />
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
    maxHeight: "70%",
    borderRadius: Spacing.four,
    padding: Spacing.five,
    gap: Spacing.three,
  },
  list: { maxHeight: 320 },
  row: {
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    gap: 2,
  },
});
