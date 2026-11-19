import React from 'react';
import { Clock } from 'lucide-react';
import './TimeRow.css';

export interface TimeRowProps {
  /** e.g. "09:00". */
  time: string;
  /** Bold value on the right, e.g. "200 ml". */
  value: string;
  /** Replaces the default `Clock` icon. */
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** Slim outlined log row: clock + time on the left, bold value on the right. */
export const TimeRow: React.FC<TimeRowProps> = ({ time, value, icon, className, style }) => (
  <div className={['chaos-time-row', className].filter(Boolean).join(' ')} style={style}>
    <span className="chaos-time-row__icon" aria-hidden="true">{icon ?? <Clock size={18} />}</span>
    <time className="chaos-time-row__time">{time}</time>
    <strong className="chaos-time-row__value">{value}</strong>
  </div>
);
