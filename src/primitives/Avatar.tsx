import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies } from '../tokens/fonts';
import { colorForUserId, initialFor } from '../utils/avatarColor';

export interface AvatarProps {
  /** Source of the initial(s). */
  name?: string | null;
  /** Profile picture URL — falls back to the initials if it fails to load. */
  src?: string | null;
  /** Diameter in px. */
  size?: number;
  /** Derives a stable accent hue from the id. Without it the avatar is amber (like the mobile app's member avatars). */
  userId?: string | null;
  /** Number of letters shown (1 = web style, 2 = mobile style). */
  initials?: 1 | 2;
  /** Staff ring (Product Owner / Admin). */
  ring?: boolean;
  /** Overlap a previous avatar in a stack. */
  overlap?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

/** Cross-platform avatar (native + react-native-web); web-only DOM sibling lives in `@chaos-ops-de/design/web`. */
export const Avatar: React.FC<AvatarProps> = ({
  name, src, size = 32, userId, initials = 1, ring = false, overlap = false, onPress, accessibilityLabel, testID, style,
}) => {
  const { palette } = useTheme();
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  const shape = { width: size, height: size, borderRadius: size / 2 };
  const showImage = !!src && !failed;
  const bg = userId != null ? colorForUserId(userId, palette) : palette.amber;
  const text = (name?.trim() ? name.trim() : '?');
  const label = initials === 2 ? text.slice(0, 2).toUpperCase() : initialFor(text);

  const body = showImage ? (
    <Image
      source={{ uri: src! }}
      style={[shape, { backgroundColor: palette.inputBg }]}
      onError={() => setFailed(true)}
      accessibilityLabel={accessibilityLabel ?? (name ? `Profilbild von ${name}` : 'Profilbild')}
      testID={testID ? `${testID}-image` : undefined}
    />
  ) : (
    <View style={[styles.initials, shape, { backgroundColor: bg }]}>
      <Text style={{ fontSize: Math.round(size * (initials === 2 ? 0.38 : 0.42)), fontFamily: fontFamilies.bodyBold, color: userId != null ? palette.onAccent : '#181818' }}>
        {label}
      </Text>
    </View>
  );

  const wrapperStyle: StyleProp<ViewStyle> = [
    shape,
    overlap && { marginLeft: -size * 0.27 },
    ring && { borderWidth: 2.5, borderColor: palette.amber, padding: 1.5 },
    style,
  ];
  const inner = <View style={wrapperStyle}>{body}</View>;

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? name ?? undefined} onPress={onPress} hitSlop={8} testID={testID}>
        {inner}
      </Pressable>
    );
  }
  return <View testID={testID} accessible={!!accessibilityLabel} accessibilityLabel={accessibilityLabel}>{inner}</View>;
};

const styles = StyleSheet.create({
  initials: { alignItems: 'center', justifyContent: 'center' },
});
