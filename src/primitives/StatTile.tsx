import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SketchCard, useSketchTone } from './SketchCard';
import { Text } from './Text';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface StatTileProps {
  /** Pill label, e.g. "Letzte 7 Tage". */
  label: string;
  /** Headline figure, e.g. "14%". */
  value: string;
  /** Secondary figure on the right, e.g. "250ml | 1L". */
  detail?: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Compact stat: outlined mint label pill, bold headline figure and a secondary figure on the right. */
export const StatTile: React.FC<StatTileProps> = ({ label, value, detail, icon, style }) => {
  const { palette } = useTheme();
  const mint = useSketchTone('mint');
  return (
    <SketchCard style={style} padding={spacing.md}>
      <View style={[styles.pill, { borderColor: palette.border, backgroundColor: mint }]}>
        {icon}
        <Text variant="bodySemiBold" size="xs">{label}</Text>
      </View>
      <View style={styles.row}>
        <Text variant="display" size="xxl">{value}</Text>
        {detail ? <Text variant="bodySemiBold" size="sm" muted>{detail}</Text> : null}
      </View>
    </SketchCard>
  );
};

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'flex-start', borderWidth: 2, borderRadius: radii.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  row: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: spacing.sm },
});
