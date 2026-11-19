import React, { useId } from 'react';
import './SegmentedControl.css';

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
  /** Icon before the label. */
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Needed when `label` is not text (icon-only segments). */
  'aria-label'?: string;
}

export interface SegmentedControlProps<T extends string> {
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the group (e.g. "Ansicht"). */
  'aria-label': string;
  size?: 'sm' | 'md';
  className?: string;
}

/** Pick exactly one of a few views or modes: list / grid, day / week. Arrow keys move between segments. */
export function SegmentedControl<T extends string>({
  options, value, onChange, 'aria-label': ariaLabel, size = 'md', className,
}: SegmentedControlProps<T>): React.ReactElement {
  const name = useId();
  const enabled = options.filter((o) => !o.disabled);

  const onKeyDown = (e: React.KeyboardEvent, current: T) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const i = enabled.findIndex((o) => o.value === current);
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    const next = enabled[(i + step + enabled.length) % enabled.length];
    if (next) {
      onChange(next.value);
      document.getElementById(`${name}-${next.value}`)?.focus();
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={['chaos-segmented', size === 'sm' ? 'chaos-segmented--sm' : '', className].filter(Boolean).join(' ')}
    >
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            id={`${name}-${o.value}`}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={o['aria-label']}
            tabIndex={selected ? 0 : -1}
            disabled={o.disabled}
            className={['chaos-segmented__btn', selected ? 'chaos-segmented__btn--selected' : ''].filter(Boolean).join(' ')}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKeyDown(e, o.value)}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
