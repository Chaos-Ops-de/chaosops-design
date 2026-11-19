import React, { useEffect, useState } from 'react';
import { motionLimits } from '../../tokens/motion';
import { msUntilShow, shouldShowLoading } from './skeletonLogic';
import './Skeleton.css';

export type SkeletonVariant = 'bar' | 'circle' | 'block';

export interface SkeletonProps {
  /** `bar` = one text line, `circle` = avatar, `block` = image/card area. */
  variant?: SkeletonVariant;
  /** Number = px. Defaults per variant; match the real content's size so nothing jumps when data lands. */
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_SIZE: Record<SkeletonVariant, { width: number | string; height: number | string }> = {
  bar: { width: '100%', height: 12 },
  circle: { width: 40, height: 40 },
  block: { width: '100%', height: 80 },
};

/**
 * Placeholder shape for content that is loading. The shimmer sweeps left to
 * right (the reading direction) and stands still under reduced motion.
 * Decorative: wrap a group in {@link SkeletonGroup} to announce the loading state once.
 */
export const Skeleton: React.FC<SkeletonProps> = ({ variant = 'bar', width, height, className, style }) => {
  const defaults = DEFAULT_SIZE[variant];
  const w = width ?? defaults.width;
  // A circle with only one dimension given stays round.
  const h = height ?? (variant === 'circle' && width !== undefined ? width : defaults.height);
  return (
    <span
      aria-hidden="true"
      className={['chaos-skeleton', `chaos-skeleton--${variant}`, className].filter(Boolean).join(' ')}
      style={{ width: w, height: h, ...style }}
    />
  );
};

export interface SkeletonTextProps {
  /** Number of lines (default 3). */
  lines?: number;
  /** Width of the last line, so a paragraph ends the way real text does. */
  lastLineWidth?: number | string;
  /** Line height in px. */
  lineHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** A paragraph of bars; the last line is shorter. */
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  lastLineWidth = '60%',
  lineHeight = 12,
  className,
  style,
}) => (
  <span aria-hidden="true" className={['chaos-skeleton-text', className].filter(Boolean).join(' ')} style={style}>
    {Array.from({ length: Math.max(1, lines) }, (_, i) => (
      <Skeleton
        key={i}
        variant="bar"
        height={lineHeight}
        width={i === lines - 1 && lines > 1 ? lastLineWidth : '100%'}
      />
    ))}
  </span>
);

export interface SkeletonGroupProps {
  children: React.ReactNode;
  /** Screen-reader text announced while loading. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Wraps skeleton shapes: marks the region busy and announces "Wird geladen…" once. */
export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({ children, label = 'Wird geladen…', className, style }) => (
  <div role="status" aria-busy="true" className={className} style={style}>
    {children}
    <span className="chaos-skeleton-sr-only">{label}</span>
  </div>
);

/**
 * Whether to SHOW a loading state for `loading`. Stays `false` until the wait
 * has lasted `delayMs` (default 300 ms): a loading state that flashes for a
 * fast response reads as a bug, so under the delay show nothing.
 */
export function useDelayedLoading(loading: boolean, delayMs: number = motionLimits.noLoadingBelowMs): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShow(false);
      return;
    }
    const startedAt = Date.now();
    let timer: ReturnType<typeof setTimeout>;
    const arm = (ms: number) => {
      timer = setTimeout(() => {
        const elapsed = Date.now() - startedAt;
        if (shouldShowLoading(elapsed, delayMs, true)) setShow(true);
        else arm(msUntilShow(elapsed, delayMs));
      }, ms);
    };
    arm(msUntilShow(0, delayMs));
    return () => clearTimeout(timer);
  }, [loading, delayMs]);

  return show;
}
