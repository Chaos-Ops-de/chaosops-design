import React from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import { usePalette } from '../../theme/ThemeContext';
import { DialogOverlay, DialogCard, DialogButton } from '../Modal/DialogPrimitives';
import { useFocusTrap, useScrollLock } from '../Modal/useFocusTrap';

interface UnsavedChangesPromptProps {
  show: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UnsavedChangesPrompt: React.FC<UnsavedChangesPromptProps> = ({
  show,
  title = 'Ungespeicherte Änderungen',
  message = 'Du hast ungespeicherte Änderungen. Wenn du jetzt schließt, gehen sie verloren.',
  confirmText = 'Verwerfen',
  cancelText = 'Weiterbearbeiten',
  onConfirm,
  onCancel,
}) => {
  const palette = usePalette();
  const cardRef = React.useRef<HTMLDivElement>(null);

  useScrollLock(show);
  useFocusTrap(show, cardRef);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {show && (
          // Stacks above a parent Modal's overlay (zIndex 9999) since this
          // confirms discarding changes in an already-open dialog.
          <DialogOverlay onClick={onCancel} zIndex={10000} role="alertdialog" aria-modal="true">
            <DialogCard ref={cardRef} maxWidth="420px" rotate={0.2} onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem', margin: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <AlertTriangle size={24} color={palette.amber} aria-hidden="true" />
                <h3
                  style={{
                    fontFamily: '"Gloria Hallelujah", "Caveat", cursive, sans-serif',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: 'var(--chaos-ink)',
                    margin: 0,
                  }}
                >
                  {title}
                </h3>
              </div>

              <p
                style={{
                  fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                  fontSize: '0.95rem',
                  color: 'var(--chaos-ink-muted)',
                  lineHeight: '1.6',
                  margin: '0 0 1.5rem',
                }}
              >
                {message}
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <DialogButton variant="secondary" onClick={onCancel}>
                  {cancelText}
                </DialogButton>
                <DialogButton variant="primary" onClick={onConfirm}>
                  {confirmText}
                </DialogButton>
              </div>
            </DialogCard>
          </DialogOverlay>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
};
