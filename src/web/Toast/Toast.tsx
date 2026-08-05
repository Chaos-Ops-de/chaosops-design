import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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

const toastConfig = {
  success: {
    background: '#dcfce7',
    border: '#22c55e',
    shadow: '#16a34a',
    color: '#166534',
    Icon: CheckCircle2,
  },
  error: {
    background: '#fef2f2',
    border: '#ef4444',
    shadow: '#dc2626',
    color: '#dc2626',
    Icon: AlertCircle,
  },
  warning: {
    background: '#fffbeb',
    border: '#f59e0b',
    shadow: '#d97706',
    color: '#92400e',
    Icon: AlertTriangle,
  },
  info: {
    background: '#eff6ff',
    border: '#3b82f6',
    shadow: '#2563eb',
    color: '#1e40af',
    Icon: Info,
  },
};

const positionStyles: Record<string, React.CSSProperties> = {
  'bottom-right': { bottom: '2rem', right: '2rem' },
  'bottom-left': { bottom: '2rem', left: '2rem' },
  'top-right': { top: '2rem', right: '2rem' },
  'top-left': { top: '2rem', left: '2rem' },
  'bottom-center': { bottom: '2rem', left: '50%', transform: 'translateX(-50%)' },
  'top-center': { top: '2rem', left: '50%', transform: 'translateX(-50%)' },
};

const animationKeyframes: Record<string, string> = {
  'bottom-right': 'slideInRight',
  'bottom-left': 'slideInLeft',
  'top-right': 'slideInRight',
  'top-left': 'slideInLeft',
  'bottom-center': 'slideInUp',
  'top-center': 'slideInDown',
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  showCloseButton = false,
  position = 'bottom-right',
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const config = toastConfig[type];
  const Icon = config.Icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onClose, 200);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 200);
  };

  const animation = animationKeyframes[position];
  const posStyle = positionStyles[position];

  const toastElement = (
    <div
      style={{
        position: 'fixed',
        ...posStyle,
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
        animation: isExiting ? 'fadeOut 0.2s ease forwards' : `${animation} 0.3s ease`,
        fontFamily: '"Inter", "Roboto", Arial, sans-serif',
        fontWeight: 600,
        color: config.color,
        maxWidth: 'calc(100vw - 4rem)',
      }}
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
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInUp {
          from { transform: translateX(-50%) translateY(100%); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes slideInDown {
          from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
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
