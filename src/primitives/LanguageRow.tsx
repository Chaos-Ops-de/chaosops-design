import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';
import { SketchCard } from './SketchCard';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface LanguageRowProps {
  label: string;
  /** Flag / icon node, or an emoji string. Shown in an outlined tile. */
  leading?: React.ReactNode;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Single-choice row (language, setting): outlined flag tile, label, green check circle; lime fill when selected. */
export const LanguageRow: React.FC<LanguageRowProps> = ({ label, leading, selected, onPress, style }) => {
  const { palette } = useTheme();
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected }} onPress={onPress}>
      <SketchCard tone={selected ? 'lime' : 'card'} offset={3} radius={radii.md} padding={spacing.sm} style={style}>
        <View style={styles.row}>
          {leading != null ? (
            <View style={[styles.tile, { borderColor: palette.border, backgroundColor: palette.cardBg }]}>
              {typeof leading === 'string' ? <Text size="lg">{leading}</Text> : leading}
            </View>
          ) : null}
          <Text variant="bodySemiBold" style={styles.label}>{label}</Text>
          <View style={[styles.check, { borderColor: palette.border, backgroundColor: selected ? palette.green : 'transparent' }]}>
            {selected ? <Text variant="bodyBold" size="sm" style={{ color: palette.onAccent }}>✓</Text> : null}
          </View>
        </View>
      </SketchCard>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  tile: { width: 36, height: 28, borderWidth: 2, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1 },
  check: { width: 24, height: 24, borderRadius: radii.full, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
