import React from 'react';
import './LevelBadge.css';

export interface LevelBadgeProps {
  label: string;
  /** Small second line, e.g. "5 Pts Next". */
  caption?: string;
  /** Round amber button on the right; omit to hide it. */
  onPlusClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/** Dark pill badge ("Level 1") with an optional amber round "+" button. */
export const LevelBadge: React.FC<LevelBadgeProps> = ({ label, caption, onPlusClick, className, style }) => (
  <div className={['chaos-level-badge', className].filter(Boolean).join(' ')} style={style}>
    <div>
      <div className="chaos-level-badge__label">{label}</div>
      {caption && <div className="chaos-level-badge__caption">{caption}</div>}
    </div>
    {onPlusClick && (
      <button type="button" className="chaos-level-badge__plus" aria-label="Mehr" onClick={onPlusClick}>+</button>
    )}
  </div>
);
