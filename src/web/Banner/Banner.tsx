import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import './Banner.css';

export type BannerType = 'info' | 'success' | 'warning' | 'error';

export interface BannerProps {
  /** Severity picks the hue, icon and live-region role. */
  type?: BannerType;
  title?: React.ReactNode;
  children: React.ReactNode;
  /** Renders a close button; the banner otherwise stays until the state it reports changes. */
  onDismiss?: () => void;
  /** Replaces the default icon for the type. */
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Each type maps onto a palette hue: `--chaos-<tone>`, `-tint` and `-ink`.
const bannerConfig: Record<BannerType, { tone: string; Icon: React.FC<{ size?: number }> }> = {
  info: { tone: 'info', Icon: Info },
  success: { tone: 'green', Icon: CheckCircle2 },
  warning: { tone: 'amber', Icon: AlertTriangle },
  error: { tone: 'danger', Icon: AlertCircle },
};

/**
 * Full-width, in-flow notice for system state (e.g. a degraded server). It
 * stays until dismissed — use a Toast for transient news. Hue is never the
 * only signal: every type has its own icon and a left border.
 */
export const Banner: React.FC<BannerProps> = ({ type = 'info', title, children, onDismiss, icon, className, style }) => {
  const { tone, Icon } = bannerConfig[type];
  const urgent = type === 'error' || type === 'warning';

  return (
    <div
      className={['chaos-banner', `chaos-banner--${tone}`, className].filter(Boolean).join(' ')}
      style={style}
      role={urgent ? 'alert' : 'status'}
    >
      <span className="chaos-banner__icon" aria-hidden="true">{icon ?? <Icon size={20} />}</span>
      <div className="chaos-banner__body">
        {title && <div className="chaos-banner__title">{title}</div>}
        <div className="chaos-banner__text">{children}</div>
      </div>
      {onDismiss && (
        <button type="button" className="chaos-banner__dismiss" onClick={onDismiss} aria-label="Schließen">
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
