import React from 'react';
import {
  Pressable, Text, StyleSheet,
  type PressableProps, type StyleProp, type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies } from '../tokens/fonts';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface ActionButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  color?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  leftIcon?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'filled' | 'outline';
}

/**
 * Cross-platform flipchart-style action button.
 * Signature look: ink border, ink offset shadow, amber fill, bold display font.
 */
export const ActionButton: React.FC<ActionButtonProps> = ({
  label, color, borderStyle = 'solid',
  leftIcon, rightAdornment,
  style, onPress, disabled,
  variant = 'filled',
  ...rest
}) => {
  const { palette } = useTheme();
  const bg = variant === 'filled' ? (color ?? palette.amber) : 'transparent';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg,
          borderColor: palette.border,
          borderStyle,
          shadowColor: palette.border,
          opacity: disabled ? 0.6 : 1,
          transform: [{ translateY: pressed ? -1 : 0 }],
        },
        style,
      ]}
      {...rest}
    >
      {leftIcon}
      <Text style={[styles.label, { color: palette.ink, fontFamily: fontFamilies.bodyBold }]}>
        {label}
      </Text>
      {rightAdornment}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md + 2,
    borderWidth: 2,
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  label: { fontSize: 16, fontWeight: '700' },
});
