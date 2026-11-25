import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { springs, timings } from '../../tokens/motion';
import { useIsMobile } from '../useIsMobile';
import {
  remainingAfterPause,
  resolveToastDuration,
  resolveToastPlacement,
  shouldShowCloseButton,
  shouldSwipeDismiss,
  stackDirection,
  visibleToasts,
  type ToastPlacement,
} from './toastLogic';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastProps {
  message: string;
  type?: ToastType;
  /** Auto-dismiss in ms; 0 = stays until closed. Defaults per type (info/success 4 s, warning 7 s, error stays). */
  duration?: number;
  onClose: () => void;
  /** Defaults to true when the toast does not auto-dismiss, so it can always be closed. */
  showCloseButton?: boolean;
  /** Defaults to `top-center` on phones and `bottom-right` elsewhere. */
  position?: ToastPlacement;
  /** Optional inline action (e.g. Undo); running it also dismisses the toast. */
  action?: ToastAction;
}

// Each type maps onto a palette hue: `--chaos-<tone>`, `-tint` and `-ink`.
const toastConfig: Record<ToastType, { tone: string; Icon: React.FC<{ size?: number; style?: React.CSSProperties }> }> = {
  success: { tone: 'green', Icon: CheckCircle2 },
  error: { tone: 'danger', Icon: AlertCircle },
  warning: { tone: 'amber', Icon: AlertTriangle },
  info: { tone: 'info', Icon: Info },
};

const positionStyles: Record<ToastPlacement, React.CSSProperties> = {
  'bottom-right': { bottom: '2rem', right: '2rem' },
  'bottom-left': { bottom: '2rem', left: '2rem' },
  'top-right': { top: '2rem', right: '2rem' },
  'top-left': { top: '2rem', left: '2rem' },
  'bottom-center': { bottom: '2rem', left: '50%' },
  'top-center': { top: '2rem', left: '50%' },
};

// Each position slides in from the direction it's anchored to, and reverses
// along the same path on exit (skill: enter/exit along the same path).
const slideVariants: Record<ToastPlacement, { hidden: Record<string, number>; visible: Record<string, number> }> = {
  'bottom-right': { hidden: { x: 40, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  'top-right': { hidden: { x: 40, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  'bottom-left': { hidden: { x: -40, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  'top-left': { hidden: { x: -40, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  'bottom-center': { hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1 } },
  'top-center': { hidden: { y: -40, opacity: 0 }, visible: { y: 0, opacity: 1 } },
};

const anchorStyle = (placement: ToastPlacement): React.CSSProperties => ({
  position: 'fixed',
  ...positionStyles[placement],
  transform: placement.includes('center') ? 'translateX(-50%)' : undefined,
  zIndex: 'var(--chaos-z-toast, 10001)',
  maxWidth: 'calc(100vw - 4rem)',
});

interface ToastViewProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
  showCloseButton?: boolean;
  action?: ToastAction;
  placement: ToastPlacement;
}

/** The toast card itself: timer, pause, swipe and animation. Positioning is up to the caller. */
const ToastView: React.FC<ToastViewProps> = ({ message, type, duration, onClose, showCloseButton, action, placement }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const { tone, Icon } = toastConfig[type];
  const resolvedDuration = resolveToastDuration(type, duration);
  const closable = shouldShowCloseButton(showCloseButton, resolvedDuration);
  const paused = hovered || focused;

  // onClose is read through a ref rather than being a dependency below.
  // Callers commonly pass an inline arrow (e.g. ToastContainer's
  // `onClose={() => onRemove(toast.id)}`), which is a new function every
  // render — if it were a dependency, any re-render of the page while a
  // toast is visible (routine here: polling, typing, pagination, ...)
  // would tear down and restart the auto-dismiss timer, so the toast could
  // outlive `duration` indefinitely instead of dismissing on schedule.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Hovering or focusing the toast pauses the timer; leaving resumes it with
  // the time that was left, not a fresh `duration`.
  const remainingRef = useRef(resolvedDuration);
  const startedAtRef = useRef(0);
  useEffect(() => {
    remainingRef.current = resolvedDuration;
  }, [resolvedDuration]);

  useEffect(() => {
    if (resolvedDuration <= 0 || paused) return;
    startedAtRef.current = Date.now();
    const timer = setTimeout(() => setIsVisible(false), remainingRef.current);
    return () => {
      clearTimeout(timer);
      remainingRef.current = remainingAfterPause(remainingRef.current, startedAtRef.current, Date.now());
    };
  }, [resolvedDuration, paused]);

  const handleClose = () => setIsVisible(false);
  const variants = slideVariants[placement];
  const isError = type === 'error';

  return (
    <AnimatePresence onExitComplete={() => onCloseRef.current()}>
      {isVisible && (
        <motion.div
          layout
          style={{
            position: 'relative',
            padding: '1rem 1.5rem',
            paddingRight: closable ? '3.25rem' : '1.5rem',
            // Dark tints are translucent, so they sit on an opaque surface to stay readable over page content.
            backgroundColor: 'var(--chaos-surface-elevated)',
            backgroundImage: `linear-gradient(var(--chaos-${tone}-tint), var(--chaos-${tone}-tint))`,
            border: `2px solid var(--chaos-${tone})`,
            borderRadius: 'var(--chaos-radius-lg)',
            boxShadow: `3px 4px 0 color-mix(in srgb, var(--chaos-${tone}) 80%, black), var(--chaos-elevation-float)`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontFamily: 'var(--chaos-font-body, "Inter", "Roboto", Arial, sans-serif)',
            fontWeight: 600,
            color: `var(--chaos-${tone}-ink)`,
            maxWidth: 'calc(100vw - 4rem)',
            pointerEvents: 'auto',
            touchAction: 'pan-y',
          }}
          initial={variants.hidden}
          animate={variants.visible}
          exit={{ ...variants.hidden, transition: { duration: timings.exit / 1000, ease: 'easeIn' } }}
          transition={{
            default: { type: 'spring', bounce: 0, duration: timings.enter / 1000 },
            layout: { type: 'spring', ...springs.toast },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5}
          onDragEnd={(_, info) => {
            if (shouldSwipeDismiss(info.offset.x, info.velocity.x)) handleClose();
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
          }}
          role={isError ? 'alert' : 'status'}
          aria-live={isError ? 'assertive' : 'polite'}
        >
          <Icon size={20} style={{ flexShrink: 0 }} />
          <span style={{ lineHeight: 1.4 }}>{message}</span>
          {action && (
            <button
              type="button"
              className="chaos-toast__action"
              onClick={() => {
                action.onClick();
                handleClose();
              }}
            >
              {action.label}
            </button>
          )}
          {closable && (
            <button type="button" className="chaos-toast__close" onClick={handleClose} aria-label="Schließen">
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration,
  onClose,
  showCloseButton,
  position,
  action,
}) => {
  const isMobile = useIsMobile();
  const placement = resolveToastPlacement(position, isMobile);

  const toastElement = (
    <MotionConfig reducedMotion="user">
      <div style={anchorStyle(placement)}>
        <ToastView
          message={message}
          type={type}
          duration={duration}
          onClose={onClose}
          showCloseButton={showCloseButton}
          action={action}
          placement={placement}
        />
      </div>
    </MotionConfig>
  );

  return createPortal(toastElement, document.body);
};

// Toast Container for managing multiple toasts
export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: ToastAction;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
  /** Defaults to `top-center` on phones and `bottom-right` elsewhere. */
  position?: ToastProps['position'];
  /** How many toasts show at once; the rest queue until a slot frees. */
  maxVisible?: number;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  position,
  maxVisible = 3,
}) => {
  const isMobile = useIsMobile();
  const placement = resolveToastPlacement(position, isMobile);
  const shown = visibleToasts(toasts, maxVisible);
  const align = placement.includes('center') ? 'center' : placement.includes('right') ? 'flex-end' : 'flex-start';

  return createPortal(
    <MotionConfig reducedMotion="user">
      {/* One fixed stack: newest toast at the screen edge, older ones pushed inward by the spring layout. */}
      <div
        style={{
          ...anchorStyle(placement),
          display: 'flex',
          flexDirection: stackDirection(placement),
          alignItems: align,
          gap: '0.75rem',
          pointerEvents: 'none',
        }}
      >
        {shown.map((toast) => (
          <ToastView
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            action={toast.action}
            onClose={() => onRemove(toast.id)}
            placement={placement}
          />
        ))}
      </div>
    </MotionConfig>,
    document.body,
  );
};

// Hook for easy toast management
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // `duration` stays undefined unless the caller passes one, so each type keeps its own default timing.
  const addToast = (message: string, type: ToastType = 'info', duration?: number, action?: ToastAction) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type, duration, action }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (message: string, duration?: number, action?: ToastAction) => addToast(message, 'success', duration, action);
  const error = (message: string, duration?: number, action?: ToastAction) => addToast(message, 'error', duration, action);
  const warning = (message: string, duration?: number, action?: ToastAction) => addToast(message, 'warning', duration, action);
  const info = (message: string, duration?: number, action?: ToastAction) => addToast(message, 'info', duration, action);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
};
