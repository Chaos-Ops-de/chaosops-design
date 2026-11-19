import { describe, expect, it } from 'vitest';
import { parsePlacement, placePopover } from './popoverLogic';

const viewport = { width: 1000, height: 800 };
const panel = { width: 200, height: 120 };
const trigger = { left: 400, top: 300, width: 100, height: 40 };

describe('web/Menu parsePlacement', () => {
  it('splits side and alignment', () => {
    expect(parsePlacement('bottom-start')).toEqual({ side: 'bottom', align: 'start' });
    expect(parsePlacement('top-end')).toEqual({ side: 'top', align: 'end' });
    expect(parsePlacement('bottom')).toEqual({ side: 'bottom', align: 'center' });
    expect(parsePlacement('left')).toEqual({ side: 'left', align: 'center' });
  });
});

describe('web/Menu placePopover', () => {
  it('lines the panel up with the trigger start edge below it', () => {
    const p = placePopover({ placement: 'bottom-start', trigger, panel, viewport });
    expect(p.side).toBe('bottom');
    expect(p.left).toBe(400);
    expect(p.top).toBe(300 + 40 + 6);
  });

  it('lines the panel up with the trigger end edge', () => {
    const p = placePopover({ placement: 'bottom-end', trigger, panel, viewport });
    expect(p.left).toBe(400 + 100 - 200);
  });

  it('centers on the trigger for the plain placement', () => {
    const p = placePopover({ placement: 'bottom', trigger, panel, viewport });
    expect(p.left).toBe(450 - 100);
  });

  it('mirrors start and end in right-to-left text', () => {
    expect(placePopover({ placement: 'bottom-start', trigger, panel, viewport, rtl: true }).left).toBe(300);
    expect(placePopover({ placement: 'bottom-end', trigger, panel, viewport, rtl: true }).left).toBe(400);
  });

  it('flips above the trigger when there is no room below', () => {
    const low = { left: 400, top: 740, width: 100, height: 40 };
    const p = placePopover({ placement: 'bottom-start', trigger: low, panel, viewport });
    expect(p.side).toBe('top');
    expect(p.top).toBe(740 - 6 - 120);
  });

  it('flips below when a top placement has no room above', () => {
    const high = { left: 400, top: 10, width: 100, height: 40 };
    expect(placePopover({ placement: 'top-start', trigger: high, panel, viewport }).side).toBe('bottom');
  });

  it('clamps inside the viewport near the right edge', () => {
    const edge = { left: 950, top: 300, width: 40, height: 40 };
    const p = placePopover({ placement: 'bottom-start', trigger: edge, panel, viewport });
    expect(p.left + panel.width).toBeLessThanOrEqual(viewport.width - 8);
  });

  it('clamps inside the viewport near the left edge', () => {
    const edge = { left: 0, top: 300, width: 40, height: 40 };
    expect(placePopover({ placement: 'bottom-end', trigger: edge, panel, viewport }).left).toBe(8);
  });

  it('opens to the side for left and right placements', () => {
    expect(placePopover({ placement: 'right', trigger, panel, viewport }).left).toBe(500 + 6);
    expect(placePopover({ placement: 'left', trigger, panel, viewport }).left).toBe(400 - 6 - 200);
  });

  it('stays on screen when neither side has room (takes the roomier one)', () => {
    const tall = { width: 200, height: 780 };
    const mid = { left: 400, top: 380, width: 100, height: 40 };
    const p = placePopover({ placement: 'bottom-start', trigger: mid, panel: tall, viewport });
    expect(p.top).toBeGreaterThanOrEqual(8);
    expect(p.top + tall.height).toBeLessThanOrEqual(viewport.height - 8);
  });
});
