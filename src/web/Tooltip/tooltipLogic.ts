export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface PlaceTooltipInput {
  placement: TooltipPlacement;
  /** Trigger bounds in viewport coordinates. */
  trigger: Rect;
  tooltip: Size;
  viewport: Size;
  /** Space between trigger and tooltip (room for the arrow). */
  gap?: number;
  /** Minimum distance kept from every viewport edge. */
  margin?: number;
}

export interface TooltipPosition {
  /** The side actually used — the opposite one when the preferred side was clipped. */
  placement: TooltipPlacement;
  left: number;
  top: number;
  /** Arrow centre along the tooltip's cross axis, measured from its start edge (left or top). */
  arrowOffset: number;
}

/** Keeps the arrow clear of the tooltip's rounded corners. */
export const ARROW_EDGE = 12;

const OPPOSITE: Record<TooltipPlacement, TooltipPlacement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

/** Free space on the main axis (beyond gap and margin) for a given side. */
function room(side: TooltipPlacement, trigger: Rect, viewport: Size, gap: number, margin: number): number {
  switch (side) {
    case 'top': return trigger.top - margin - gap;
    case 'bottom': return viewport.height - margin - (trigger.top + trigger.height) - gap;
    case 'left': return trigger.left - margin - gap;
    case 'right': return viewport.width - margin - (trigger.left + trigger.width) - gap;
  }
}

const mainSize = (side: TooltipPlacement, tooltip: Size) =>
  side === 'top' || side === 'bottom' ? tooltip.height : tooltip.width;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

/**
 * Picks a side and coordinates for a tooltip so it is never clipped: flips to
 * the opposite side when the preferred one lacks room (or, with no room on
 * either, takes the roomier one), then clamps along both axes to stay inside
 * the viewport margin.
 */
export function placeTooltip({ placement, trigger, tooltip, viewport, gap = 8, margin = 8 }: PlaceTooltipInput): TooltipPosition {
  const fits = (side: TooltipPlacement) => room(side, trigger, viewport, gap, margin) >= mainSize(side, tooltip);

  let side = placement;
  if (!fits(placement)) {
    const opposite = OPPOSITE[placement];
    if (fits(opposite)) {
      side = opposite;
    } else if (room(opposite, trigger, viewport, gap, margin) > room(placement, trigger, viewport, gap, margin)) {
      side = opposite;
    }
  }

  const centerX = trigger.left + trigger.width / 2;
  const centerY = trigger.top + trigger.height / 2;
  const vertical = side === 'top' || side === 'bottom';

  let left: number;
  let top: number;
  switch (side) {
    case 'top':
      left = centerX - tooltip.width / 2;
      top = trigger.top - gap - tooltip.height;
      break;
    case 'bottom':
      left = centerX - tooltip.width / 2;
      top = trigger.top + trigger.height + gap;
      break;
    case 'left':
      left = trigger.left - gap - tooltip.width;
      top = centerY - tooltip.height / 2;
      break;
    case 'right':
      left = trigger.left + trigger.width + gap;
      top = centerY - tooltip.height / 2;
      break;
  }

  // Cross axis slides to stay on screen; main axis only moves when no side had room.
  left = clamp(left, margin, Math.max(margin, viewport.width - margin - tooltip.width));
  top = clamp(top, margin, Math.max(margin, viewport.height - margin - tooltip.height));

  const arrowRaw = vertical ? centerX - left : centerY - top;
  const crossSize = vertical ? tooltip.width : tooltip.height;
  const arrowOffset = clamp(arrowRaw, ARROW_EDGE, Math.max(ARROW_EDGE, crossSize - ARROW_EDGE));

  return { placement: side, left, top, arrowOffset };
}
