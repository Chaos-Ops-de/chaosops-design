import React from 'react';
import { fontSizes } from '../../tokens/fonts';
import './Text.css';

export type TextVariant = 'display' | 'body' | 'bodyMedium' | 'bodySemiBold' | 'bodyBold';

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TextVariant;
  size?: keyof typeof fontSizes;
  muted?: boolean;
  /** Element to render; defaults to `span`. */
  as?: React.ElementType;
}

/** Themed text: variant picks the face and weight, `muted` the secondary ink. */
export const Text: React.FC<TextProps> = ({
  variant = 'body', size = 'base', muted = false, as: Tag = 'span', className, style, ...rest
}) => (
  <Tag
    className={['chaos-text', `chaos-text--${variant}`, muted ? 'chaos-text--muted' : '', className].filter(Boolean).join(' ')}
    style={{ fontSize: fontSizes[size], ...style }}
    {...rest}
  />
);
