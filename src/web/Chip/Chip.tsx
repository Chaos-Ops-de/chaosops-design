import React from 'react';
import './Chip.css';

export interface ChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string;
  active: boolean;
  /** CSS colors for the active state; default to amber fill with ink. */
  activeBg?: string;
  activeBorder?: string;
  activeText?: string;
  /** CSS colors for the inactive state; default to the chip tokens. */
  inactiveBg?: string;
  inactiveBorder?: string;
  inactiveText?: string;
}

/** Toggleable filter chip. */
export const Chip: React.FC<ChipProps> = ({
  label, active, activeBg, activeBorder, activeText, inactiveBg, inactiveBorder, inactiveText,
  className, style, type = 'button', ...rest
}) => {
  const colors: Record<string, string | undefined> = active
    ? { '--chaos-chip-bg': activeBg, '--chaos-chip-border': activeBorder, '--chaos-chip-fg': activeText }
    : { '--chaos-chip-bg': inactiveBg, '--chaos-chip-border': inactiveBorder, '--chaos-chip-fg': inactiveText };
  for (const k of Object.keys(colors)) if (colors[k] == null) delete colors[k];
  return (
    <button
      type={type}
      aria-pressed={active}
      className={['chaos-chip', active ? 'chaos-chip--active' : '', className].filter(Boolean).join(' ')}
      style={{ ...(colors as React.CSSProperties), ...style }}
      {...rest}
    >
      {label}
    </button>
  );
};
