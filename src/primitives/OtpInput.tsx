import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Platform, StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';
import { timings } from '../tokens/motion';
import { isOtpComplete, otpSlots, sanitizeOtp, type OtpCharset } from '../utils/otp';

export type OtpStatus = 'idle' | 'error' | 'success';

export interface OtpInputProps {
  /** Number of slots (default 6). */
  length?: number;
  value: string;
  onChange: (value: string) => void;
  /** Called once each time the code becomes complete. */
  onComplete?: (code: string) => void;
  /** `numeric` opens the number pad; `alphanumeric` allows letters and uppercases them. */
  charset?: OtpCharset;
  /** `error` shakes and turns the slots red (clear the value yourself); `success` locks them green. */
  status?: OtpStatus;
  disabled?: boolean;
  autoFocus?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

/** Blinking insertion line shown in the next empty slot; static when the user prefers reduced motion. */
const Caret: React.FC<{ color: string; animate: boolean }> = ({ color, animate }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!animate) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animate, opacity]);
  return <Animated.View style={[styles.caret, { backgroundColor: color, opacity }]} />;
};

/**
 * Code input drawn as separate slots but backed by ONE hidden TextInput that
 * holds one string. The input lies transparently over the slots, so a tap
 * anywhere focuses it, and `oneTimeCode` / `sms-otp` let the OS offer the code
 * it just received. Formatted pastes ("123 456") are cleaned and fill every slot.
 */
export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6, value, onChange, onComplete, charset = 'numeric', status = 'idle', disabled, autoFocus,
  accessibilityLabel = 'Bestätigungscode', testID, style,
}) => {
  const { palette } = useTheme();
  const [focused, setFocused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const shake = useRef(new Animated.Value(0)).current;

  const current = sanitizeOtp(value, charset, length);
  const locked = status === 'success';
  const activeIndex = focused && !locked ? Math.min(current.length, length - 1) : -1;

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((on) => mounted && setReduceMotion(on)).catch(() => {});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (status !== 'error' || reduceMotion) return;
    const step = Math.round(timings.attention / 6);
    const native = Platform.OS !== 'web';
    Animated.sequence([
      Animated.timing(shake, { toValue: -8, duration: step, useNativeDriver: native }),
      Animated.timing(shake, { toValue: 7, duration: step, useNativeDriver: native }),
      Animated.timing(shake, { toValue: -5, duration: step, useNativeDriver: native }),
      Animated.timing(shake, { toValue: 3, duration: step, useNativeDriver: native }),
      Animated.timing(shake, { toValue: 0, duration: step, useNativeDriver: native }),
    ]).start();
  }, [status, reduceMotion, shake]);

  const handleChange = (text: string) => {
    const next = sanitizeOtp(text, charset, length);
    if (next === current) return;
    onChange(next);
    if (isOtpComplete(next, length)) onComplete?.(next);
  };

  const slotBorder = (filled: boolean, active: boolean) =>
    status === 'error' ? palette.danger
      : status === 'success' ? palette.green
        : active ? palette.focusRing
          : filled ? palette.ink : palette.inkMuted;

  return (
    <View style={[styles.wrap, disabled ? styles.disabled : null, style]}>
      <Animated.View
        style={[styles.slots, { transform: [{ translateX: shake }] }]}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        {otpSlots(current, length).map((char, i) => {
          const active = i === activeIndex;
          return (
            <View
              key={i}
              style={[
                styles.slot,
                {
                  borderColor: slotBorder(Boolean(char), active),
                  backgroundColor: status === 'success' ? palette.greenTint : palette.inputBg,
                },
              ]}
            >
              {char ? (
                <Text variant="bodyBold" size="xxl" style={{ color: status === 'success' ? palette.greenInk : palette.ink }}>{char}</Text>
              ) : active && i === current.length ? (
                <Caret color={palette.ink} animate={!reduceMotion} />
              ) : null}
            </View>
          );
        })}
      </Animated.View>
      <TextInput
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        value={current}
        onChangeText={handleChange}
        editable={!disabled && !locked}
        autoFocus={autoFocus}
        autoComplete="sms-otp"
        textContentType="oneTimeCode"
        keyboardType={charset === 'numeric' ? 'number-pad' : 'default'}
        autoCapitalize={charset === 'alphanumeric' ? 'characters' : 'none'}
        autoCorrect={false}
        caretHidden
        // Always edit at the end: the slots show a fill order, not a movable caret.
        selection={{ start: current.length, end: current.length }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { position: 'relative', alignSelf: 'stretch' },
  slots: { flexDirection: 'row', gap: spacing.sm },
  slot: { flex: 1, height: 56, maxWidth: 56, minWidth: 36, borderWidth: 2, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center' },
  caret: { width: 2, height: 26 },
  input: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, fontSize: 16 },
  disabled: { opacity: 0.5 },
});
