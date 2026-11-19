import React from 'react';
import './Gremlin.css';

export type GremlinName =
  | '404' | 'buy' | 'down' | 'erfolg' | 'hide'
  | 'loadingbar' | 'login' | 'mail' | 'maintance' | 'sleep';

export type GremlinAnimation = 'bounce' | 'wiggle' | 'float' | 'none';

export interface GremlinProps {
  /** Image URL (e.g. from `@chaos-ops-de/design/assets/gremlins/*.png`). */
  source: string;
  name?: GremlinName;
  size?: number;
  animation?: GremlinAnimation;
  /** Alt text; decorative (empty) by default. */
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Renders a ChaosOps mascot, optionally animated. Respects reduced motion. */
export const Gremlin: React.FC<GremlinProps> = ({ source, size = 96, animation = 'none', alt = '', className, style }) => (
  <span
    className={['chaos-gremlin', animation !== 'none' ? `chaos-gremlin--${animation}` : '', className].filter(Boolean).join(' ')}
    style={{ width: size, height: size, ...style }}
  >
    <img src={source} alt={alt} />
  </span>
);
