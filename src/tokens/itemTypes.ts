import type { ThemeName } from './colors';

export type ScheduleItemType =
  | 'session'
  | 'workshop'
  | 'break'
  | 'announcement'
  | 'game'
  | 'transition'
  | 'essen'
  | 'markt';

interface TypeStyle {
  bgLight: string;
  border: string;
  textLight: string;
  label: string;
}

const TYPE_MAP: Record<ScheduleItemType, TypeStyle> = {
  session:      { bgLight: '#d0f0ff', border: '#38bdf8', textLight: '#0c4a6e', label: 'Session' },
  workshop:     { bgLight: '#e9ddff', border: '#a78bfa', textLight: '#5b21b6', label: 'Workshop' },
  break:        { bgLight: '#fff7b3', border: '#f59e0b', textLight: '#92400e', label: 'Pause' },
  announcement: { bgLight: '#ffd4ec', border: '#f472b6', textLight: '#9d174d', label: 'Ansage' },
  game:         { bgLight: '#d9fdd2', border: '#10b981', textLight: '#065f46', label: 'Spiel' },
  transition:   { bgLight: '#ffe1c5', border: '#f97316', textLight: '#9a3412', label: 'Übergang' },
  essen:        { bgLight: '#ffe0e0', border: '#ef4444', textLight: '#7f1d1d', label: 'Essen' },
  markt:        { bgLight: '#ccfbf1', border: '#14b8a6', textLight: '#134e4a', label: 'Markt' },
};

export const SCHEDULE_ITEM_TYPES: ScheduleItemType[] = [
  'session', 'workshop', 'break', 'announcement',
  'game', 'transition', 'essen', 'markt',
];

export interface ItemTypeColor {
  bg: string;
  border: string;
  text: string;
  label: string;
}

export function getItemTypeColor(type: string, theme: ThemeName): ItemTypeColor {
  const style = TYPE_MAP[type as ScheduleItemType] ?? TYPE_MAP.session;
  if (theme === 'dark') {
    return { bg: 'rgba(255,255,255,0.07)', border: style.border, text: '#f5ecd8', label: style.label };
  }
  return { bg: style.bgLight, border: style.border, text: style.textLight, label: style.label };
}

export const itemTypeStyles = TYPE_MAP;
