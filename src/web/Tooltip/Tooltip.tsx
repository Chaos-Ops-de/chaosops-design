import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { placeTooltip, type TooltipPlacement, type TooltipPosition } from './tooltipLogic';
import './Tooltip.css';

export interface TooltipProps {
  /** One short sentence — a hint, not documentation. */
  content: string;
  /** Preferred side; flips to the opposite one when it would be clipped. */
  placement?: TooltipPlacement;
  /** Wait before showing, in ms, so a cursor passing by doesn't fire it (default 300). */
  delay?: number;
  disabled?: boolean;
  /** A single element that can receive handlers and `aria-describedby` (a button, an icon button, …). */
  children: React.ReactElement<TriggerProps>;
}

interface TriggerProps {
  'aria-describedby'?: string;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
  onFocus?: React.FocusEventHandler;
  onBlur?: React.FocusEventHandler;
  onPointerDown?: React.PointerEventHandler;
}

// Touch devices fire emulated mouse events after a tap; ignore them for this long.
const TOUCH_MOUSE_GRACE_MS = 600;
const ARROW_GAP = 10;

/**
 * Hover/focus hint for a control. Shows after a short delay; dismisses on
 * mouse leave, Escape, blur and a tap or press outside. A tap on touch toggles
 * it. The bubble is portalled, never takes pointer events, and flips or slides
 * so the viewport edge never clips it.
 */
export const Tooltip: React.FC<TooltipProps> = ({ content, placement = 'top', delay = 300, disabled = false, children }) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<TooltipPosition | null>(null);
  const triggerEl = useRef<HTMLElement | null>(null);
  const tooltipEl = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastTouch = useRef(0);

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = undefined;
  };

  const show = (el: HTMLElement, immediate = false) => {
    triggerEl.current = el;
    clearTimer();
    if (disabled) return;
    if (immediate || delay <= 0) setOpen(true);
    else timer.current = setTimeout(() => setOpen(true), delay);
  };

  const hide = () => {
    clearTimer();
    setOpen(false);
    setPos(null);
  };

  useEffect(() => clearTimer, []);
  useEffect(() => { if (disabled) hide(); }, [disabled]);

  // Measure the rendered bubble and place it; keep it placed on scroll/resize.
  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const trigger = triggerEl.current;
      const tip = tooltipEl.current;
      if (!trigger || !tip) return;
      const r = trigger.getBoundingClientRect();
      setPos(placeTooltip({
        placement,
        trigger: { left: r.left, top: r.top, width: r.width, height: r.height },
        tooltip: { width: tip.offsetWidth, height: tip.offsetHeight },
        viewport: { width: window.innerWidth, height: window.innerHeight },
        gap: ARROW_GAP,
      }));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, placement, content]);

  // Escape, and a press anywhere outside the trigger and bubble, dismiss it.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') hide(); };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (triggerEl.current?.contains(target) || tooltipEl.current?.contains(target)) return;
      hide();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const child = children;
  const own = child.props;
  const recentTouch = () => Date.now() - lastTouch.current < TOUCH_MOUSE_GRACE_MS;

  const trigger = React.cloneElement(child, {
    'aria-describedby': [own['aria-describedby'], open ? id : undefined].filter(Boolean).join(' ') || undefined,
    onMouseEnter: (e: React.MouseEvent) => {
      own.onMouseEnter?.(e);
      if (!recentTouch()) show(e.currentTarget as HTMLElement);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      own.onMouseLeave?.(e);
      if (!recentTouch()) hide();
    },
    onFocus: (e: React.FocusEvent) => {
      own.onFocus?.(e);
      show(e.currentTarget as HTMLElement);
    },
    onBlur: (e: React.FocusEvent) => {
      own.onBlur?.(e);
      hide();
    },
    onPointerDown: (e: React.PointerEvent) => {
      own.onPointerDown?.(e);
      if (e.pointerType !== 'touch') return;
      lastTouch.current = Date.now();
      if (open) hide();
      else show(e.currentTarget as HTMLElement, true);
    },
  });

  return (
    <>
      {trigger}
      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={tooltipEl}
          id={id}
          role="tooltip"
          className={`chaos-tooltip chaos-tooltip--${pos?.placement ?? placement}`}
          style={{
            left: pos?.left ?? 0,
            top: pos?.top ?? 0,
            visibility: pos ? 'visible' : 'hidden',
            ['--chaos-tooltip-arrow' as string]: `${pos?.arrowOffset ?? 0}px`,
          }}
        >
          {content}
        </div>,
        document.body,
      )}
    </>
  );
};
