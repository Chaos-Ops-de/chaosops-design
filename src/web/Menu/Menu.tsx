import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight } from 'lucide-react';
import { Popover, type PopoverTriggerProps } from './Popover';
import type { PopoverPlacement } from './popoverLogic';
import {
  flattenGroups, inSafeTriangle, isLetterKey, matchByLetter, nextEnabledIndex, normalizeGroups, placeSubmenu,
  MENU_NAV_KEYS, type MenuNavKey, type Point, type SubmenuPosition,
} from './menuLogic';
import './Menu.css';

export interface MenuItem {
  id: string;
  label: string;
  /** A lucide icon, e.g. `<Pencil size={16} />`. */
  icon?: React.ReactNode;
  /** Runs when the item is chosen. Not needed on an item that opens a submenu. */
  onSelect?: () => void;
  disabled?: boolean;
  /** Destructive action: shown red and always moved to a last group of its own. */
  danger?: boolean;
  /** Hint text such as "Strg+D"; hidden on touch screens and on items with a submenu. */
  shortcut?: string;
  /** Turns the item into a submenu. Submenus can nest. */
  items?: readonly MenuItem[];
}

export interface MenuProps {
  /** The button that opens the menu. */
  trigger: React.ReactElement<PopoverTriggerProps & { onKeyDown?: React.KeyboardEventHandler }>;
  /** A flat list of items, or `groups` for dividers between groups. */
  items?: readonly MenuItem[];
  groups?: readonly (readonly MenuItem[])[];
  placement?: PopoverPlacement;
  'aria-label'?: string;
  className?: string;
}

/**
 * Action menu on a button. Arrow keys move (wrapping, skipping disabled
 * items), Home/End jump, a letter jumps to the next item starting with it,
 * Enter or Space selects, Escape closes one level (and refocuses the trigger
 * from the top level), Tab closes. Groups are separated by dividers and
 * destructive items always end up last. Opens in under 150 ms and flips or
 * slides to stay inside the viewport.
 *
 * An item with `items` opens a submenu: by hover (after a short delay, with a
 * safe triangle so a diagonal move toward it doesn't switch to a neighbor),
 * or with Enter, Space or the arrow toward the reading direction. The arrow
 * back, or Escape, closes just that submenu.
 */
export const Menu: React.FC<MenuProps> = ({
  trigger,
  items,
  groups,
  placement = 'bottom-start',
  'aria-label': ariaLabel,
  className,
}) => {
  const [open, setOpen] = useState(false);
  // ArrowUp on the trigger opens onto the last item; everything else onto the first.
  const intent = useRef<'first' | 'last'>('first');

  const shown = normalizeGroups(groups ?? [items ?? []]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) intent.current = 'first';
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    trigger.props.onKeyDown?.(e);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      intent.current = e.key === 'ArrowUp' ? 'last' : 'first';
      setOpen(true);
    }
  };

  const withKeys = React.cloneElement(trigger, { onKeyDown: onTriggerKeyDown } as React.Attributes);

  return (
    <Popover
      trigger={withKeys}
      open={open}
      onOpenChange={handleOpenChange}
      placement={placement}
      role="menu"
      aria-label={ariaLabel}
      initialFocus="none"
      className={['chaos-menu', className].filter(Boolean).join(' ')}
    >
      {({ close, ready }) => (
        <MenuList groups={shown} ready={ready} focusIntent={intent.current} closeAll={close} depth={0} />
      )}
    </Popover>
  );
};

type FocusIntent = 'first' | 'last' | 'none';

interface MenuListProps {
  groups: MenuItem[][];
  ready: boolean;
  /** Where focus goes once the list is visible; `none` for a submenu opened by the mouse. */
  focusIntent: FocusIntent;
  closeAll: (restoreFocus?: boolean) => void;
  /** Closes this submenu and returns to the parent item (submenus only). */
  onBack?: () => void;
  depth: number;
}

/** How long hovering waits before a submenu opens or the open one is replaced. */
const HOVER_OPEN_MS = 120;
/** How long the open submenu survives while the pointer travels toward it. */
const HOVER_GRACE_MS = 300;

const MenuList: React.FC<MenuListProps> = ({ groups, ready, focusIntent, closeAll, onBack, depth }) => {
  const flat = flattenGroups(groups);
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(-1);
  const [sub, setSub] = useState<{ index: number; focus: boolean } | null>(null);
  const pointer = useRef<Point>({ x: 0, y: 0 });
  const leftItemAt = useRef<Point | null>(null);
  const subPanel = useRef<HTMLDivElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const isRtl = () => (rootRef.current ? getComputedStyle(rootRef.current).direction === 'rtl' : false);

  const focusItem = (index: number) => {
    if (index < 0) return;
    setActive(index);
    itemRefs.current[index]?.focus();
  };

  // Focus the first (or last) enabled item as soon as the list is visible.
  useEffect(() => {
    if (!ready || focusIntent === 'none') return;
    focusItem(nextEnabledIndex(-1, focusIntent === 'last' ? 'ArrowUp' : 'ArrowDown', flat));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const openSub = (index: number, focus: boolean) => {
    clearTimeout(timer.current);
    setSub({ index, focus });
  };
  const closeSub = (focusParent: boolean) => {
    clearTimeout(timer.current);
    const index = sub?.index;
    setSub(null);
    if (focusParent && index !== undefined) itemRefs.current[index]?.focus();
  };

  const hasSub = (item: MenuItem | undefined) => Boolean(item?.items && item.items.length > 0 && !item.disabled);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const rtl = isRtl();
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const back = rtl ? 'ArrowRight' : 'ArrowLeft';
    let handled = true;

    if (MENU_NAV_KEYS.includes(e.key)) {
      e.preventDefault();
      focusItem(nextEnabledIndex(active, e.key as MenuNavKey, flat));
    } else if (e.key === forward && hasSub(flat[active])) {
      e.preventDefault();
      openSub(active, true);
    } else if ((e.key === back || e.key === 'Escape') && depth > 0) {
      e.preventDefault();
      onBack?.();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      closeAll(true);
    } else if (isLetterKey(e)) {
      e.preventDefault();
      focusItem(matchByLetter(flat, active, e.key));
    } else {
      handled = false;
    }

    // React bubbles key events from a submenu's portal up to its parent list: keep them here,
    // so one key press never acts on two levels (and Escape closes only one).
    if (depth > 0 && (handled || e.key === 'Escape')) e.stopPropagation();
  };

  const onItemEnter = (index: number, item: MenuItem) => {
    clearTimeout(timer.current);
    const opening = hasSub(item);
    const switching = sub !== null && sub.index !== index;
    if (!opening && !switching) return;

    // Heading for the open submenu? Then give it time to arrive instead of switching away.
    const rect = subPanel.current?.getBoundingClientRect();
    const towardSub = switching && rect && leftItemAt.current && inSafeTriangle(pointer.current, leftItemAt.current, rect);
    timer.current = setTimeout(
      () => (opening ? openSub(index, false) : setSub(null)),
      towardSub ? HOVER_GRACE_MS : opening ? HOVER_OPEN_MS : 0,
    );
  };

  let index = -1;
  return (
    <div
      ref={rootRef}
      onKeyDown={onKeyDown}
      onMouseMove={(e) => { pointer.current = { x: e.clientX, y: e.clientY }; }}
    >
      {groups.map((group, g) => (
        <React.Fragment key={g}>
          {g > 0 && <div role="separator" className="chaos-menu__separator" />}
          {group.map((item) => {
            index += 1;
            const i = index;
            const submenu = hasSub(item);
            return (
              <button
                key={item.id}
                ref={(el) => { itemRefs.current[i] = el; }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                aria-disabled={item.disabled || undefined}
                aria-haspopup={submenu ? 'menu' : undefined}
                aria-expanded={submenu ? sub?.index === i : undefined}
                className={[
                  'chaos-menu__item',
                  item.danger ? 'chaos-menu__item--danger' : '',
                  item.disabled ? 'chaos-menu__item--disabled' : '',
                ].filter(Boolean).join(' ')}
                onFocus={() => setActive(i)}
                onMouseEnter={() => onItemEnter(i, item)}
                onMouseLeave={() => { leftItemAt.current = { ...pointer.current }; }}
                onClick={() => {
                  if (item.disabled) return;
                  if (submenu) {
                    openSub(i, true);
                    return;
                  }
                  closeAll(true);
                  item.onSelect?.();
                }}
              >
                {item.icon && <span className="chaos-menu__icon" aria-hidden="true">{item.icon}</span>}
                <span className="chaos-menu__label">{item.label}</span>
                {submenu
                  ? <span className="chaos-menu__chevron" aria-hidden="true"><ChevronRight size={16} /></span>
                  : item.shortcut && <kbd className="chaos-menu__shortcut">{item.shortcut}</kbd>}
              </button>
            );
          })}
        </React.Fragment>
      ))}

      {sub && hasSub(flat[sub.index]) && typeof document !== 'undefined' && createPortal(
        <SubMenu
          anchor={itemRefs.current[sub.index] ?? null}
          label={flat[sub.index]!.label}
          items={flat[sub.index]!.items!}
          focus={sub.focus}
          closeAll={closeAll}
          onBack={() => closeSub(true)}
          panelRef={subPanel}
          onPointerEnter={() => clearTimeout(timer.current)}
          depth={depth + 1}
        />,
        document.body,
      )}
    </div>
  );
};

interface SubMenuProps {
  anchor: HTMLElement | null;
  label: string;
  items: readonly MenuItem[];
  focus: boolean;
  closeAll: (restoreFocus?: boolean) => void;
  onBack: () => void;
  panelRef: React.MutableRefObject<HTMLDivElement | null>;
  onPointerEnter: () => void;
  depth: number;
}

/** A submenu panel beside its parent item. Marked so the parent popover counts it as part of itself. */
const SubMenu: React.FC<SubMenuProps> = ({ anchor, label, items, focus, closeAll, onBack, panelRef, onPointerEnter, depth }) => {
  const el = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<SubmenuPosition | null>(null);
  const groups = useMemo(() => normalizeGroups([items]), [items]);

  useLayoutEffect(() => {
    const panel = el.current;
    if (!anchor || !panel) return;
    const r = anchor.getBoundingClientRect();
    setPos(placeSubmenu({
      item: { left: r.left, top: r.top, right: r.right, bottom: r.bottom },
      panel: { width: panel.offsetWidth, height: panel.offsetHeight },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      rtl: getComputedStyle(anchor).direction === 'rtl',
    }));
  }, [anchor, items]);

  return (
    <div
      ref={(node) => { el.current = node; panelRef.current = node; }}
      role="menu"
      aria-label={label}
      data-chaos-submenu=""
      data-side={pos?.side ?? 'right'}
      className="chaos-popover chaos-menu chaos-menu--sub"
      style={{ left: pos?.left ?? 0, top: pos?.top ?? 0, visibility: pos ? 'visible' : 'hidden' }}
      onMouseEnter={onPointerEnter}
    >
      <MenuList groups={groups} ready={pos !== null} focusIntent={focus ? 'first' : 'none'} closeAll={closeAll} onBack={onBack} depth={depth} />
    </div>
  );
};
