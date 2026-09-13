import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface ChipProps {
  label: string;
  active: boolean;
  activeBg: string;
  activeBorder: string;
  activeText: string;
  inactiveBg: string;
  inactiveBorder: string;
  inactiveText: string;
  onPress: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  label, active,
  activeBg, activeBorder, activeText,
  inactiveBg, inactiveBorder, inactiveText,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.chip,
      {
        backgroundColor: active ? activeBg : inactiveBg,
        borderColor: active ? activeBorder : inactiveBorder,
      },
    ]}
  >
    <Text style={[styles.label, { color: active ? activeText : inactiveText }]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  chip: {
    height: 32,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 11.5, fontWeight: '700' },
});
