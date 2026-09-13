import React, { forwardRef } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import './Modal.css';

/**
 * Shared chrome for every dialog-like surface in the package (Modal,
 * UnsavedChangesPrompt, and anything else that needs an overlay + a
 * flipchart "sticker card"). Motion-driven so enter AND exit animate
 * (previously only enter did — dialogs just unmounted on close), and
 * respects prefers-reduced-motion via the MotionConfig wrapper each
 * consumer applies at its root.
 */

interface DialogOverlayProps extends Omit<React.ComponentProps<typeof motion.div>, 'style'> {
  zIndex?: number;
  style?: React.CSSProperties;
}

export const DialogOverlay = forwardRef<HTMLDivElement, DialogOverlayProps>(function DialogOverlay(
  { children, style, zIndex = 9999, ...props },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      className="dlg-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex,
        padding: '4rem 1rem',
        overflowY: 'auto',
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

interface DialogCardProps extends Omit<React.ComponentProps<typeof motion.div>, 'style'> {
  maxWidth?: string;
  rotate?: number;
  style?: React.CSSProperties;
}

export const DialogCard = forwardRef<HTMLDivElement, DialogCardProps>(function DialogCard(
  { children, maxWidth = '500px', rotate = -0.3, style, ...props },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      className="dlg-card"
      tabIndex={-1}
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
      style={{
        background: 'var(--chaos-surface-elevated)',
        margin: 'auto',
        borderRadius: 'var(--chaos-radius-xl)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3), 4px 8px 0 rgba(0,0,0,0.1)',
        border: '3px solid var(--chaos-border)',
        maxWidth,
        width: '100%',
        position: 'relative',
        rotate: `${rotate}deg`,
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

interface DialogCloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const DialogCloseButton: React.FC<DialogCloseButtonProps> = ({ 'aria-label': ariaLabel = 'Schließen', ...props }) => (
  <button className="dlg-close-btn" aria-label={ariaLabel} {...props}>
    <X size={24} aria-hidden="true" />
  </button>
);

interface DialogButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'secondary';
}

export const DialogButton: React.FC<DialogButtonProps> = ({ variant = 'secondary', className, ...props }) => (
  <button className={`dlg-btn dlg-btn--${variant}${className ? ` ${className}` : ''}`} {...props} />
);
