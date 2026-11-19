import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';
import { fontFamilies } from '../tokens/fonts';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';
import { touchTarget } from '../tokens/layout';
import { estimateEntropyBits, strengthHints, strengthLevel } from '../utils/password';

export interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry' | 'style'> {
  /** Marks the field invalid (danger border). */
  invalid?: boolean;
  /** Shows a bar that grows as the password gets stronger, with a coaching line. */
  showStrength?: boolean;
  /** Style for the outer wrapper. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Password field with an eye toggle (lucide Eye / EyeOff) and an optional
 * strength bar. Pasting is never blocked. Pass `autoComplete` /
 * `textContentType` to override the defaults, which switch to "new password"
 * when `showStrength` is on.
 */
export const PasswordInput = React.forwardRef<TextInput, PasswordInputProps>(function PasswordInput(
  { invalid, showStrength = false, style, value, defaultValue, onChangeText, onFocus, onBlur, placeholder = 'Passwort', ...rest },
  ref,
) {
  const { palette } = useTheme();
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const [typed, setTyped] = useState(defaultValue ?? '');
  const password = value ?? typed;

  const level = strengthLevel(estimateEntropyBits(password));
  const borderColor = invalid ? palette.danger : focused ? palette.focusRing : palette.inputBorder;

  return (
    <View style={style}>
      <View style={[styles.field, { borderColor, backgroundColor: palette.inputBg }]}>
        <TextInput
          ref={ref}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={showStrength ? 'new-password' : 'current-password'}
          textContentType={showStrength ? 'newPassword' : 'password'}
          placeholder={placeholder}
          placeholderTextColor={palette.inkMuted}
          {...rest}
          value={value}
          defaultValue={defaultValue}
          secureTextEntry={!visible}
          onChangeText={(text) => {
            setTyped(text);
            onChangeText?.(text);
          }}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, { color: palette.ink, fontFamily: fontFamilies.body }]}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Passwort verbergen' : 'Passwort anzeigen'}
          accessibilityState={{ selected: visible }}
          onPress={() => setVisible((v) => !v)}
          style={styles.toggle}
        >
          {visible ? <EyeOff size={20} color={palette.inkMuted} /> : <Eye size={20} color={palette.inkMuted} />}
        </Pressable>
      </View>

      {showStrength ? (
        <View style={styles.strength}>
          <View style={[styles.meter, { borderColor: palette.inkMuted, backgroundColor: palette.chipInactiveBg }]}>
            <View
              style={{
                height: '100%',
                width: password ? `${((level + 1) / 5) * 100}%` : '0%',
                borderRadius: radii.full,
                backgroundColor: level >= 3 ? palette.green : palette.amber,
              }}
            />
          </View>
          <Text size="sm" muted style={styles.hint}>{password ? strengthHints[level] : ''}</Text>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  field: { flexDirection: 'row', alignItems: 'center', minHeight: touchTarget, borderWidth: 2, borderRadius: radii.lg, paddingStart: spacing.md },
  input: { flex: 1, fontSize: 16, paddingVertical: 0, minHeight: touchTarget - 4 },
  toggle: { width: touchTarget, height: touchTarget - 4, alignItems: 'center', justifyContent: 'center' },
  strength: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm },
  meter: { flex: 1, height: 12, borderWidth: 2, borderRadius: radii.full, overflow: 'hidden' },
  hint: { minWidth: 110 },
});
