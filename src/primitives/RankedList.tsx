import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SketchCard } from './SketchCard';
import { Text } from './Text';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface RankedListItem {
  key: string;
  label: string;
  count: number;
  /** Optional icon / thumbnail, shown in a mint outlined tile. */
  icon?: React.ReactNode;
}

export interface RankedListProps {
  title?: string;
  items: RankedListItem[];
  /** Appended to each count, e.g. "x" → "3x". */
  countSuffix?: string;
  style?: StyleProp<ViewStyle>;
}

/** "Most widely used" list: icon tile, label and a bold count per row, sorted by count (highest first). */
export const RankedList: React.FC<RankedListProps> = ({ title, items, countSuffix = 'x', style }) => {
  const { palette } = useTheme();
  const sorted = [...items].sort((a, b) => b.count - a.count);
  return (
    <SketchCard style={style}>
      {title ? <Text variant="bodySemiBold" size="sm" style={styles.title}>{title}</Text> : null}
      {sorted.map((item, i) => (
        <View key={item.key} style={[styles.row, i > 0 && { borderTopWidth: 1, borderTopColor: palette.inputBorder, borderStyle: 'dashed' }]}>
          {item.icon != null ? (
            <View style={[styles.tile, { borderColor: palette.border, backgroundColor: palette.greenTint }]}>{item.icon}</View>
          ) : null}
          <Text variant="bodySemiBold" size="sm" style={styles.label}>{item.label}</Text>
          <Text variant="bodyBold" size="md">{item.count}{countSuffix}</Text>
        </View>
      ))}
    </SketchCard>
  );
};

const styles = StyleSheet.create({
  title: { marginBottom: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  tile: { width: 34, height: 34, borderWidth: 2, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1 },
});
