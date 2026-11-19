import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Sheet } from '../Sheet';
import { useIsMobile } from '../useIsMobile';
import { placeTooltip } from '../Tooltip/tooltipLogic';

export interface PickerShellProps {
  /** Accessible name of the trigger and title of the phone sheet. */
  label: string;
  /** The formatted value, or `null` to show the placeholder. */
  text: string | null;
  placeholder: string;
  disabled?: boolean;
  id?: string;
  /** Forces the phone layout (or the desktop one) instead of reading the viewport. */
  mobile?: boolean;
  className?: string;
  /** Renders the panel. It is mounted only while open, so its state starts fresh each time. */
  children: (api: { close: () => void; mobile: boolean }) => React.ReactNode;
}

/**
 * Trigger button plus the panel it opens: a popover under the trigger on
 * desktop (flips and clamps to stay on screen, closes on outside click or
 * Escape and hands focus back), and the package Sheet, full width, on phones.
 */
export const PickerShell: React.FC<PickerShellProps> = ({
  label, text, placeholder, disabled = false, id, mobile: forceMobile, className, children,
}) => {
  const isMobileViewport = useIsMobile();
  const mobile = forceMobile ?? isMobileViewport;
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const place = useCallback(() => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return;
    const t = trigger.getBoundingClientRect();
    const next = placeTooltip({
      placement: 'bottom',
      trigger: { left: t.left, top: t.top, width: t.width, height: t.height },
      tooltip: { width: panel.offsetWidth, height: panel.offsetHeight },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      gap: 6,
      margin: 8,
    });
    setPos({ left: next.left, top: next.top });
  }, []);

  // Measure before paint so the panel never flashes at the wrong place.
  useLayoutEffect(() => {
    if (!open || mobile) return;
    place();
  }, [open, mobile, place]);

  useEffect(() => {
    if (!open || mobile) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, mobile, close, place]);

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={['chaos-datepicker__trigger', className].filter(Boolean).join(' ')}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open && !mobile ? panelId : undefined}
        aria-label={text ? `${label}: ${text}` : label}
        data-empty={text === null || undefined}
        onClick={() => {
          setPos(null);
          setOpen((v) => !v);
        }}
      >
        <CalendarIcon size={18} aria-hidden="true" />
        <span className="chaos-datepicker__value">{text ?? placeholder}</span>
      </button>

      {open && mobile && (
        <Sheet isOpen onClose={close} title={label} padded={false}>
          {children({ close, mobile: true })}
        </Sheet>
      )}

      {open && !mobile && createPortal(
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={label}
          className="chaos-datepicker__panel"
          style={{ left: pos?.left ?? 0, top: pos?.top ?? 0, visibility: pos ? 'visible' : 'hidden' }}
        >
          {children({ close, mobile: false })}
        </div>,
        document.body,
      )}
    </>
  );
};
