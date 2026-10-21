import React, { useEffect, useState, type ReactNode } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View,
  type TextInputProps,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies } from '../tokens/fonts';
import { PillButton } from './PillButton';

export interface PromptModalProps {
  visible: boolean;
  title: string;
  message?: string;
  placeholder: string;
  initialValue?: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** Shown when the user submits an empty value. */
  emptyError?: string;
  /** Fallback message when `onSubmit` rejects with an error that has no message. */
  failedError?: string;
  inputProps?: Pick<TextInputProps, 'keyboardType' | 'autoCapitalize' | 'autoComplete' | 'textContentType' | 'maxLength'>;
  /** Extra controls rendered between the input and the buttons (e.g. a role picker). */
  children?: ReactNode;
  onCancel: () => void;
  /** Resolves when done; rejects with an Error whose message is shown inside the card. */
  onSubmit: (value: string) => Promise<void>;
  onHaptic?: () => void;
  testID?: string;
}

/** ChaosOps-styled single-input dialog (rename, invite by email, new zone …). */
export const PromptModal: React.FC<PromptModalProps> = ({
  visible, title, message, placeholder, initialValue = '', confirmLabel, cancelLabel = 'Abbrechen',
  emptyError = 'Bitte gib etwas ein.', failedError = 'Das hat nicht geklappt. Bitte versuch es erneut.',
  inputProps, children, onCancel, onSubmit, onHaptic, testID,
}) => {
  const { palette } = useTheme();
  const [value, setValue] = useState(initialValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start fresh every time the dialog opens.
  useEffect(() => {
    if (visible) {
      setValue(initialValue);
      setError(null);
    }
  }, [visible, initialValue]);

  const close = () => {
    if (busy) return;
    onCancel();
  };

  const submit = async () => {
    const trimmed = value.trim();
    if (!trimmed) return setError(emptyError);
    setError(null);
    setBusy(true);
    try {
      await onSubmit(trimmed);
    } catch (err) {
      setError((err as Error | undefined)?.message || failedError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={[styles.scrim, { backgroundColor: palette.overlayScrim }]} onPress={close}>
          <Pressable
            style={[styles.card, { backgroundColor: palette.surfaceElevated, borderColor: palette.border }]}
            onPress={() => {}}
            testID={testID}
          >
            <Text style={[styles.title, { color: palette.ink, fontFamily: fontFamilies.display }]}>{title}</Text>
            {message ? <Text style={{ color: palette.ink, fontSize: 13.5, lineHeight: 19, fontFamily: fontFamilies.body }}>{message}</Text> : null}
            <TextInput
              style={[styles.input, { borderColor: palette.inputBorder, backgroundColor: palette.inputBg, color: palette.ink }]}
              placeholder={placeholder}
              placeholderTextColor={palette.inkMuted}
              value={value}
              onChangeText={setValue}
              editable={!busy}
              autoFocus
              autoCorrect={false}
              onSubmitEditing={submit}
              returnKeyType="done"
              testID={testID ? `${testID}-input` : undefined}
              {...inputProps}
            />
            {children}
            {error ? <Text style={{ color: palette.danger, fontSize: 13 }} accessibilityRole="alert">{error}</Text> : null}
            {busy ? (
              <ActivityIndicator color={palette.ink} />
            ) : (
              <View style={styles.actions}>
                <PillButton onHaptic={onHaptic} label={cancelLabel} variant="outline" onPress={close} style={styles.flex} />
                <PillButton
                  onHaptic={onHaptic}
                  label={confirmLabel}
                  onPress={submit}
                  style={styles.flex}
                  testID={testID ? `${testID}-confirm` : undefined}
                />
              </View>
            )}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrim: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 380, borderWidth: 2, borderRadius: 14, padding: 18, gap: 12 },
  title: { fontSize: 19 },
  input: { borderWidth: 2, borderRadius: 9, paddingHorizontal: 14, height: 46, fontSize: 14 },
  actions: { flexDirection: 'row', gap: 10 },
});
