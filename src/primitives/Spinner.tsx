import React from 'react';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { spinnerPixels, type SpinnerSize } from '../utils/progress';

export type { SpinnerSize } from '../utils/progress';
export type SpinnerTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

export interface SpinnerProps {
  /** `sm` 16, `md` 24, `lg` 36 px, or a pixel number. */
  size?: SpinnerSize;
  tone?: SpinnerTone;
  /** Overrides the tone color (e.g. the label color inside a button). */
  color?: string;
  /** Announced to screen readers. */
  label?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

// ActivityIndicator only has two intrinsic sizes; others are scaled from these.
const SMALL = 20;
const LARGE = 36;

/**
 * Indeterminate spinner around ActivityIndicator, colored from the palette. Use
 * it only for waits shorter than about 3 seconds (motionLimits.spinnerMaxMs) and
 * inside buttons; show a skeleton when the shape is known and a ProgressBar when
 * the percentage is.
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md', tone = 'info', color, label = 'Wird geladen…', style, testID,
}) => {
  const { palette } = useTheme();
  const px = spinnerPixels(size);
  const toneColor = {
    info: palette.info, success: palette.green, warning: palette.amber, danger: palette.danger, neutral: palette.inkMuted,
  }[tone];
  const large = px > 28;
  const scale = px / (large ? LARGE : SMALL);

  return (
    <View
      testID={testID}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      style={[styles.box, { width: px, height: px }, style]}
    >
      <ActivityIndicator size={large ? 'large' : 'small'} color={color ?? toneColor} style={{ transform: [{ scale }] }} />
    </View>
  );
};

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
});
