import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { placePopover, type PopoverPlacement, type PopoverPosition } from './popoverLogic';
import './Menu.css';

export interface PopoverContext {
  /** Closes the panel and, by default, returns focus to the trigger. Pass `false` to leave focus alone. */
  close: (restoreFocus?: boolean) => void;
  /** True once the panel has been measured and placed (it can take focus from then on). */
  ready: boolean;
}

export interface PopoverProps {
  /** A single element that can receive a click: a button, an icon button, … */
  trigger: React.ReactElement<PopoverTriggerProps>;
  children: React.ReactNode | ((ctx: PopoverContext) => React.ReactNode);
  /** Controlled open state. Without it the popover keeps its own. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Preferred side and alignment; flips when it would be clipped (default `bottom-start`). */
  placement?: PopoverPlacement;
  /** Space between trigger and panel in px (default 6). */
  gap?: number;
  /** `menu` for a Menu, `dialog` (default) for free content such as a small form. */
  role?: 'dialog' | 'menu';
  'aria-label'?: string;
  /** Where focus goes on open: the first focusable (default), the panel itself, or nowhere. */
  initialFocus?: 'first' | 'panel' | 'none';
  onPanelKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  className?: string;
}

export interface PopoverTriggerProps {
  onClick?: React.MouseEventHandler;
  'aria-haspopup'?: React.AriaAttributes['aria-haspopup'];
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A panel anchored to a trigger. Opens on click, flips to the other side or
 * slides along the edge when the viewport would clip it, and closes on a press
 * outside, on Escape (focus returns to the trigger) and when focus leaves
 * both trigger and panel. It is not modal: the page behind stays usable.
 */
export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-start',
  gap = 6,
  role = 'dialog',
  'aria-label': ariaLabel,
  initialFocus = 'first',
  onPanelKeyDown,
  className,
}) => {
  const panelId = useId();
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const open = controlledOpen ?? innerOpen;
  const [pos, setPos] = useState<PopoverPosition | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };
  // Event handlers below close over the latest setOpen without re-subscribing.
  const setOpenRef = useRef(setOpen);
  setOpenRef.current = setOpen;

  const triggerEl = () => (anchorRef.current?.firstElementChild as HTMLElement | null) ?? null;

  const close = (restoreFocus = true) => {
    setOpenRef.current(false);
    if (restoreFocus) triggerEl()?.focus();
  };
  const closeRef = useRef(close);
  closeRef.current = close;

  // Measure the rendered panel and place it; keep it placed on scroll/resize.
  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const update = () => {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (!anchor || !panel) return;
      const r = anchor.getBoundingClientRect();
      setPos(placePopover({
        placement,
        trigger: { left: r.left, top: r.top, width: r.width, height: r.height },
        panel: { width: panel.offsetWidth, height: panel.offsetHeight },
        viewport: { width: window.innerWidth, height: window.innerHeight },
        gap,
        rtl: getComputedStyle(anchor).direction === 'rtl',
      }));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, placement, gap]);

  // Dismiss: Escape (returns focus), a press outside, and focus moving out of both parts.
  useEffect(() => {
    if (!open) return;
    // A submenu is portalled to <body>, outside the panel, but belongs to it: a press or focus there must not dismiss the popover.
    const inside = (target: EventTarget | null) =>
      target instanceof Node && (
        panelRef.current?.contains(target)
        || anchorRef.current?.contains(target)
        || (target instanceof Element && target.closest('[data-chaos-submenu]') !== null)
      );
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current(true);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!inside(e.target)) closeRef.current(false);
    };
    const onFocusIn = (e: FocusEvent) => {
      if (!inside(e.target)) closeRef.current(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [open]);

  // Take focus once the panel is visible (a hidden element can't be focused).
  const ready = pos !== null;
  useEffect(() => {
    if (!open || !ready || initialFocus === 'none') return;
    const panel = panelRef.current;
    if (!panel) return;
    const target = initialFocus === 'first' ? panel.querySelector<HTMLElement>(FOCUSABLE) : null;
    (target ?? panel).focus();
  }, [open, ready, initialFocus]);

  const own = trigger.props;
  const clonedTrigger = React.cloneElement(trigger, {
    onClick: (e: React.MouseEvent) => {
      own.onClick?.(e);
      setOpen(!open);
    },
    'aria-haspopup': own['aria-haspopup'] ?? (role === 'menu' ? 'menu' : 'dialog'),
    'aria-expanded': open,
    'aria-controls': open ? panelId : undefined,
  });

  const content = typeof children === 'function' ? children({ close, ready }) : children;

  return (
    <>
      <span ref={anchorRef} className="chaos-popover__anchor">{clonedTrigger}</span>
      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={panelRef}
          id={panelId}
          role={role}
          aria-label={ariaLabel}
          tabIndex={-1}
          data-side={pos?.side ?? 'bottom'}
          className={['chaos-popover', className].filter(Boolean).join(' ')}
          style={{ left: pos?.left ?? 0, top: pos?.top ?? 0, visibility: pos ? 'visible' : 'hidden' }}
          onKeyDown={onPanelKeyDown}
        >
          {content}
        </div>,
        document.body,
      )}
    </>
  );
};
