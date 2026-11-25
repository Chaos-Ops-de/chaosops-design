import React from 'react';
import './Tape.css';

export interface TapeProps {
  /** Any CSS colour. Defaults to the amber accent. */
  color?: string;
  /** Width in px. Default 90. */
  width?: number;
  /** Height in px. Default 28. */
  height?: number;
  /** Rotation in degrees (scaled by `--chaos-tilt`, so themes can straighten it). Default -2.5. */
  rotate?: number;
  className?: string;
  /** Position it (top/left) relative to the nearest positioned ancestor. */
  style?: React.CSSProperties;
}

/**
 * A strip of masking tape stuck on the top edge of a card. Purely decorative:
 * org themes that turn decoration off (`--chaos-decor-display: none`) hide it.
 */
export const Tape: React.FC<TapeProps> = ({ color, width, height, rotate, className, style }) => {
  const vars: Record<string, string> = {};
  if (color) vars['--chaos-tape-color'] = color;
  if (width !== undefined) vars['--chaos-tape-width'] = `${width}px`;
  if (height !== undefined) vars['--chaos-tape-height'] = `${height}px`;
  if (rotate !== undefined) vars['--chaos-tape-rotate'] = `${rotate}deg`;
  return (
    <div
      className={['chaos-tape', className].filter(Boolean).join(' ')}
      style={{ ...(vars as React.CSSProperties), ...style }}
      aria-hidden="true"
    />
  );
};
