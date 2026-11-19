import React from 'react';
import './DashedDivider.css';

export interface DashedDividerProps {
  className?: string;
  style?: React.CSSProperties;
}

export const DashedDivider: React.FC<DashedDividerProps> = ({ className, style }) => (
  <hr className={['chaos-dashed-divider', className].filter(Boolean).join(' ')} style={style} />
);
