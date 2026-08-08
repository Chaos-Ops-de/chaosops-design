import React, { useEffect, useRef } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useUnsavedChangesGuard } from '../useUnsavedChangesGuard';
import { UnsavedChangesPrompt } from '../UnsavedChangesPrompt';
import { usePalette } from '../../theme/ThemeContext';
import { DialogOverlay, DialogCard, DialogCloseButton, DialogButton } from './DialogPrimitives';
import { useFocusTrap, useScrollLock } from './useFocusTrap';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  showCloseButton?: boolean;
  maxWidth?: string;
  /** When true, input changes inside the modal are tracked. Closing while dirty shows a confirmation dialog. */
  confirmOnClose?: boolean;
  unsavedChangesTitle?: string;
  unsavedChangesMessage?: string;
  discardText?: string;
  keepEditingText?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  type = 'info',
  showCloseButton = true,
  maxWidth = '500px',
  confirmOnClose = false,
  unsavedChangesTitle = 'Ungespeicherte Änderungen',
  unsavedChangesMessage = 'Du hast ungespeicherte Änderungen. Wenn du jetzt schließt, gehen sie verloren.',
  discardText = 'Verwerfen',
  keepEditingText = 'Weiterbearbeiten',
}) => {
  const palette = usePalette();
  const cardRef = useRef<HTMLDivElement>(null);
  const { showConfirm, guardedClose, confirmClose, cancelConfirm, dirtyTrackingProps } = useUnsavedChangesGuard({
    enabled: confirmOnClose && isOpen,
  });

  useScrollLock(isOpen);
  useFocusTrap(isOpen && !showConfirm, cardRef);

  const handleClose = () => guardedClose(onClose);

  // ESC key (guarded close)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} color={palette.green} aria-hidden="true" />;
      case 'error':
        return <AlertCircle size={24} color={palette.danger} aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle size={24} color={palette.amber} aria-hidden="true" />;
      default:
        return <Info size={24} color={palette.info} aria-hidden="true" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return palette.green;
      case 'error':
        return palette.danger;
      case 'warning':
        return palette.amber;
      default:
        return palette.info;
    }
  };

  return (
    <>
      <MotionConfig reducedMotion="user">
        <AnimatePresence>
          {isOpen && (
            <DialogOverlay onClick={handleClose} role="dialog" aria-modal="true">
              <DialogCard ref={cardRef} maxWidth={maxWidth} onClick={(e) => e.stopPropagation()}>
                {/* Decorative tape */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '40%',
                    width: '90px',
                    height: '28px',
                    background: `repeating-linear-gradient(92deg, transparent 0px, rgba(255,255,255,0.12) 1px, transparent 2px, transparent 5px), linear-gradient(105deg, rgba(255,255,255,0.22) 0%, transparent 30%, transparent 55%, rgba(255,255,255,0.18) 70%, transparent 85%), linear-gradient(180deg, color-mix(in srgb, ${getTypeColor()} 85%, white) 0%, ${getTypeColor()} 40%, color-mix(in srgb, ${getTypeColor()} 90%, #806030) 100%)`,
                    borderRadius: '1px',
                    border: 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 1px rgba(0,0,0,0.08), inset 0 0 8px rgba(0,0,0,0.06)',
                    opacity: 0.82,
                    transform: 'translateX(-50%) rotate(-2.5deg)',
                    zIndex: 10,
                    clipPath: 'polygon(0% 8%, 2% 0%, 5% 12%, 8% 2%, 12% 6%, 15% 0%, 18% 10%, 22% 3%, 100% 0%, 100% 5%, 98% 14%, 100% 28%, 99% 45%, 100% 62%, 98% 78%, 100% 90%, 99% 100%, 22% 100%, 18% 92%, 15% 100%, 12% 95%, 8% 100%, 5% 90%, 2% 100%, 0% 94%, 1% 78%, 0% 60%, 1% 42%, 0% 25%)',
                  }}
                />

                {/* Header */}
                {(title || showCloseButton) && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.5rem 1.5rem 1rem',
                      borderBottom: `2px dashed var(--chaos-tab-bar-border)`,
                    }}
                  >
                    {title && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {getIcon()}
                        <h2
                          style={{
                            fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: 'var(--chaos-ink)',
                            margin: 0,
                          }}
                        >
                          {title}
                        </h2>
                      </div>
                    )}
                    {showCloseButton && <DialogCloseButton onClick={handleClose} aria-label="Modal schließen" />}
                  </div>
                )}

                {/* Content */}
                <div {...dirtyTrackingProps} style={{ padding: '1.5rem' }}>
                  {children}
                </div>
              </DialogCard>
            </DialogOverlay>
          )}
        </AnimatePresence>
      </MotionConfig>

      <UnsavedChangesPrompt
        show={showConfirm}
        title={unsavedChangesTitle}
        message={unsavedChangesMessage}
        confirmText={discardText}
        cancelText={keepEditingText}
        onConfirm={confirmClose}
        onCancel={cancelConfirm}
      />
    </>
  );
};

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Bestätigen',
  cancelText = 'Abbrechen',
  type = 'warning',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} type={type} showCloseButton={false}>
      <div style={{ marginBottom: '1.5rem' }}>
        <p
          style={{
            fontFamily: '"Inter", "Roboto", Arial, sans-serif',
            fontSize: '1rem',
            color: 'var(--chaos-ink-muted)',
            lineHeight: '1.6',
            margin: 0,
          }}
        >
          {message}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <DialogButton variant="secondary" onClick={onClose}>
          {cancelText}
        </DialogButton>
        <DialogButton variant={type === 'error' ? 'danger' : 'primary'} onClick={handleConfirm}>
          {confirmText}
        </DialogButton>
      </div>
    </Modal>
  );
};

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  buttonText?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, title, message, type = 'info', buttonText = 'OK' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} type={type} showCloseButton={false}>
      <div style={{ marginBottom: '1.5rem' }}>
        <p
          style={{
            fontFamily: '"Inter", "Roboto", Arial, sans-serif',
            fontSize: '1rem',
            color: 'var(--chaos-ink-muted)',
            lineHeight: '1.6',
            margin: 0,
          }}
        >
          {message}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <DialogButton variant="primary" onClick={onClose}>
          {buttonText}
        </DialogButton>
      </div>
    </Modal>
  );
};
