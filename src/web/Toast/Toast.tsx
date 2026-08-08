import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number; // in ms, 0 = no auto-dismiss
  onClose: () => void;
  showCloseButton?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center' | 'top-center';
}

const toastConfig: Record<ToastType, { background: string; border: string; shadow: string; color: string; Icon: React.FC<{ size?: number; style?: React.CSSProperties }> }> = {
  success: {
    background: 'light-dark(#dcfce7, #103322)',
    border: '#22c55e',
    shadow: '#16a34a',
    color: 'light-dark(#166534, #86efac)',
    Icon: CheckCircle2,
  },
  error: {
    background: 'light-dark(#fef2f2, #3a1414)',
    border: '#ef4444',
    shadow: '#dc2626',
    color: 'light-dark(#dc2626, #fca5a5)',
    Icon: AlertCircle,
  },
  warning: {
    background: 'light-dark(#fffbeb, #3a2a0a)',
    border: '#f59e0b',
    shadow: '#d97706',
    color: 'light-dark(#92400e, #fcd34d)',
    Icon: AlertTriangle,
  },
  info: {
    background: 'light-dark(#eff6ff, #0f2a44)',
    border: '#3b82f6',
    shadow: '#2563eb',
    color: 'light-dark(#1e40af, #93c5fd)',
    Icon: Info,
  },
};

type ToastPosition = NonNullable<ToastProps['position']>;

const positionStyles: Record<ToastPosition, React.CSSProperties> = {
  'bottom-right': { bottom: '2rem', right: '2rem' },
  'bottom-left': { bottom: '2rem', left: '2rem' },
  'top-right': { top: '2rem', right: '2rem' },
  'top-left': { top: '2rem', left: '2rem' },
  'bottom-center': { bottom: '2rem', left: '50%' },
  'top-center': { top: '2rem', left: '50%' },
};

// Each position slides in from the direction it's anchored to, and reverses
// along the same path on exit (skill: enter/exit along the same path).
const slideVariants: Record<ToastPosition, { hidden: Record<string, number>; visible: Record<string, number> }> = {
  'bottom-right': { hidden: { x: 40, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  'top-right': { hidden: { x: 40, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  'bottom-left': { hidden: { x: -40, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  'top-left': { hidden: { x: -40, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  'bottom-center': { hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1 } },
  'top-center': { hidden: { y: -40, opacity: 0 }, visible: { y: 0, opacity: 1 } },
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  showCloseButton = false,
  position = 'bottom-right',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const config = toastConfig[type];
  const Icon = config.Icon;

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

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => setIsVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => setIsVisible(false);
  const variants = slideVariants[position];
  const posStyle = positionStyles[position];
  const centered = position.includes('center');

  const toastElement = (
    <MotionConfig reducedMotion="user">
      <AnimatePresence onExitComplete={() => onCloseRef.current()}>
        {isVisible && (
          <motion.div
            style={{
              position: 'fixed',
              ...posStyle,
              translateX: centered ? '-50%' : undefined,
              padding: '1rem 1.5rem',
              paddingRight: showCloseButton ? '3rem' : '1.5rem',
              background: config.background,
              border: `2px solid ${config.border}`,
              borderRadius: '12px',
              boxShadow: `3px 4px 0 ${config.shadow}, 0 4px 12px rgba(0,0,0,0.15)`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              zIndex: 10000,
              fontFamily: '"Inter", "Roboto", Arial, sans-serif',
              fontWeight: 600,
              color: config.color,
              maxWidth: 'calc(100vw - 4rem)',
            }}
            initial={variants.hidden}
            animate={variants.visible}
            exit={variants.hidden}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            role="status"
            aria-live="polite"
          >
            <Icon size={20} style={{ flexShrink: 0 }} />
            <span style={{ lineHeight: 1.4 }}>{message}</span>
            {showCloseButton && (
              <button
                onClick={handleClose}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '0.75rem',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: config.color,
                  opacity: 0.7,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}
                aria-label="Schließen"
              >
                <X size={16} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
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
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
  position?: ToastProps['position'];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  position = 'bottom-right',
}) => {
  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            position: 'fixed',
            ...(position.includes('bottom')
              ? { bottom: `calc(2rem + ${index * 5}rem)` }
              : { top: `calc(2rem + ${index * 5}rem)` }),
            ...(position.includes('right') && { right: '2rem' }),
            ...(position.includes('left') && { left: '2rem' }),
            ...(position.includes('center') && { left: '50%', transform: 'translateX(-50%)' }),
            zIndex: 10000 - index,
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => onRemove(toast.id)}
            position={position}
          />
        </div>
      ))}
    </>
  );
};

// Hook for easy toast management
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (message: string, duration?: number) => addToast(message, 'success', duration);
  const error = (message: string, duration?: number) => addToast(message, 'error', duration);
  const warning = (message: string, duration?: number) => addToast(message, 'warning', duration);
  const info = (message: string, duration?: number) => addToast(message, 'info', duration);

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
