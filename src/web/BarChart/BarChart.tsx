import React from 'react';
import '../surface.css';
import './BarChart.css';

export interface BarChartDatum {
  label: string;
  value: number;
}

export interface BarChartProps {
  data: BarChartDatum[];
  /** Scale maximum; defaults to the largest value. */
  max?: number;
  /** Index of the highlighted bar (amber, with a dark value bubble). */
  selectedIndex?: number | null;
  onSelect?: (index: number) => void;
  /** Texts in the top corners, e.g. goal / current. */
  topLeft?: string;
  topRight?: string;
  height?: number;
  formatValue?: (value: number) => string;
  className?: string;
  style?: React.CSSProperties;
}

const SEGMENT = 3;
const GAP = 3;

/** Bars drawn as stacks of short dashes (teal; amber when selected) in an outlined card. Inline SVG. */
export const BarChart: React.FC<BarChartProps> = ({
  data, max, selectedIndex = null, onSelect, topLeft, topRight, height = 140, formatValue = String, className, style,
}) => {
  const top = Math.max(max ?? 0, ...data.map((d) => d.value), 1);
  const plotH = height - 24;
  const colW = 100 / Math.max(data.length, 1);
  const label = data.map((d) => `${d.label}: ${formatValue(d.value)}`).join(', ');
  return (
    <figure className={['chaos-surface', 'chaos-bar-chart', className].filter(Boolean).join(' ')} style={style}>
      {(topLeft || topRight) && (
        <div className="chaos-bar-chart__top"><span>{topLeft}</span><span>{topRight}</span></div>
      )}
      <svg className="chaos-bar-chart__plot" role="img" aria-label={label} width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        {data.map((d, i) => {
          const active = i === selectedIndex;
          const barH = Math.max(SEGMENT, (d.value / top) * plotH);
          const segments = Math.max(1, Math.round(barH / (SEGMENT + GAP)));
          const cx = colW * i + colW / 2;
          const w = Math.min(active ? 8 : 6, colW * 0.8);
          return (
            <g key={`${d.label}-${i}`} className={onSelect ? 'chaos-bar-chart__bar chaos-bar-chart__bar--interactive' : 'chaos-bar-chart__bar'}
              onClick={() => onSelect?.(i)}>
              <rect x={colW * i} y={0} width={colW} height={height} fill="transparent" />
              {Array.from({ length: segments }, (_, s) => (
                <rect key={s} x={cx - w / 2} y={height - (s + 1) * (SEGMENT + GAP) + GAP} width={w} height={SEGMENT} rx={1}
                  className={active ? 'chaos-bar-chart__seg chaos-bar-chart__seg--active' : 'chaos-bar-chart__seg'} />
              ))}
            </g>
          );
        })}
      </svg>
      {selectedIndex != null && data[selectedIndex] && (
        <span
          className="chaos-bar-chart__bubble"
          style={{
            left: `${colW * selectedIndex + colW / 2}%`,
            bottom: `${24 + (Math.max(1, Math.round(Math.max(SEGMENT, (data[selectedIndex]!.value / top) * plotH) / (SEGMENT + GAP))) * (SEGMENT + GAP)) + 4 - GAP + 16}px`,
          }}
        >
          {formatValue(data[selectedIndex]!.value)}
        </span>
      )}
      <div className="chaos-bar-chart__labels" aria-hidden="true">
        {data.map((d, i) => (
          <span key={`${d.label}-${i}`} className={i === selectedIndex ? 'chaos-bar-chart__label chaos-bar-chart__label--active' : 'chaos-bar-chart__label'}>{d.label}</span>
        ))}
      </div>
    </figure>
  );
};
