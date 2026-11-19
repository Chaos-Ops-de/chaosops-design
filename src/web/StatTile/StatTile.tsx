import React from 'react';
import '../surface.css';
import './StatTile.css';

export interface StatTileProps {
  /** Pill label, e.g. "Letzte 7 Tage". */
  label: string;
  /** Headline figure, e.g. "14%". */
  value: string;
  /** Secondary figure on the right, e.g. "250ml | 1L". */
  detail?: string;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** Compact stat: outlined mint label pill, bold headline figure and a secondary figure on the right. */
export const StatTile: React.FC<StatTileProps> = ({ label, value, detail, icon, className, style }) => (
  <div className={['chaos-surface', 'chaos-stat-tile', className].filter(Boolean).join(' ')} style={style}>
    <span className="chaos-stat-tile__pill">
      {icon}
      {label}
    </span>
    <div className="chaos-stat-tile__row">
      <span className="chaos-stat-tile__value">{value}</span>
      {detail && <span className="chaos-stat-tile__detail">{detail}</span>}
    </div>
  </div>
);
