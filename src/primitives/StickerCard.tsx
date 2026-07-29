import React from 'react';
import { View, StyleSheet, StyleSheet as RNStyleSheet, type ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface StickerCardProps extends ViewProps {
  offsetColor?: string;
  offset?: number;
}

export const StickerCard: React.FC<StickerCardProps> = ({
  style, offsetColor, offset = 4, children, ...rest
}) => {
  const { palette } = useTheme();
  return (
    <View style={styles.wrapper}>
      <View
        style={[
          RNStyleSheet.absoluteFill,
          styles.offset,
          { backgroundColor: offsetColor ?? palette.border, top: offset, left: offset },
        ]}
      />
      <View
        style={[
          styles.card,
          { backgroundColor: palette.cardBg, borderColor: palette.border },
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  offset: { borderRadius: radii.lg },
  card: {
    borderWidth: 2,
    borderRadius: radii.lg,
    padding: spacing.md + 2,
  },
});
