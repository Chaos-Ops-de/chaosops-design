import { describe, expect, it } from 'vitest';
import { ARROW_EDGE, placeTooltip, type Rect } from './tooltipLogic';

const viewport = { width: 1000, height: 800 };
const tooltip = { width: 100, height: 40 };
const trig = (r: Partial<Rect>): Rect => ({ left: 450, top: 400, width: 100, height: 30, ...r });

describe('placeTooltip — fits', () => {
  it('centres above the trigger when there is room', () => {
    const p = placeTooltip({ placement: 'top', trigger: trig({}), tooltip, viewport });
    expect(p).toEqual({ placement: 'top', left: 450, top: 352, arrowOffset: 50 });
  });

  it('centres below, left and right of the trigger', () => {
    expect(placeTooltip({ placement: 'bottom', trigger: trig({}), tooltip, viewport })).toMatchObject({ placement: 'bottom', left: 450, top: 438 });
    expect(placeTooltip({ placement: 'left', trigger: trig({}), tooltip, viewport })).toMatchObject({ placement: 'left', left: 342, top: 395 });
    expect(placeTooltip({ placement: 'right', trigger: trig({}), tooltip, viewport })).toMatchObject({ placement: 'right', left: 558, top: 395 });
  });
});

describe('placeTooltip — flips', () => {
  it('top flips to bottom when clipped by the top edge', () => {
    const p = placeTooltip({ placement: 'top', trigger: trig({ top: 20 }), tooltip, viewport });
    expect(p.placement).toBe('bottom');
    expect(p.top).toBe(58);
  });

  it('bottom flips to top when clipped by the bottom edge', () => {
    const p = placeTooltip({ placement: 'bottom', trigger: trig({ top: 760 }), tooltip, viewport });
    expect(p.placement).toBe('top');
    expect(p.top).toBe(712);
  });

  it('left flips to right when clipped by the left edge', () => {
    const p = placeTooltip({ placement: 'left', trigger: trig({ left: 20, width: 40 }), tooltip, viewport });
    expect(p.placement).toBe('right');
    expect(p.left).toBe(68);
  });

  it('right flips to left when clipped by the right edge', () => {
    const p = placeTooltip({ placement: 'right', trigger: trig({ left: 940, width: 40 }), tooltip, viewport });
    expect(p.placement).toBe('left');
    expect(p.left).toBe(832);
  });
});

describe('placeTooltip — clamps', () => {
  it('slides right at the left edge and keeps the arrow on the trigger', () => {
    const p = placeTooltip({ placement: 'top', trigger: trig({ left: 0, width: 20 }), tooltip, viewport });
    expect(p.left).toBe(8);
    expect(p.arrowOffset).toBe(ARROW_EDGE);
  });

  it('slides left at the right edge and keeps the arrow inside the tooltip', () => {
    const p = placeTooltip({ placement: 'top', trigger: trig({ left: 980, width: 20 }), tooltip, viewport });
    expect(p.left).toBe(892);
    expect(p.arrowOffset).toBe(tooltip.width - ARROW_EDGE);
  });

  it('slides down for a side tooltip at the top edge', () => {
    const p = placeTooltip({ placement: 'right', trigger: trig({ top: 0, height: 20 }), tooltip, viewport });
    expect(p.top).toBe(8);
  });

  it('tracks the trigger centre with the arrow when nothing clamps', () => {
    const p = placeTooltip({ placement: 'top', trigger: trig({ left: 300, width: 40 }), tooltip, viewport });
    expect(p.left + p.arrowOffset).toBe(320);
  });
});

describe('placeTooltip — no room on either side', () => {
  const tiny = { width: 300, height: 100 };
  const tall = { width: 100, height: 80 };

  it('keeps the preferred side on a tie and stays inside the viewport', () => {
    const p = placeTooltip({ placement: 'top', trigger: { left: 100, top: 40, width: 50, height: 20 }, tooltip: tall, viewport: tiny });
    expect(p.placement).toBe('top');
    expect(p.top).toBeGreaterThanOrEqual(8);
    expect(p.top + tall.height).toBeLessThanOrEqual(tiny.height - 8);
  });

  it('takes the roomier side when neither fits', () => {
    const p = placeTooltip({ placement: 'top', trigger: { left: 100, top: 30, width: 50, height: 20 }, tooltip: tall, viewport: tiny });
    expect(p.placement).toBe('bottom');
    expect(p.top).toBe(12);
  });
});
