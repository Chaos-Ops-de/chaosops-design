import { placeTooltip, type Rect, type Size, type TooltipPlacement } from '../Tooltip/tooltipLogic';

export type PopoverPlacement =
  | 'bottom-start' | 'bottom' | 'bottom-end'
  | 'top-start' | 'top' | 'top-end'
  | 'left' | 'right';

export type PopoverAlign = 'start' | 'center' | 'end';

/** Splits a placement into the side it opens on and how it lines up with the trigger. */
export function parsePlacement(placement: PopoverPlacement): { side: TooltipPlacement; align: PopoverAlign } {
  if (placement === 'left' || placement === 'right') return { side: placement, align: 'center' };
  const [side, align] = placement.split('-') as ['top' | 'bottom', PopoverAlign | undefined];
  return { side, align: align ?? 'center' };
}

export interface PlacePopoverInput {
  placement: PopoverPlacement;
  /** Trigger bounds in viewport coordinates. */
  trigger: Rect;
  panel: Size;
  viewport: Size;
  gap?: number;
  margin?: number;
  /** In right-to-left text, `start` lines up with the trigger's right edge. */
  rtl?: boolean;
}

export interface PopoverPosition {
  /** The side actually used — flipped when the preferred one lacked room. */
  side: TooltipPlacement;
  left: number;
  top: number;
}

/**
 * Anchors a panel to a trigger: flips to the other side when it would be
 * clipped and clamps inside the viewport. The tooltip placer centers on the
 * trigger, so for `start`/`end` alignment it is handed a stand-in trigger as
 * wide as the panel, shifted so that centering lands on the right edge.
 */
export function placePopover({ placement, trigger, panel, viewport, gap = 6, margin = 8, rtl = false }: PlacePopoverInput): PopoverPosition {
  const { side, align } = parsePlacement(placement);
  const vertical = side === 'top' || side === 'bottom';

  let anchor: Rect = trigger;
  if (vertical && align !== 'center') {
    const alignLeft = (align === 'start') !== rtl;
    anchor = {
      ...trigger,
      width: panel.width,
      left: alignLeft ? trigger.left : trigger.left + trigger.width - panel.width,
    };
  }

  const placed = placeTooltip({ placement: side, trigger: anchor, tooltip: panel, viewport, gap, margin });
  return { side: placed.placement, left: placed.left, top: placed.top };
}
