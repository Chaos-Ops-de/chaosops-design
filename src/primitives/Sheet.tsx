import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, Easing, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions,
  type StyleProp, type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies } from '../tokens/fonts';

export interface SheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  /** Max height as a fraction of the window (default 0.85). */
  maxHeightRatio?: number;
  /** Extra bottom padding, e.g. `useSafeAreaInsets().bottom` (kept out of the package to avoid a hard peer). */
  bottomInset?: number;
  /** Tapping the scrim closes the sheet (default true). */
  dismissOnScrim?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

const OPEN_MS = 260;
const CLOSE_MS = 200;

/**
 * Bottom sheet for React Native / react-native-web: scrim fades while the panel
 * slides up from the bottom edge. Generic container — put lists, forms or action
 * rows inside.
 */
export const Sheet: React.FC<SheetProps> = ({
  visible, onClose, title, children, maxHeightRatio = 0.85, bottomInset = 0, dismissOnScrim = true, contentStyle, testID,
}) => {
  const { palette } = useTheme();
  const { height } = useWindowDimensions();
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(progress, { toValue: 1, duration: OPEN_MS, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    } else {
      Animated.timing(progress, { toValue: 0, duration: CLOSE_MS, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(
        ({ finished }) => { if (finished) setMounted(false); },
      );
    }
  }, [visible, progress]);

  if (!mounted) return null;

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [height, 0] });

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View style={[styles.fill, { opacity: progress, backgroundColor: palette.overlayScrim }]}>
          <Pressable
            style={styles.fill}
            onPress={dismissOnScrim ? onClose : undefined}
            accessibilityRole="button"
            accessibilityLabel="Schließen"
          />
        </Animated.View>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.panelWrap, { transform: [{ translateY }] }]}
        >
          <View
            style={[
              styles.panel,
              {
                backgroundColor: palette.surfaceElevated,
                borderColor: palette.border,
                maxHeight: height * maxHeightRatio,
                paddingBottom: 16 + bottomInset,
              },
              contentStyle,
            ]}
            testID={testID}
          >
            <View style={[styles.handle, { backgroundColor: palette.border }]} />
            {title ? <Text style={[styles.title, { color: palette.ink, fontFamily: fontFamilies.display }]} accessibilityRole="header">{title}</Text> : null}
            {children}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  flex: { flex: 1 },
  panelWrap: { flex: 1, justifyContent: 'flex-end' },
  panel: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 10,
    gap: 12,
  },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, opacity: 0.35 },
  title: { fontSize: 19 },
});
