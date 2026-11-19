import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Text } from './Text';
import { useSketchTone } from './SketchCard';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface TabBarItem {
  key: string;
  label: string;
  /** Icon node (a lucide icon). */
  icon: React.ReactNode;
}

export interface TabBarProps {
  items: TabBarItem[];
  activeKey: string;
  onChange: (key: string) => void;
  style?: StyleProp<ViewStyle>;
}

/** Floating mint pill tab bar; the active tab sits in a yellow outlined circle. */
export const TabBar: React.FC<TabBarProps> = ({ items, activeKey, onChange, style }) => {
  const { palette } = useTheme();
  const mint = useSketchTone('mint');
  return (
    <View accessibilityRole="tablist" style={[styles.bar, { backgroundColor: mint, borderColor: palette.border }, style]}>
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: active }}
            onPress={() => onChange(item.key)}
            style={styles.tab}
          >
            <View style={[styles.icon, active && { backgroundColor: palette.amber, borderWidth: 2, borderColor: palette.border }]}>
              {typeof item.icon === 'string' ? <Text size="lg">{item.icon}</Text> : item.icon}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', padding: spacing.xs, borderWidth: 2, borderRadius: radii.full },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  icon: { width: 40, height: 40, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center' },
});
