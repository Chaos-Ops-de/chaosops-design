import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { X } from 'lucide-react';
import { useFocusTrap, useScrollLock } from '../Modal/useFocusTrap';
import { useIsMobile } from '../useIsMobile';
import { timings } from '../../tokens/motion';
import { clampDrawerWidth, drawerSlideOffset, type DrawerSide } from './drawerLogic';
import './Drawer.css';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** `end` (default) is the right edge in left-to-right text and the left edge in right-to-left. */
  side?: DrawerSide;
  /** Preferred width in px; held between 320 px and 40% of the viewport. */
  width?: number;
  /** Set to false when children render their own full-bleed padding. */
  padded?: boolean;
  /** Accessible name when there is no visible title. */
  ariaLabel?: string;
  className?: string;
}

function useViewportWidth(): number {
  const [width, setWidth] = useState(() => (typeof window === 'undefined' ? 1024 : window.innerWidth));
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return width;
}

/** Reads the text direction when the drawer opens, so `start`/`end` and the slide follow it. */
function useIsRtl(isOpen: boolean): boolean {
  const [rtl, setRtl] = useState(false);
  useLayoutEffect(() => {
    if (isOpen) setRtl(getComputedStyle(document.body).direction === 'rtl');
  }, [isOpen]);
  return rtl;
}

/**
 * Side panel for a list or form that should stay readable next to the page
 * (a changelog, the documents of an event). Modal like a Modal: the page is
 * dimmed behind a scrim, focus is trapped and returns to the opener on close,
 * Escape and a click on the scrim close it. On a phone it fills the width; for
 * a bottom-anchored panel on mobile use `Sheet` instead.
 */
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  side = 'end',
  width,
  padded = true,
  ariaLabel,
  className,
}) => {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const narrow = useIsMobile();
  const viewportWidth = useViewportWidth();
  const rtl = useIsRtl(isOpen);

  useScrollLock(isOpen);
  useFocusTrap(isOpen, panelRef);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  const offset = drawerSlideOffset(side, rtl);
  const panelWidth = narrow ? '100%' : clampDrawerWidth(viewportWidth, width);

  return createPortal(
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chaos-drawer-scrim"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: timings.exit / 1000 } }}
            transition={{ duration: timings.enter / 1000 }}
            onClick={onClose}
          >
            <motion.aside
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? titleId : undefined}
              aria-label={title ? undefined : ariaLabel}
              tabIndex={-1}
              className={['chaos-drawer', `chaos-drawer--${side}`, className].filter(Boolean).join(' ')}
              style={{ width: panelWidth }}
              onClick={(e) => e.stopPropagation()}
              initial={{ x: offset }}
              animate={{ x: 0 }}
              exit={{ x: offset, transition: { duration: timings.exit / 1000, ease: 'easeIn' } }}
              transition={{ type: 'spring', bounce: 0, duration: timings.enter / 1000 }}
            >
              <header className="chaos-drawer__header">
                {title && <h2 id={titleId} className="chaos-drawer__title">{title}</h2>}
                <button type="button" className="chaos-drawer__close" onClick={onClose} aria-label="Schließen">
                  <X size={20} aria-hidden="true" />
                </button>
              </header>
              <div className={['chaos-drawer__body', padded ? 'chaos-drawer__body--padded' : ''].filter(Boolean).join(' ')}>
                {children}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>,
    document.body,
  );
};
