import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { type Palette, type ThemeName } from '../tokens/colors';
import { defaultOrgTheme, resolveOrgPalette, type OrgThemeName } from '../tokens/orgThemes';
import { memoryStorage, type ThemeStorage } from './storage';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'chaosops.themePreference';

export interface ThemeState {
  preference: ThemePreference;
  resolvedTheme: ThemeName;
  /** Active organisation theme (style axis, independent of light/dark). */
  orgTheme: OrgThemeName;
  /** Palette for `resolvedTheme` with the org theme's overrides applied. */
  palette: Palette;
  setPreference: (p: ThemePreference) => void;
  /** Not persisted — the org theme belongs to the organisation, not the device. */
  setOrgTheme: (t: OrgThemeName) => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

export interface ThemeProviderProps {
  children: React.ReactNode;
  storage?: ThemeStorage;
  systemScheme?: ThemeName;
  defaultPreference?: ThemePreference;
  storageKey?: string;
  defaultOrgTheme?: OrgThemeName;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  storage = memoryStorage,
  systemScheme = 'light',
  defaultPreference = 'system',
  storageKey = STORAGE_KEY,
  defaultOrgTheme: initialOrgTheme = defaultOrgTheme,
}) => {
  const [preference, setPreferenceState] = useState<ThemePreference>(defaultPreference);
  const [orgTheme, setOrgTheme] = useState<OrgThemeName>(initialOrgTheme);

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
    () => ({ preference, resolvedTheme, orgTheme, palette: resolveOrgPalette(orgTheme, resolvedTheme), setPreference, setOrgTheme }),
    [preference, resolvedTheme, orgTheme],
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
