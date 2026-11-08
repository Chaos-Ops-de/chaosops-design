import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SketchCard } from './SketchCard';
import { Text } from './Text';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface BarChartDatum {
  label: string;
  value: number;
}

export interface BarChartProps {
  data: BarChartDatum[];
  /** Scale maximum; defaults to the largest value. */
  max?: number;
  /** Index of the highlighted bar (yellow, with a dark value bubble). */
  selectedIndex?: number | null;
  onSelect?: (index: number) => void;
  /** Texts in the top corners, e.g. goal / current ("250ml" … "2000ml"). */
  topLeft?: string;
  topRight?: string;
  height?: number;
  formatValue?: (value: number) => string;
  style?: StyleProp<ViewStyle>;
}

const SEGMENT = 3;
const GAP = 3;

/** Bars drawn as stacks of short dashes (teal; yellow when selected) in an outlined card, plain Views only. */
export const BarChart: React.FC<BarChartProps> = ({
  data, max, selectedIndex = null, onSelect, topLeft, topRight, height = 140, formatValue = String, style,
}) => {
  const { palette } = useTheme();
  const top = Math.max(max ?? 0, ...data.map((d) => d.value), 1);
  const plotH = height - 24;
  return (
    <SketchCard style={style}>
      {topLeft || topRight ? (
        <View style={styles.top}>
          <Text variant="bodySemiBold" size="xs">{topLeft}</Text>
          <Text variant="bodySemiBold" size="xs">{topRight}</Text>
        </View>
      ) : null}
      <View accessibilityRole="image" accessibilityLabel={data.map((d) => `${d.label}: ${formatValue(d.value)}`).join(', ')}>
        <View style={[styles.plot, { height }]}>
          {data.map((d, i) => {
            const active = i === selectedIndex;
            const barH = Math.max(SEGMENT, (d.value / top) * plotH);
            const segments = Math.max(1, Math.round(barH / (SEGMENT + GAP)));
            return (
              <Pressable key={`${d.label}-${i}`} disabled={!onSelect} onPress={() => onSelect?.(i)} style={styles.col}>
                {active ? (
                  <View style={[styles.bubble, { backgroundColor: palette.ink, bottom: segments * (SEGMENT + GAP) + spacing.xs }]}>
                    <Text variant="bodyBold" size="xs" numberOfLines={1} style={{ color: palette.bg }}>{formatValue(d.value)}</Text>
                  </View>
                ) : null}
                {Array.from({ length: segments }, (_, s) => (
                  <View key={s} style={{ width: active ? 8 : 6, height: SEGMENT, marginTop: GAP, borderRadius: 1, backgroundColor: active ? palette.amber : palette.teal }} />
                ))}
              </Pressable>
            );
          })}
        </View>
        <View style={styles.labels}>
          {data.map((d, i) => (
            <Text key={`${d.label}-${i}`} variant={i === selectedIndex ? 'bodyBold' : 'bodySemiBold'} size="xs" style={styles.label}>{d.label}</Text>
          ))}
        </View>
      </View>
    </SketchCard>
  );
};

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  plot: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs },
  col: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  // Centred over the bar but allowed to be wider than the column, so values never wrap.
  bubble: { position: 'absolute', left: '50%', width: 64, marginLeft: -32, alignItems: 'center', paddingVertical: 2, borderRadius: radii.sm },
  labels: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.sm },
  label: { flex: 1, textAlign: 'center' },
});
