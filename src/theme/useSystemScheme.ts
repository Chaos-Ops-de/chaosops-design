import { useEffect, useState } from 'react';
import type { ThemeName } from '../tokens/colors';

/** Default ChaosOps kiosk/display routes — these have no OS-level user to ask for a preference. */
export const KIOSK_PATH_PREFIXES: readonly string[] = ['/register-display', '/display/', '/d/'];

export function isKioskPath(pathname: string, prefixes: readonly string[] = KIOSK_PATH_PREFIXES): boolean {
  return prefixes.some((p) => pathname.startsWith(p));
}

const hasWindow = () => typeof window !== 'undefined';
const canMatchMedia = () => hasWindow() && typeof window.matchMedia === 'function';

const NIGHT_START_HOUR = 20; // 20:00
const NIGHT_END_HOUR = 7; // 07:00
const DARK_LUX_THRESHOLD = 15;

/** Dark between 20:00 and 07:00 local time. Exported for tests. */
export function schemeFromTimeOfDay(date: Date): ThemeName {
  const h = date.getHours();
  return h >= NIGHT_START_HOUR || h < NIGHT_END_HOUR ? 'dark' : 'light';
}

function useOsScheme(): ThemeName {
  const [scheme, setScheme] = useState<ThemeName>(() =>
    canMatchMedia() && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );
  useEffect(() => {
    if (!canMatchMedia()) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setScheme(e.matches ? 'dark' : 'light');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return scheme;
}

interface AmbientLightSensorLike {
  illuminance: number;
  start: () => void;
  stop: () => void;
  addEventListener: (type: 'reading' | 'error', listener: () => void) => void;
}

/**
 * Kiosk/display screens have no one around to ask for a light/dark
 * preference, so they derive one: an ambient light sensor reading when the
 * device + browser exposes one (Chromium, HTTPS, explicit permission), else
 * a local time-of-day heuristic (dark ~20:00-07:00) as the always-available
 * fallback. Re-evaluated periodically. Still fully overridable via the
 * on-screen toggle — an explicit light/dark preference always wins over this
 * "system" signal, same as everywhere else in the app.
 */
function useKioskAmbientScheme(): ThemeName {
  const [scheme, setScheme] = useState<ThemeName>(() => schemeFromTimeOfDay(new Date()));

  useEffect(() => {
    if (!hasWindow()) return;
    let sensorActive = false;
    let sensor: AmbientLightSensorLike | null = null;

    const timeInterval = window.setInterval(() => {
      if (!sensorActive) setScheme(schemeFromTimeOfDay(new Date()));
    }, 5 * 60 * 1000);

    const AmbientLightSensorCtor = (window as unknown as {
      AmbientLightSensor?: new (opts: { frequency: number }) => AmbientLightSensorLike;
    }).AmbientLightSensor;

    if (AmbientLightSensorCtor) {
      (async () => {
        try {
          if ('permissions' in navigator) {
            const status = await (navigator.permissions as unknown as {
              query: (opts: { name: string }) => Promise<{ state: string }>;
            }).query({ name: 'ambient-light-sensor' });
            if (status.state === 'denied') return;
          }
          const s = new AmbientLightSensorCtor({ frequency: 0.2 });
          s.addEventListener('reading', () => {
            sensorActive = true;
            setScheme(s.illuminance < DARK_LUX_THRESHOLD ? 'dark' : 'light');
          });
          s.addEventListener('error', () => {
            sensorActive = false;
            sensor = null;
          });
          s.start();
          sensor = s;
        } catch {
          // Unsupported, insecure context, or permission denied — the time-of-day fallback keeps running.
        }
      })();
    }

    return () => {
      window.clearInterval(timeInterval);
      if (sensor) {
        try { sensor.stop(); } catch { /* ignore */ }
      }
    };
  }, []);

  return scheme;
}

/**
 * Live OS light/dark detection for normal pages, or a sensor/time-of-day
 * derived scheme for kiosk display routes (which have no OS-level user to
 * set a preference for). Web-safe: without `window`/`matchMedia` (SSR, React
 * Native) it resolves to 'light' — on native prefer `useColorScheme()`.
 * ThemeProvider's `systemScheme` prop is static, not
 * self-detecting — this feeds it a live value either way.
 */
export function useSystemScheme(options: { kioskPathPrefixes?: readonly string[] } = {}): ThemeName {
  const kiosk = hasWindow() && isKioskPath(window.location.pathname, options.kioskPathPrefixes);
  const osScheme = useOsScheme();
  const kioskScheme = useKioskAmbientScheme();
  return kiosk ? kioskScheme : osScheme;
}
