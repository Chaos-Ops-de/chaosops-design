import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';
import { SketchCard } from './SketchCard';
import { clamp } from './calendarMath';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface UnitStepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  /** When given, tapping the unit chip cycles through these. */
  units?: string[];
  onUnitChange?: (unit: string) => void;
  min?: number;
  max?: number;
  step?: number;
  style?: StyleProp<ViewStyle>;
}

const RULER_TICKS = 15;

/** Labelled value in an outlined chip next to a unit dropdown chip, with a tappable tick ruler (left = less, right = more). */
export const UnitStepper: React.FC<UnitStepperProps> = ({
  label, value, onChange, unit, units, onUnitChange, min = 0, max = Number.MAX_SAFE_INTEGER, step = 1, style,
}) => {
  const { palette } = useTheme();
  const set = (next: number) => onChange(clamp(next, min, max));
  const cycleUnit = () => {
    if (!units || units.length < 2 || !onUnitChange) return;
    onUnitChange(units[(units.indexOf(unit) + 1) % units.length]!);
  };
  const mid = Math.floor(RULER_TICKS / 2);
  return (
    <SketchCard style={style}>
      <Text variant="bodySemiBold" size="sm">{label}</Text>
      <View style={styles.row}>
        <View style={[styles.chip, { borderColor: palette.border, backgroundColor: palette.cardBg }]}>
          <Text variant="display" size="xl" accessibilityLiveRegion="polite">{value}</Text>
        </View>
        <Pressable
          accessibilityRole={units ? 'button' : undefined}
          disabled={!units}
          onPress={cycleUnit}
          style={[styles.chip, { borderColor: palette.border, backgroundColor: palette.greenTint }]}
        >
          <Text variant="bodyBold">{unit}{units ? ' ▾' : ''}</Text>
        </Pressable>
      </View>
      <View style={styles.ruler} accessibilityRole="adjustable" accessibilityValue={{ min, max, now: value }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => set(value + (e.nativeEvent.actionName === 'increment' ? step : -step))}>
        {Array.from({ length: RULER_TICKS }, (_, i) => {
          const delta = (i - mid) * step;
          return (
            <Pressable key={i} hitSlop={{ top: 8, bottom: 8 }} disabled={delta === 0} onPress={() => set(value + delta)} style={styles.tickHit}>
              <View style={{ width: 2, height: i === mid ? 22 : i % 5 === mid % 5 ? 16 : 10, borderRadius: 1, backgroundColor: i === mid ? palette.amber : palette.ink }} />
            </Pressable>
          );
        })}
      </View>
    </SketchCard>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  chip: { minHeight: 36, minWidth: 56, paddingHorizontal: spacing.md, borderWidth: 2, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  ruler: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: spacing.md, height: 28 },
  tickHit: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: 28 },
});
