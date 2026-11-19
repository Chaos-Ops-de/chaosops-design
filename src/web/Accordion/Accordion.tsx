import React, { useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  HEADER_NAV_KEYS, nextHeaderIndex, normalizeOpen, toggleOpen,
  type AccordionType, type HeaderNavKey,
} from './accordionLogic';
import './Accordion.css';

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: readonly AccordionItem[];
  /** `single` keeps at most one item open (default); `multiple` lets each open on its own. */
  type?: AccordionType;
  /** Ids open at first, when uncontrolled. */
  defaultOpen?: readonly string[];
  /** Controlled open ids (always an array, even for `single`). Pair with `onValueChange`. */
  value?: readonly string[];
  onValueChange?: (ids: string[]) => void;
  /** For `single`: whether the open item can be closed again (default true). */
  collapsible?: boolean;
  className?: string;
}

/**
 * Stacked sections that expand in place. Headers are real buttons
 * (`aria-expanded`, `aria-controls`); ArrowUp/ArrowDown/Home/End move between
 * them. The panel animates its height with the 0fr to 1fr grid trick, so there
 * is no measured height and no layout jump, and it simply swaps under reduced motion.
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  type = 'single',
  defaultOpen = [],
  value,
  onValueChange,
  collapsible = true,
  className,
}) => {
  const baseId = useId();
  const [innerOpen, setInnerOpen] = useState<string[]>(() => normalizeOpen(defaultOpen, type));
  const openIds = value ?? innerOpen;
  const headerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (id: string) => {
    const next = toggleOpen(openIds, id, type, collapsible);
    if (value === undefined) setInnerOpen(next);
    onValueChange?.(next);
  };

  const onHeaderKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (!HEADER_NAV_KEYS.includes(e.key)) return;
    e.preventDefault();
    const next = nextHeaderIndex(index, e.key as HeaderNavKey, items.map((i) => Boolean(i.disabled)));
    if (next >= 0) headerRefs.current[next]?.focus();
  };

  return (
    <div className={['chaos-accordion', className].filter(Boolean).join(' ')}>
      {items.map((item, i) => {
        const open = openIds.includes(item.id);
        const headerId = `${baseId}-h-${item.id}`;
        const panelId = `${baseId}-p-${item.id}`;
        return (
          <div key={item.id} className={['chaos-accordion__item', open ? 'chaos-accordion__item--open' : ''].filter(Boolean).join(' ')}>
            <h3 className="chaos-accordion__heading">
              <button
                ref={(el) => { headerRefs.current[i] = el; }}
                id={headerId}
                type="button"
                className="chaos-accordion__header"
                aria-expanded={open}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
                onKeyDown={(e) => onHeaderKeyDown(e, i)}
              >
                <span className="chaos-accordion__title">{item.title}</span>
                <ChevronDown size={20} className="chaos-accordion__chevron" aria-hidden="true" />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={headerId} className="chaos-accordion__panel">
              <div className="chaos-accordion__inner">
                <div className="chaos-accordion__content">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
