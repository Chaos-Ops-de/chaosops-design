import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies } from '../tokens/fonts';
import { PillButton } from './PillButton';

export interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** `danger` tints the title and confirm button for destructive actions. */
  tone?: 'default' | 'danger';
  onCancel: () => void;
  onConfirm: () => void;
  /** Called on button presses (e.g. `Haptics.selectionAsync`). */
  onHaptic?: () => void;
  testID?: string;
}

/** ChaosOps-styled replacement for the native two-button confirm alert. */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible, title, message, confirmLabel, cancelLabel = 'Abbrechen', tone = 'default', onCancel, onConfirm, onHaptic, testID,
}) => {
  const { palette } = useTheme();
  const danger = tone === 'danger';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        style={[styles.scrim, { backgroundColor: palette.overlayScrim }]}
        onPress={onCancel}
        accessibilityLabel={cancelLabel}
      >
        <Pressable
          style={[styles.card, { backgroundColor: palette.surfaceElevated, borderColor: palette.border }]}
          onPress={() => {}}
          accessibilityRole="alert"
          testID={testID}
        >
          <Text style={[styles.title, { color: danger ? palette.danger : palette.ink, fontFamily: fontFamilies.display }]}>{title}</Text>
          <Text style={{ color: palette.ink, fontSize: 13.5, lineHeight: 19, fontFamily: fontFamilies.body }}>{message}</Text>
          <View style={styles.actions}>
            <PillButton onHaptic={onHaptic} label={cancelLabel} variant="outline" onPress={onCancel} style={styles.flex} />
            <PillButton
              onHaptic={onHaptic}
              label={confirmLabel}
              variant={danger ? 'danger' : 'primary'}
              onPress={onConfirm}
              style={styles.flex}
              testID={testID ? `${testID}-confirm` : undefined}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrim: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 380, borderWidth: 2, borderRadius: 14, padding: 18, gap: 12 },
  title: { fontSize: 19 },
  actions: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
});
