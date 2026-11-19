import React from 'react';
import { Pressable, StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import { Mic, Search, SlidersHorizontal } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { useSketchTone } from './SketchCard';
import { fontFamilies } from '../tokens/fonts';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  /** Shows a mic button inside the field when given. */
  onMicPress?: () => void;
  /** Shows a separate square filter button next to the field when given. */
  onFilterPress?: () => void;
  /** Replaces the default lucide `Mic` icon. */
  micIcon?: React.ReactNode;
  /** Replaces the default lucide `SlidersHorizontal` icon. */
  filterIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Outlined pill search field with leading magnifier, optional mic, and an optional mint filter button beside it. */
export const SearchBar: React.FC<SearchBarProps> = ({
  value, onChangeText, placeholder = 'Suchen', onMicPress, onFilterPress, micIcon, filterIcon, style,
}) => {
  const { palette } = useTheme();
  const mint = useSketchTone('mint');
  return (
    <View style={[styles.row, style]}>
      <View style={[styles.field, { borderColor: palette.border, backgroundColor: palette.cardBg }]}>
        <Search size={18} color={palette.inkMuted} aria-hidden />
        <TextInput
          accessibilityRole="search"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.inkMuted}
          style={[styles.input, { color: palette.ink, fontFamily: fontFamilies.body }]}
        />
        {onMicPress ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Spracheingabe" hitSlop={8} onPress={onMicPress}>
            {micIcon ?? <Mic size={20} color={palette.ink} />}
          </Pressable>
        ) : null}
      </View>
      {onFilterPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filter"
          onPress={onFilterPress}
          style={[styles.filter, { borderColor: palette.border, backgroundColor: mint }]}
        >
          {filterIcon ?? <SlidersHorizontal size={20} color={palette.ink} />}
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  field: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 44, paddingHorizontal: spacing.md, borderWidth: 2, borderRadius: radii.full },
  input: { flex: 1, fontSize: 14, paddingVertical: 0, minHeight: 40 },
  filter: { width: 44, height: 44, borderWidth: 2, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
});
