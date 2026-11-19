import React from 'react';
import '../StickerCard/StickerCard.css';
import './SketchCard.css';

export type SketchTone = 'card' | 'mint' | 'lime' | 'yellow';

export interface SketchCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  tone?: SketchTone;
  /** Distance of the offset sticker shadow behind the card in px. 0 turns it off. */
  offset?: number;
  /** Optional coloured band across the top (calendar header, section title). */
  header?: React.ReactNode;
  headerTone?: SketchTone;
  /** Corner radius in px. */
  radius?: number;
  /** Body padding in px. */
  padding?: number;
  children?: React.ReactNode;
}

/** Outlined card with the offset sticker shadow, optional tone and tinted header band. */
export const SketchCard: React.FC<SketchCardProps> = ({
  tone = 'card', offset = 5, header, headerTone = 'mint', radius, padding, className, style, children, ...rest
}) => {
  const vars: Record<string, string> = { '--chaos-sticker-offset': `${offset}px` };
  if (radius != null) vars['--chaos-sticker-radius'] = `${radius}px`;
  if (padding != null) vars['--chaos-sticker-padding'] = `${padding}px`;
  return (
    <div className="chaos-sticker-card chaos-sketch" style={vars as React.CSSProperties}>
      <div className={['chaos-sticker-card__card', 'chaos-sketch__card', `chaos-sketch__card--${tone}`, className].filter(Boolean).join(' ')} style={style} {...rest}>
        {header && <div className={`chaos-sketch__header chaos-sketch__card--${headerTone}`}>{header}</div>}
        <div className="chaos-sketch__body">{children}</div>
      </div>
    </div>
  );
};
