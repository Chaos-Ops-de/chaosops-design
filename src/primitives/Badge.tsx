import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies } from '../tokens/fonts';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';
import { tabularNumsNative } from '../tokens/typography';
import { badgeColors, type BadgeTone, type BadgeVariant } from './badgeColors';

export type { BadgeTone, BadgeVariant } from './badgeColors';
export type BadgeSize = 'sm' | 'md';

// The token is a readonly tuple; RN's TextStyle wants a mutable array.
const tabularNums = { fontVariant: [...tabularNumsNative.fontVariant] };

export interface BadgeProps {
  /** The label. Required text, so the status never relies on color alone. */
  label: string;
  tone?: BadgeTone;
  size?: BadgeSize;
  /** `soft` = tint fill with ink text, `solid` = saturated fill. */
  variant?: BadgeVariant;
  /** Small filled dot before the label (status, presence). */
  dot?: boolean;
  /** A lucide-react-native icon, as an element or a component (`Check`); a component receives `size` and `color`. */
  icon?: React.ReactNode | React.ComponentType<{ size?: number; color?: string }>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function renderIcon(icon: BadgeProps['icon'], size: number, color: string): React.ReactNode {
  if (icon == null || icon === false) return null;
  if (React.isValidElement(icon)) return icon;
  if (typeof icon === 'function' || (typeof icon === 'object' && '$$typeof' in (icon as object))) {
    return React.createElement(icon as React.ComponentType<{ size?: number; color?: string }>, { size, color });
  }
  return icon as React.ReactNode;
}

/**
 * Pill badge for status and counts: valid / expiring / expired, online / stale /
 * offline. Pair the hue with the label (and a dot or icon); never color alone.
 */
export const Badge: React.FC<BadgeProps> = ({
  label, tone = 'neutral', size = 'md', variant = 'soft', dot = false, icon, style, testID,
}) => {
  const { palette } = useTheme();
  const c = badgeColors(palette, tone, variant);
  const small = size === 'sm';

  return (
    <View
      testID={testID}
      accessible
      accessibilityLabel={label}
      style={[
        styles.pill,
        small ? styles.pillSm : styles.pillMd,
        { backgroundColor: c.bg, borderColor: c.border },
        style,
      ]}
    >
      {dot ? <View style={[styles.dot, { backgroundColor: c.dot }]} /> : null}
      {renderIcon(icon, small ? 11 : 13, c.fg)}
      <Text
        style={[
          small ? styles.labelSm : styles.labelMd,
          { color: c.fg, fontFamily: fontFamilies.bodyBold },
          tabularNums,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderRadius: radii.full,
  },
  pillMd: { gap: 6, paddingVertical: 2, paddingHorizontal: 10 },
  pillSm: { gap: 5, paddingVertical: 1, paddingHorizontal: spacing.sm },
  dot: { width: 6, height: 6, borderRadius: 3 },
  labelMd: { fontSize: 12, fontWeight: '700', lineHeight: 18 },
  labelSm: { fontSize: 11, fontWeight: '700', lineHeight: 16 },
});
