import React from 'react';
import {
  Platform, Pressable, Text, StyleSheet,
  type PressableProps, type StyleProp, type ViewStyle, type GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies } from '../tokens/fonts';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface PillButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: 'primary' | 'outline' | 'danger';
  style?: StyleProp<ViewStyle>;
  onHaptic?: () => void;
}

export const PillButton: React.FC<PillButtonProps> = ({
  label, variant = 'primary', style, onHaptic, onPress, disabled, ...rest
}) => {
  const { palette } = useTheme();
  const bg = variant === 'primary' ? palette.amber : 'transparent';
  const borderColor = variant === 'danger' ? palette.danger : palette.border;
  const textColor = variant === 'danger' ? palette.danger : palette.ink;
  const rippleColor = variant === 'primary' ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.08)';

  const handlePress = (e: GestureResponderEvent) => {
    if (!disabled && onHaptic) {
      try { onHaptic(); } catch { /* ignore haptic errors */ }
    }
    onPress?.(e);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      hitSlop={8}
      android_ripple={Platform.OS === 'android' ? { color: rippleColor, borderless: false } : undefined}
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg, borderColor, opacity: disabled ? 0.55 : pressed && Platform.OS === 'ios' ? 0.7 : 1 },
        style,
      ]}
      {...rest}
    >
      <Text style={[styles.label, { color: textColor, fontFamily: fontFamilies.display }]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    paddingHorizontal: spacing.lg + 2,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  label: { fontSize: 14, fontWeight: '700' },
});
