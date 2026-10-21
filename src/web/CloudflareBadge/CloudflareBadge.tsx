import React from 'react';
import { brandColors } from '../../tokens/colors';
import './CloudflareBadge.css';

export interface CloudflareBadgeProps {
  /** Text next to the cloud mark. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Orange Cloudflare cloud + "Protected by Cloudflare" (footer trust badge). */
export const CloudflareBadge: React.FC<CloudflareBadgeProps> = ({
  label = 'Protected by Cloudflare', className, style,
}) => (
  <div className={['chaos-cf-badge', className].filter(Boolean).join(' ')} style={style}>
    <svg width="18" height="12" viewBox="0 0 20 13" fill="none" aria-hidden="true">
      <path
        d="M16.4 5.2a4.8 4.8 0 00-.9-.1 5.5 5.5 0 00-10.4-1.6 3 3 0 00-.7-.1A3.2 3.2 0 004.4 10h12a2.5 2.5 0 000-4.8z"
        fill={brandColors.cloudflare}
      />
    </svg>
    {label}
  </div>
);
