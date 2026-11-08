import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';
import { useSketchTone } from './SketchCard';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface ActionPairProps {
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  primaryDisabled?: boolean;
  onHaptic?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Footer pair: mint outlined pill ("Submit") plus a plain bold text action ("Skip Now"). */
export const ActionPair: React.FC<ActionPairProps> = ({
  primaryLabel, secondaryLabel, onPrimary, onSecondary, primaryDisabled, onHaptic, style,
}) => {
  const { palette } = useTheme();
  const mint = useSketchTone('mint');
  const press = (fn: () => void) => () => { try { onHaptic?.(); } catch { /* ignore */ } fn(); };
  return (
    <View style={[styles.row, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !!primaryDisabled }}
        disabled={primaryDisabled}
        onPress={press(onPrimary)}
        style={[styles.primary, { backgroundColor: mint, borderColor: palette.border, opacity: primaryDisabled ? 0.5 : 1 }]}
      >
        <Text variant="bodyBold">{primaryLabel}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" hitSlop={8} onPress={press(onSecondary)} style={styles.secondary}>
        <Text variant="bodyBold">{secondaryLabel}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  primary: { flex: 1, minHeight: 44, borderWidth: 2, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  secondary: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});
