import React from 'react';
import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies, fontSizes } from '../tokens/fonts';

export type TextVariant = 'display' | 'body' | 'bodyMedium' | 'bodySemiBold' | 'bodyBold';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  size?: keyof typeof fontSizes;
  muted?: boolean;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body', size = 'base', muted = false, style, ...rest
}) => {
  const { palette } = useTheme();
  return (
    <RNText
      style={[
        styles.base,
        { fontFamily: fontFamilies[variant], fontSize: fontSizes[size], color: muted ? palette.inkMuted : palette.ink },
        style,
      ]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  base: { includeFontPadding: false },
});
