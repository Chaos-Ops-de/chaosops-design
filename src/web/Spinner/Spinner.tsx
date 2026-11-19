import React from 'react';
import { spinnerPixels, spinnerStroke, type SpinnerSize } from '../../utils/progress';
import './Spinner.css';

export type SpinnerTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'inherit';
export type { SpinnerSize };

export interface SpinnerProps {
  /** `sm` 16, `md` 24, `lg` 36 px, or a pixel number. */
  size?: SpinnerSize;
  /** `inherit` takes the surrounding text color (inside a button). */
  tone?: SpinnerTone;
  /** Announced to screen readers. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Indeterminate spinner. Use it only for waits shorter than about 3 seconds
 * (motionLimits.spinnerMaxMs) and inside buttons; show a skeleton when the
 * shape of the content is known and a ProgressBar when the percentage is.
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md', tone = 'info', label = 'Wird geladen…', className, style,
}) => {
  const px = spinnerPixels(size);
  return (
    <span
      role="status"
      className={['chaos-spinner', `chaos-spinner--${tone}`, className].filter(Boolean).join(' ')}
      style={{
        '--chaos-spinner-size': `${px}px`,
        '--chaos-spinner-stroke': `${spinnerStroke(px)}px`,
        ...style,
      } as React.CSSProperties}
    >
      <span className="chaos-spinner__ring" aria-hidden="true" />
      <span className="chaos-spinner__label">{label}</span>
    </span>
  );
};
