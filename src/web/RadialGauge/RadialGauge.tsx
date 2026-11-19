import React from 'react';
import { litTicks } from '../../primitives/calendarMath';
import './RadialGauge.css';

export interface RadialGaugeProps {
  /** Progress 0-1. */
  value: number;
  /** Outer diameter in px. */
  size?: number;
  /** Number of ticks around the ring. */
  ticks?: number;
  /** Colour of lit ticks; defaults to the green token. */
  color?: string;
  /** Content of the outlined centre card (percentage, label...). */
  children?: React.ReactNode;
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Dense tick ring (dark, lit part coloured) around an outlined centre card; fills clockwise from 12 o'clock. Inline SVG. */
export const RadialGauge: React.FC<RadialGaugeProps> = ({
  value, size = 200, ticks = 72, color, children, 'aria-label': ariaLabel, className, style,
}) => {
  const lit = litTicks(value, ticks);
  const tickH = Math.max(6, size * 0.06);
  const tickW = Math.max(2, size * 0.012);
  const inner = size * 0.62;
  const now = Math.round(Math.min(1, Math.max(0, value || 0)) * 100);
  return (
    <div
      className={['chaos-radial-gauge', className].filter(Boolean).join(' ')}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={now}
      style={{ width: size, height: size, ...(color ? { ['--chaos-gauge-color' as string]: color } : null), ...style }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {Array.from({ length: ticks }, (_, i) => (
          <rect
            key={i}
            x={size / 2 - tickW / 2}
            y={0}
            width={tickW}
            height={tickH}
            rx={tickW / 2}
            transform={`rotate(${(360 / ticks) * i} ${size / 2} ${size / 2})`}
            className={i < lit ? 'chaos-radial-gauge__tick chaos-radial-gauge__tick--lit' : 'chaos-radial-gauge__tick'}
          />
        ))}
      </svg>
      <div className="chaos-radial-gauge__card" style={{ width: inner, height: inner }}>{children}</div>
    </div>
  );
};
