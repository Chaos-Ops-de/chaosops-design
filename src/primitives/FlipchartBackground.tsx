import React from 'react';
import { Platform, View, StyleSheet, type ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export interface FlipchartBackgroundProps extends ViewProps {
  lineColor?: string;
  lineGap?: number;
}

/**
 * Cross-platform flipchart-paper background.
 *
 * On web (via react-native-web), we hand a `repeating-linear-gradient` to the
 * View's style — RNW turns it into a CSS `background-image`.
 * On native, we render subtle ruled lines using absolutely-positioned Views.
 */
export const FlipchartBackground: React.FC<FlipchartBackgroundProps> = ({
  lineColor, lineGap = 28, style, children, ...rest
}) => {
  const { palette } = useTheme();
  const stroke = lineColor ?? 'rgba(24,24,24,0.06)';

  if (Platform.OS === 'web') {
    const webStyle = {
      backgroundColor: palette.bg,
      backgroundImage: `repeating-linear-gradient(0deg, transparent 0, transparent ${lineGap - 1}px, ${stroke} ${lineGap - 1}px, ${stroke} ${lineGap}px)`,
    } as unknown as ViewProps['style'];
    return (
      <View style={[styles.wrapper, webStyle, style]} {...rest}>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: palette.bg }, style]} {...rest}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: 40 }).map((_, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: i * lineGap,
              height: 1,
              backgroundColor: stroke,
            }}
          />
        ))}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, overflow: 'hidden' },
});
