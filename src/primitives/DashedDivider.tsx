import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../tokens/spacing';

export const DashedDivider: React.FC = () => {
  const { palette } = useTheme();
  return <View style={[styles.line, { borderColor: palette.tabBarBorder }]} />;
};

const styles = StyleSheet.create({
  line: {
    borderBottomWidth: 2,
    borderStyle: 'dashed',
    marginVertical: spacing.sm,
  },
});
