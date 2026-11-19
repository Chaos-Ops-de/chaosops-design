import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface TimeRowProps {
  /** e.g. "09:00". */
  time: string;
  /** Bold value on the right, e.g. "200 ml". */
  value: string;
  /** Replaces the default lucide `Clock` icon. */
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Slim outlined log row: clock + time on the left, bold value on the right. */
export const TimeRow: React.FC<TimeRowProps> = ({ time, value, icon, style }) => {
  const { palette } = useTheme();
  return (
    <View style={[styles.row, { borderColor: palette.border, backgroundColor: palette.cardBg }, style]}>
      {icon ?? <Clock size={18} color={palette.ink} />}
      <Text variant="bodySemiBold" size="sm" style={styles.time}>{time}</Text>
      <Text variant="bodyBold">{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 44, paddingHorizontal: spacing.md, borderWidth: 2, borderRadius: radii.md },
  time: { flex: 1 },
});
