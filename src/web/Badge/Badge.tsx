import React from 'react';
import './Badge.css';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'violet';
export type BadgeSize = 'sm' | 'md';
export type BadgeVariant = 'soft' | 'solid';

export interface BadgeProps {
  /** The label. Required text, so the status never relies on color alone. */
  children: React.ReactNode;
  tone?: BadgeTone;
  size?: BadgeSize;
  /** `soft` = tint fill with ink text, `solid` = saturated fill. */
  variant?: BadgeVariant;
  /** Small filled dot before the label (status, presence). */
  dot?: boolean;
  /** A lucide icon before the label, as an element (`<Check size={12} />`) or a component (`Check`). */
  icon?: React.ReactNode | React.ComponentType<{ size?: number }>;
  className?: string;
  style?: React.CSSProperties;
}

function renderIcon(icon: BadgeProps['icon'], size: number): React.ReactNode {
  if (icon == null || icon === false) return null;
  if (React.isValidElement(icon)) return icon;
  if (typeof icon === 'function' || (typeof icon === 'object' && '$$typeof' in (icon as object))) {
    return React.createElement(icon as React.ComponentType<{ size?: number }>, { size });
  }
  return icon as React.ReactNode;
}

/**
 * Pill badge for status and counts: valid / expiring / expired, online / stale /
 * offline. Pair the hue with the label (and a dot or icon); never color alone.
 */
export const Badge: React.FC<BadgeProps> = ({
  children, tone = 'neutral', size = 'md', variant = 'soft', dot = false, icon, className, style,
}) => {
  const classes = [
    'chaos-badge',
    `chaos-badge--${tone}`,
    variant === 'solid' ? 'chaos-badge--solid' : '',
    size === 'sm' ? 'chaos-badge--sm' : '',
    className,
  ].filter(Boolean).join(' ');

  const iconNode = renderIcon(icon, size === 'sm' ? 11 : 13);

  return (
    <span className={classes} style={style}>
      {dot && <span className="chaos-badge__dot" aria-hidden="true" />}
      {iconNode && <span className="chaos-badge__icon" aria-hidden="true">{iconNode}</span>}
      {children}
    </span>
  );
};
