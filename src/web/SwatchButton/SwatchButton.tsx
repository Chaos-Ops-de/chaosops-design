import React from 'react';
import './SwatchButton.css';

export interface SwatchButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  /** Any CSS color. */
  color: string;
  selected?: boolean;
  /** Required: a color alone has no name (e.g. "Rot", or the hex code). Also the default tooltip. */
  'aria-label': string;
  size?: number;
}

/** Round color chip for color pickers. The selected one gets a ring, so color is not the only signal. */
export const SwatchButton = React.forwardRef<HTMLButtonElement, SwatchButtonProps>(function SwatchButton(
  { color, selected = false, size = 24, className, style, type = 'button', title, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      aria-label={ariaLabel}
      title={title ?? ariaLabel}
      className={['chaos-swatch', selected ? 'chaos-swatch--selected' : '', className].filter(Boolean).join(' ')}
      style={{ '--chaos-swatch-color': color, '--chaos-swatch-size': `${size}px`, ...style } as React.CSSProperties}
      {...rest}
    />
  );
});
