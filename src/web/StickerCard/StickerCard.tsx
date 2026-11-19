import React from 'react';
import './StickerCard.css';

export interface StickerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** CSS color of the offset block behind the card; defaults to the ink border. */
  offsetColor?: string;
  /** Offset distance in px. */
  offset?: number;
}

/** Card with a solid offset "sticker" shadow block behind it. */
export const StickerCard: React.FC<StickerCardProps> = ({
  offsetColor, offset = 4, className, style, children, ...rest
}) => (
  <div className="chaos-sticker-card" style={{ ['--chaos-sticker-offset' as string]: `${offset}px`, ['--chaos-sticker-color' as string]: offsetColor }}>
    <div className={['chaos-sticker-card__card', className].filter(Boolean).join(' ')} style={style} {...rest}>
      {children}
    </div>
  </div>
);
