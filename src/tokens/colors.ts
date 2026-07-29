export type ThemeName = 'light' | 'dark';

export interface Palette {
  bg: string;
  cardBg: string;
  ink: string;
  inkMuted: string;
  border: string;
  headerBg: string;
  tabBarBg: string;
  tabBarBorder: string;
  amber: string;
  green: string;
  danger: string;
  inputBg: string;
  inputBorder: string;
  chipInactiveBg: string;
}

export const palettes: Record<ThemeName, Palette> = {
  light: {
    bg: '#fffbe7',
    cardBg: '#ffffff',
    ink: '#181818',
    inkMuted: '#6b7280',
    border: '#181818',
    headerBg: '#fffbe7',
    tabBarBg: '#fffdf3',
    tabBarBorder: '#e5e7eb',
    amber: '#fbbf24',
    green: '#10b981',
    danger: '#ef4444',
    inputBg: '#ffffff',
    inputBorder: '#d1d5db',
    chipInactiveBg: '#f4f1e6',
  },
  dark: {
    bg: '#171310',
    cardBg: '#231d16',
    ink: '#f5ecd8',
    inkMuted: '#b9ac95',
    border: '#4a4030',
    headerBg: '#1c1712',
    tabBarBg: '#1c1712',
    tabBarBorder: '#3a3126',
    amber: '#fbbf24',
    green: '#34d399',
    danger: '#f87171',
    inputBg: '#231d16',
    inputBorder: '#4a4030',
    chipInactiveBg: '#2a231a',
  },
};

export const paletteKeys: Array<keyof Palette> = [
  'bg', 'cardBg', 'ink', 'inkMuted', 'border', 'headerBg',
  'tabBarBg', 'tabBarBorder', 'amber', 'green', 'danger',
  'inputBg', 'inputBorder', 'chipInactiveBg',
];
