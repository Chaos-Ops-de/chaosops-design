import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo, Animated, Easing, PanResponder, Pressable, StyleSheet, Text, View,
} from 'react-native';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies, fontSizes } from '../tokens/fonts';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';
import { rnOffsetShadow } from '../tokens/shadows';
import { springs, timings } from '../tokens/motion';
import { zIndex } from '../tokens/zIndex';
import {
  addToast, needsCloseButton, remainingAfterPause, removeToast, resolveToastDuration,
  shouldSwipeDismiss, visibleToasts, type ToastAction, type ToastEntry, type ToastType,
} from './toastQueue';

export type { ToastType, ToastAction } from './toastQueue';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  /** Auto-dismiss in ms; 0 keeps it until dismissed. Defaults per type (errors stay). */
  duration?: number;
  /** Optional action button, e.g. Undo. */
  action?: ToastAction;
}

export interface ToastApi {
  /** Shows a toast and returns its id. */
  show: (options: ToastOptions) => string;
  success: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => string;
  error: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => string;
  warning: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => string;
  info: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => string;
  dismiss: (id: string) => void;
}

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Most toasts on screen at once; the rest wait in a queue (default 3). */
  maxVisible?: number;
  /** Extra top padding, e.g. `useSafeAreaInsets().top` (kept out of the package to avoid a hard peer). */
  topInset?: number;
  /** Called when a toast appears — hook up a haptic here. */
  onHaptic?: (type: ToastType) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

/** Shows toasts at the top of the screen. Mount once near the root, inside the ThemeProvider. */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children, maxVisible = 3, topInset = 0, onHaptic }) => {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => setToasts((prev) => removeToast(prev, id)), []);

  const show = useCallback((options: ToastOptions) => {
    const type = options.type ?? 'info';
    counter.current += 1;
    const id = `toast-${counter.current}`;
    const entry: ToastEntry = {
      id, message: options.message, type, duration: resolveToastDuration(type, options.duration), action: options.action,
    };
    setToasts((prev) => addToast(prev, entry));
    return id;
  }, []);

  const api = useMemo<ToastApi>(() => {
    const typed = (type: ToastType) => (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
      show({ ...options, message, type });
    return { show, dismiss, success: typed('success'), error: typed('error'), warning: typed('warning'), info: typed('info') };
  }, [show, dismiss]);

  // The oldest toasts are on screen; the newest one sits nearest the top edge.
  const visible = visibleToasts(toasts, maxVisible);
  const ordered = [...visible].reverse();

  return (
    <ToastContext.Provider value={api}>
      {children}
      <View pointerEvents="box-none" style={[styles.overlay, { paddingTop: topInset + spacing.sm }]}>
        {ordered.map((toast) => (
          <ToastView key={toast.id} toast={toast} onDismiss={dismiss} onHaptic={onHaptic} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const ICONS = { success: CheckCircle2, error: AlertCircle, warning: AlertTriangle, info: Info } as const;
const TRAVEL = 72;

interface ToastViewProps {
  toast: ToastEntry;
  onDismiss: (id: string) => void;
  onHaptic?: (type: ToastType) => void;
}

const ToastView: React.FC<ToastViewProps> = ({ toast, onDismiss, onHaptic }) => {
  const { palette } = useTheme();
  const hue = { success: 'green', error: 'danger', warning: 'amber', info: 'info' }[toast.type] as 'green' | 'danger' | 'amber' | 'info';
  const base = palette[hue];
  const tint = palette[`${hue}Tint`];
  const ink = palette[`${hue}Ink`];
  const Icon = ICONS[toast.type];
  const isError = toast.type === 'error';

  const translateY = useRef(new Animated.Value(-TRAVEL)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const closing = useRef(false);
  const remaining = useRef(toast.duration);
  const startedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useRef(false);

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const close = useRef((_direction?: { dx: number; dy: number }) => {});
  close.current = (direction) => {
    if (closing.current) return;
    closing.current = true;
    clearTimer();
    const sideways = direction && Math.abs(direction.dx) > Math.abs(direction.dy);
    const duration = reduceMotion.current ? 0 : timings.exit;
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      sideways
        ? Animated.timing(translateX, { toValue: Math.sign(direction!.dx) * 240, duration, useNativeDriver: true })
        : Animated.timing(translateY, { toValue: -TRAVEL / 2, duration, useNativeDriver: true }),
    ]).start(() => onDismiss(toast.id));
  };

  const startTimer = () => {
    clearTimer();
    if (remaining.current <= 0 || closing.current) return;
    startedAt.current = Date.now();
    timer.current = setTimeout(() => close.current(), remaining.current);
  };

  const pauseTimer = () => {
    if (!timer.current) return;
    remaining.current = remainingAfterPause(remaining.current, startedAt.current, Date.now());
    clearTimer();
  };

  const springBack = () => {
    Animated.parallel([
      Animated.spring(translateX, { toValue: 0, ...springs.toast, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, ...springs.toast, useNativeDriver: true }),
    ]).start();
  };

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 || g.dy < -8,
      onPanResponderGrant: () => pauseTimer(),
      onPanResponderMove: (_, g) => {
        translateX.setValue(g.dx);
        translateY.setValue(Math.min(0, g.dy));
      },
      onPanResponderRelease: (_, g) => {
        if (shouldSwipeDismiss(g.dx, g.dy, g.vx, g.vy)) close.current({ dx: g.dx, dy: g.dy });
        else {
          springBack();
          startTimer();
        }
      },
      onPanResponderTerminate: () => {
        springBack();
        startTimer();
      },
    }),
  ).current;

  useEffect(() => {
    let live = true;
    try { onHaptic?.(toast.type); } catch { /* ignore haptic errors */ }
    try { AccessibilityInfo.announceForAccessibility?.(toast.message); } catch { /* not available on every platform */ }

    const enter = (reduce: boolean) => {
      if (!live) return;
      reduceMotion.current = reduce;
      if (reduce) {
        translateY.setValue(0);
        opacity.setValue(1);
        return;
      }
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, ...springs.toast, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: timings.enter, useNativeDriver: true }),
      ]).start();
    };
    (AccessibilityInfo.isReduceMotionEnabled?.() ?? Promise.resolve(false)).then(enter).catch(() => enter(false));

    startTimer();
    return () => {
      live = false;
      clearTimer();
    };
    // Runs once per toast: its content never changes after it is shown.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sticker = rnOffsetShadow(base, 2, 3);

  return (
    <Animated.View
      {...pan.panHandlers}
      accessibilityRole={isError ? 'alert' : undefined}
      accessibilityLiveRegion={isError ? 'assertive' : 'polite'}
      style={[
        styles.card,
        sticker,
        {
          backgroundColor: palette.surfaceElevated,
          borderColor: base,
          opacity,
          transform: [{ translateX }, { translateY }],
        },
      ]}
    >
      {/* Translucent dark-mode tints sit on the opaque surface above, so text stays readable. */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.tint, { backgroundColor: tint }]} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${toast.message}. Zum Schließen tippen`}
        onPress={() => close.current()}
        style={styles.body}
      >
        <Icon size={20} color={ink} />
        <Text style={[styles.message, { color: ink, fontFamily: fontFamilies.bodySemiBold }]}>{toast.message}</Text>
      </Pressable>
      {toast.action ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            toast.action?.onClick();
            close.current();
          }}
          style={styles.action}
        >
          <Text style={[styles.actionLabel, { color: ink, fontFamily: fontFamilies.bodyBold }]}>{toast.action.label}</Text>
        </Pressable>
      ) : null}
      {needsCloseButton(toast.duration) ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Schließen" onPress={() => close.current()} style={styles.close}>
          <X size={16} color={ink} />
        </Pressable>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    zIndex: zIndex.toast,
    elevation: 50,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 520,
    minHeight: 48,
    borderWidth: 2,
    borderLeftWidth: 6,
    borderRadius: radii.lg,
    overflow: 'visible',
  },
  tint: { borderRadius: radii.lg - 2 },
  body: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, paddingLeft: spacing.lg, paddingRight: spacing.sm },
  message: { flex: 1, fontSize: fontSizes.base, lineHeight: 20 },
  action: { minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md },
  actionLabel: { fontSize: fontSizes.base, textDecorationLine: 'underline' },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
