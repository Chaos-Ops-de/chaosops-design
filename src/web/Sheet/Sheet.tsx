import React, { useRef } from 'react';
import { motion, AnimatePresence, MotionConfig, useReducedMotion, useDragControls, type PanInfo } from 'motion/react';
import { X } from 'lucide-react';
import { useFocusTrap, useScrollLock } from '../Modal/useFocusTrap';
import { useMediaQuery } from '../Modal/useMediaQuery';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  maxWidth?: string;
  /** Accessible name when there's no visible title. */
  ariaLabel?: string;
  /** Set to false when children render their own full-bleed header/padding. */
  padded?: boolean;
}

/**
 * Apple-flavored dialog primitive: a centered spring modal on desktop, and a
 * real draggable bottom sheet on mobile — 1:1 finger tracking, rubber-band
 * resistance past the top, and a velocity-projected snap-back/dismiss on
 * release (apple-design skill §5/6/9), instead of a static "no animation at
 * all on mobile" settings sheet.
 */
export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  maxWidth = '560px',
  ariaLabel,
  padded = true,
}) => {
  const isMobileViewport = useMediaQuery('(max-width: 640px)');
  const prefersReducedMotion = useReducedMotion();
  const useDragSheet = isMobileViewport && !prefersReducedMotion;

  const cardRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  useScrollLock(isOpen);
  useFocusTrap(isOpen, cardRef);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Apple's momentum-projection function (Designing Fluid Interfaces, WWDC
  // 2018): projects where a flick would come to rest, so a fast flick past
  // the dismiss threshold dismisses even with a small drag offset.
  const project = (velocity: number, decelerationRate = 0.998) => (velocity / 1000) * decelerationRate / (1 - decelerationRate);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const height = cardRef.current?.offsetHeight ?? 300;
    const projected = info.offset.y + project(info.velocity.y);
    if (projected > height * 0.35 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'var(--chaos-overlay-scrim)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: useDragSheet ? 'flex-end' : 'flex-start',
              justifyContent: 'center',
              padding: useDragSheet ? 0 : '4rem 1rem',
              overflowY: useDragSheet ? 'hidden' : 'auto',
            }}
          >
            <motion.div
              ref={cardRef}
              role="dialog"
              aria-modal="true"
              aria-label={ariaLabel}
              aria-labelledby={title ? 'sheet-title' : undefined}
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              drag={useDragSheet ? 'y' : false}
              dragListener={false}
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.2, bottom: 1 }}
              onDragEnd={useDragSheet ? handleDragEnd : undefined}
              initial={useDragSheet ? { y: '100%' } : { opacity: 0, scale: 0.95, y: -20 }}
              animate={useDragSheet ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
              exit={useDragSheet ? { y: '100%' } : { opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', bounce: useDragSheet ? 0.15 : 0, duration: 0.35 }}
              style={{
                background: 'var(--chaos-surface-elevated)',
                border: '3px solid var(--chaos-border)',
                width: '100%',
                maxWidth: useDragSheet ? '100%' : maxWidth,
                maxHeight: useDragSheet ? '88vh' : '85vh',
                overflowY: 'auto',
                position: 'relative',
                margin: useDragSheet ? 0 : 'auto',
                borderRadius: useDragSheet
                  ? 'var(--chaos-radius-xl) var(--chaos-radius-xl) 0 0'
                  : 'var(--chaos-radius-xl)',
                borderBottom: useDragSheet ? 'none' : '3px solid var(--chaos-border)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3), 4px 8px 0 rgba(0,0,0,0.1)',
              }}
            >
              {useDragSheet && (
                <div
                  aria-hidden="true"
                  onPointerDown={(e) => dragControls.start(e)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '0.75rem 0 0.5rem',
                    touchAction: 'none',
                    cursor: 'grab',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '4px',
                      borderRadius: 'var(--chaos-radius-full)',
                      background: 'var(--chaos-tab-bar-border)',
                    }}
                  />
                </div>
              )}

              {(title || showCloseButton) && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem 1rem',
                    borderBottom: '2px dashed var(--chaos-tab-bar-border)',
                  }}
                >
                  {title && (
                    <h2
                      id="sheet-title"
                      style={{
                        fontFamily: '"Gloria Hallelujah", "Caveat", "Comic Neue", cursive, sans-serif',
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        color: 'var(--chaos-ink)',
                        margin: 0,
                      }}
                    >
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      aria-label="Schließen"
                      className="sheet-close-btn"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        display: 'flex',
                        borderRadius: 'var(--chaos-radius-sm)',
                        color: 'var(--chaos-ink-muted)',
                      }}
                    >
                      <X size={22} aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}

              <div style={{ padding: padded ? '1.5rem' : 0 }}>{children}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
};
