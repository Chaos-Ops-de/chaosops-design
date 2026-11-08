import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SketchCard } from './SketchCard';
import { Text } from './Text';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface SelectCardOption {
  value: string;
  label: string;
  /** Picture / emoji shown above the label. */
  image: React.ReactNode;
}

export interface SelectCardsProps {
  label?: string;
  options: SelectCardOption[];
  value: string | null;
  onChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

/** Single-choice picture cards in a row (e.g. gender): outlined tile per option, selected one turns yellow. */
export const SelectCards: React.FC<SelectCardsProps> = ({ label, options, value, onChange, style }) => {
  const { palette } = useTheme();
  return (
    <SketchCard style={style}>
      {label ? <Text variant="bodySemiBold" size="sm" style={styles.label}>{label}</Text> : null}
      <View accessibilityRole="radiogroup" style={styles.row}>
        {options.map((o) => {
          const selected = o.value === value;
          return (
            <Pressable
              key={o.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(o.value)}
              style={[styles.option, { borderColor: palette.border, backgroundColor: selected ? palette.amber : palette.cardBg, borderStyle: selected ? 'solid' : 'dashed' }]}
            >
              {typeof o.image === 'string' ? <Text size="xxl">{o.image}</Text> : o.image}
              <Text variant={selected ? 'bodyBold' : 'bodySemiBold'} size="xs" style={selected ? { color: palette.ink } : undefined}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SketchCard>
  );
};

const styles = StyleSheet.create({
  label: { marginBottom: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  option: { flex: 1, alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm, borderWidth: 2, borderRadius: radii.md },
});
