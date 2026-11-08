import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface LevelBadgeProps {
  label: string;
  /** Small second line, e.g. "5 Pts Next". */
  caption?: string;
  /** Round yellow button on the right; omit to hide it. */
  onPlusPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Dark pill badge ("Level 1") with an optional yellow round "+" button. */
export const LevelBadge: React.FC<LevelBadgeProps> = ({ label, caption, onPlusPress, style }) => {
  const { palette } = useTheme();
  return (
    <View style={[styles.pill, { backgroundColor: palette.ink }, style]}>
      <View>
        <Text variant="bodyBold" size="sm" style={{ color: palette.bg }}>{label}</Text>
        {caption ? <Text size="xs" style={{ color: palette.bg, opacity: 0.7 }}>{caption}</Text> : null}
      </View>
      {onPlusPress ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Mehr" hitSlop={8} onPress={onPlusPress} style={[styles.plus, { backgroundColor: palette.amber }]}>
          <Text variant="bodyBold" style={{ color: palette.ink }}>+</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, alignSelf: 'flex-start', borderRadius: radii.full, paddingVertical: spacing.xs, paddingLeft: spacing.lg, paddingRight: spacing.xs },
  plus: { width: 30, height: 30, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center' },
});
