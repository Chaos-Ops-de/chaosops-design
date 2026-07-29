import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { palettes, type Palette, type ThemeName } from '../tokens/colors';
import { memoryStorage, type ThemeStorage } from './storage';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'chaosops.themePreference';

export interface ThemeState {
  preference: ThemePreference;
  resolvedTheme: ThemeName;
  palette: Palette;
  setPreference: (p: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

export interface ThemeProviderProps {
  children: React.ReactNode;
  storage?: ThemeStorage;
  systemScheme?: ThemeName;
  defaultPreference?: ThemePreference;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  storage = memoryStorage,
  systemScheme = 'light',
  defaultPreference = 'system',
  storageKey = STORAGE_KEY,
}) => {
  const [preference, setPreferenceState] = useState<ThemePreference>(defaultPreference);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve(storage.getItem(storageKey)).then((stored) => {
      if (cancelled) return;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setPreferenceState(stored);
      }
    });
    return () => { cancelled = true; };
  }, [storage, storageKey]);

  const setPreference = (p: ThemePreference) => {
    setPreferenceState(p);
    Promise.resolve(storage.setItem(storageKey, p)).catch(() => {});
  };

  const resolvedTheme: ThemeName = preference === 'system' ? systemScheme : preference;

  const value = useMemo<ThemeState>(
    () => ({ preference, resolvedTheme, palette: palettes[resolvedTheme], setPreference }),
    [preference, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function usePalette(): Palette {
  return useTheme().palette;
}
