import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useUnsavedChangesGuard } from '../useUnsavedChangesGuard';
import { UnsavedChangesPrompt } from '../UnsavedChangesPrompt';
import { usePalette } from '../../theme/ThemeContext';
import { DialogOverlay, DialogCard, DialogCloseButton, DialogButton } from './DialogPrimitives';
import { useFocusTrap, useScrollLock } from './useFocusTrap';
import { Input } from '../Input';
import { Tape } from '../Tape';

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
  const titleId = useId();
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
            <DialogOverlay onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined}>
              <DialogCard ref={cardRef} maxWidth={maxWidth} onClick={(e) => e.stopPropagation()}>
                {/* Decorative tape */}
                <Tape color={getTypeColor()} style={{ left: '40%' }} />

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
                          id={titleId}
                          style={{
                            fontFamily: 'var(--chaos-font-display, "Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif)',
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
            fontFamily: 'var(--chaos-font-body, "Inter", "Roboto", Arial, sans-serif)',
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
            fontFamily: 'var(--chaos-font-body, "Inter", "Roboto", Arial, sans-serif)',
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

interface PromptModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  placeholder: string;
  initialValue?: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** Shown when the user submits an empty value. */
  emptyError?: string;
  /** Fallback message when `onSubmit` rejects with an error that has no message. */
  failedError?: string;
  inputProps?: Pick<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'inputMode' | 'autoCapitalize' | 'autoComplete' | 'maxLength'>;
  /** Extra controls rendered between the input and the buttons (e.g. a role picker). */
  children?: React.ReactNode;
  onCancel: () => void;
  /** Resolves when done; rejects with an Error whose message is shown inside the card. */
  onSubmit: (value: string) => Promise<void>;
}

/** Single-input dialog (rename, invite by email, new zone ...). */
export const PromptModal: React.FC<PromptModalProps> = ({
  isOpen, title, message, placeholder, initialValue = '', confirmLabel, cancelLabel = 'Abbrechen',
  emptyError = 'Bitte gib etwas ein.', failedError = 'Das hat nicht geklappt. Bitte versuch es erneut.',
  inputProps, children, onCancel, onSubmit,
}) => {
  const [value, setValue] = useState(initialValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start fresh every time the dialog opens.
  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
      setError(null);
    }
  }, [isOpen, initialValue]);

  const close = () => {
    if (!busy) onCancel();
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return setError(emptyError);
    setError(null);
    setBusy(true);
    try {
      await onSubmit(trimmed);
    } catch (err) {
      setError((err as Error | undefined)?.message || failedError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title={title} showCloseButton={false}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {message && (
          <p style={{ fontFamily: 'var(--chaos-font-body, "Inter", "Roboto", Arial, sans-serif)', fontSize: '1rem', color: 'var(--chaos-ink-muted)', lineHeight: 1.6, margin: 0 }}>
            {message}
          </p>
        )}
        <Input
          autoFocus
          autoCorrect="off"
          placeholder={placeholder}
          aria-label={placeholder}
          value={value}
          disabled={busy}
          onChange={(e) => setValue(e.target.value)}
          {...inputProps}
        />
        {children}
        {error && <p role="alert" style={{ color: 'var(--chaos-danger)', fontSize: '0.875rem', margin: 0 }}>{error}</p>}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <DialogButton type="button" variant="secondary" onClick={close} disabled={busy}>
            {cancelLabel}
          </DialogButton>
          <DialogButton type="submit" variant="primary" disabled={busy}>
            {confirmLabel}
          </DialogButton>
        </div>
      </form>
    </Modal>
  );
};
