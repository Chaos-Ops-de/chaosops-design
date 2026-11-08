import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { litTicks } from './calendarMath';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface RadialGaugeProps {
  /** Progress 0–1. */
  value: number;
  /** Outer diameter in px. */
  size?: number;
  /** Number of ticks around the ring. */
  ticks?: number;
  /** Colour of lit ticks; defaults to the palette green. */
  color?: string;
  /** Content of the outlined centre card (percentage, label…). */
  children?: React.ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Dense tick ring (dark, lit part coloured) around an outlined centre card; fills clockwise from 12 o'clock. Plain Views only. */
export const RadialGauge: React.FC<RadialGaugeProps> = ({
  value, size = 200, ticks = 72, color, children, accessibilityLabel, style,
}) => {
  const { palette } = useTheme();
  const lit = litTicks(value, ticks);
  const tickH = Math.max(6, size * 0.06);
  const tickW = Math.max(2, size * 0.012);
  const inner = size * 0.62;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(Math.min(1, Math.max(0, value || 0)) * 100) }}
      style={[{ width: size, height: size }, style]}
    >
      {Array.from({ length: ticks }, (_, i) => (
        <View key={i} style={[styles.slot, { width: size, height: size, transform: [{ rotate: `${(360 / ticks) * i}deg` }] }]}>
          <View style={{ width: tickW, height: tickH, borderRadius: tickW / 2, backgroundColor: i < lit ? (color ?? palette.green) : palette.ink, opacity: i < lit ? 1 : 0.35 }} />
        </View>
      ))}
      <View style={styles.center}>
        <View style={[styles.card, { width: inner, height: inner, borderColor: palette.border, backgroundColor: palette.cardBg }]}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slot: { position: 'absolute', top: 0, left: 0, alignItems: 'center' },
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  card: { borderWidth: 2, borderRadius: radii.xl, alignItems: 'center', justifyContent: 'center', padding: spacing.sm },
});
