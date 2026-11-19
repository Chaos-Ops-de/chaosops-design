import React, { useId } from 'react';
import { clampProgress, formatPercent } from '../../utils/progress';
import './ProgressBar.css';

export type ProgressTone = 'info' | 'success' | 'warning' | 'danger';
export type ProgressSize = 'sm' | 'md';

export interface ProgressBarProps {
  /** 0-100. Leave it out (or set `indeterminate`) when the percentage is unknown. */
  value?: number;
  indeterminate?: boolean;
  /** Visible label above the bar. */
  label?: React.ReactNode;
  /** Shows the percentage next to the label, in tabular figures. */
  showPercent?: boolean;
  tone?: ProgressTone;
  size?: ProgressSize;
  /** Accessible name when there is no visible `label`. */
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Progress bar for waits where the percentage is known, or that run longer
 * than about 3 seconds (uploads, installs). Under 3 seconds a Spinner does.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value, indeterminate, label, showPercent = false, tone = 'info', size = 'md', className, style, ...rest
}) => {
  const labelId = useId();
  const isIndeterminate = indeterminate ?? value === undefined;
  const pct = clampProgress(value ?? 0);
  const percentText = formatPercent(pct);

  return (
    <div
      className={['chaos-progress', `chaos-progress--${tone}`, size === 'sm' ? 'chaos-progress--sm' : '', className].filter(Boolean).join(' ')}
      style={style}
    >
      {(label || (showPercent && !isIndeterminate)) && (
        <div className="chaos-progress__head">
          {label && <span id={labelId} className="chaos-progress__label">{label}</span>}
          {showPercent && !isIndeterminate && <span className="chaos-progress__percent">{percentText}</span>}
        </div>
      )}
      <div
        className="chaos-progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={isIndeterminate ? undefined : Math.round(pct)}
        aria-valuetext={isIndeterminate ? undefined : percentText}
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : rest['aria-label'] ?? 'Fortschritt'}
      >
        <div
          className={['chaos-progress__bar', isIndeterminate ? 'chaos-progress__bar--indeterminate' : ''].filter(Boolean).join(' ')}
          style={isIndeterminate ? undefined : { width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
