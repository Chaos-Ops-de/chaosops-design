export const fontFamilies = {
  display: 'GloriaHallelujah_400Regular',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
} as const;

export const fonts = fontFamilies;

export const webFontStack = {
  display: '"Gloria Hallelujah", "Comic Neue", cursive',
  body: 'Inter, Roboto, system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: '"Roboto Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
} as const;

export const googleFontsHref =
  'https://fonts.googleapis.com/css2?' +
  [
    'family=Inter:wght@400;500;600;700',
    'family=Gloria+Hallelujah',
    'family=Comic+Neue:wght@400;700',
    'family=Roboto+Mono:wght@400;500',
    'display=swap',
  ].join('&');

export const fontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

export const fontSizes = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
} as const;
