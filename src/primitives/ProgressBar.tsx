import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies } from '../tokens/fonts';
import { radii } from '../tokens/radii';
import { timings } from '../tokens/motion';
import { tabularNumsNative } from '../tokens/typography';
import { clampProgress, formatPercent } from '../utils/progress';

// The token is a readonly tuple; RN's TextStyle wants a mutable array.
const tabularNums = { fontVariant: [...tabularNumsNative.fontVariant] };

export type ProgressTone = 'info' | 'success' | 'warning' | 'danger';
export type ProgressSize = 'sm' | 'md';

export interface ProgressBarProps {
  /** 0-100. Leave it out (or set `indeterminate`) when the percentage is unknown. */
  value?: number;
  indeterminate?: boolean;
  label?: string;
  /** Shows the percentage next to the label, in tabular figures. */
  showPercent?: boolean;
  tone?: ProgressTone;
  size?: ProgressSize;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((v) => { if (live) setReduce(v); }).catch(() => {});
    return () => { live = false; };
  }, []);
  return reduce;
}

/**
 * Progress bar for waits where the percentage is known, or that run longer than
 * about 3 seconds (uploads, installs). Under 3 seconds a Spinner does. With
 * reduce-motion on, the indeterminate bar pulses instead of sliding.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value, indeterminate, label, showPercent = false, tone = 'info', size = 'md', style, testID,
}) => {
  const { palette } = useTheme();
  const reduceMotion = useReduceMotion();
  const isIndeterminate = indeterminate ?? value === undefined;
  const pct = clampProgress(value ?? 0);
  const fill = { info: palette.info, success: palette.green, warning: palette.amber, danger: palette.danger }[tone];

  const width = useRef(new Animated.Value(pct)).current;
  useEffect(() => {
    if (isIndeterminate) return;
    Animated.timing(width, {
      toValue: pct,
      duration: reduceMotion ? 0 : timings.enter,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [pct, isIndeterminate, reduceMotion, width]);

  const loop = useRef(new Animated.Value(0)).current;
  const [trackWidth, setTrackWidth] = useState(0);
  useEffect(() => {
    if (!isIndeterminate) return;
    loop.setValue(0);
    const anim = Animated.loop(
      reduceMotion
        ? Animated.sequence([
            Animated.timing(loop, { toValue: 1, duration: 1200, useNativeDriver: true }),
            Animated.timing(loop, { toValue: 0, duration: 1200, useNativeDriver: true }),
          ])
        : Animated.timing(loop, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
    );
    anim.start();
    return () => anim.stop();
  }, [isIndeterminate, reduceMotion, loop]);

  const barWidth = trackWidth * 0.4;
  const slide = {
    transform: [{ translateX: loop.interpolate({ inputRange: [0, 1], outputRange: [-barWidth, trackWidth] }) }],
  };
  const pulse = { opacity: loop.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }) };

  return (
    <View
      testID={testID}
      style={[styles.wrap, style]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label ?? 'Fortschritt'}
      accessibilityValue={isIndeterminate ? undefined : { min: 0, max: 100, now: Math.round(pct), text: formatPercent(pct) }}
    >
      {(label || (showPercent && !isIndeterminate)) ? (
        <View style={styles.head}>
          {label ? <Text style={[styles.label, { color: palette.inkMuted, fontFamily: fontFamilies.display }]}>{label}</Text> : <View />}
          {showPercent && !isIndeterminate ? (
            <Text style={[styles.percent, { color: palette.inkSoft, fontFamily: fontFamilies.bodyBold }, tabularNums]}>
              {formatPercent(pct)}
            </Text>
          ) : null}
        </View>
      ) : null}
      <View
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        style={[
          styles.track,
          { height: size === 'sm' ? 8 : 12, borderColor: palette.border, backgroundColor: palette.chipInactiveBg },
        ]}
      >
        {isIndeterminate ? (
          <Animated.View
            style={[
              styles.bar,
              { backgroundColor: fill },
              reduceMotion ? [{ width: '100%' }, pulse] : [{ width: '40%' }, slide],
            ]}
          />
        ) : (
          <Animated.View
            style={[
              styles.bar,
              { backgroundColor: fill, width: width.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) },
            ]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { width: '100%', gap: 6 },
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  label: { fontSize: 14 },
  percent: { fontSize: 12, fontWeight: '700' },
  track: { borderWidth: 2, borderRadius: radii.full, overflow: 'hidden' },
  bar: { height: '100%', borderRadius: radii.full },
});
