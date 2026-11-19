import { describe, expect, it } from 'vitest';
import {
  advance, canGoTo, furthestReachable, goBack, goTo, initialWizardState, interpretValidation,
  isFirst, isLast, parseWizard, serializeWizard,
} from './wizardLogic';

describe('web/Stepper interpretValidation', () => {
  it('treats true and undefined as valid', () => {
    expect(interpretValidation(true)).toEqual({ valid: true });
    expect(interpretValidation(undefined)).toEqual({ valid: true });
  });

  it('treats false as invalid without a message and a string as the message', () => {
    expect(interpretValidation(false)).toEqual({ valid: false });
    expect(interpretValidation('Name fehlt.')).toEqual({ valid: false, message: 'Name fehlt.' });
    expect(interpretValidation('')).toEqual({ valid: false });
  });
});

describe('web/Stepper initial state', () => {
  it('starts at the first step with nothing completed', () => {
    expect(initialWizardState(3)).toEqual({ index: 0, completed: [] });
  });

  it('cleans completed entries and never starts beyond what is reachable', () => {
    expect(initialWizardState(4, 3, [1, 1, 9, -1, 0])).toEqual({ index: 2, completed: [0, 1] });
    expect(initialWizardState(4, 3, [])).toEqual({ index: 0, completed: [] });
  });

  it('survives a non-integer index', () => {
    expect(initialWizardState(3, Number.NaN, [0])).toEqual({ index: 0, completed: [0] });
  });
});

describe('web/Stepper advance', () => {
  it('blocks on an invalid step, keeps the message and does not move', () => {
    const s = initialWizardState(3);
    const r = advance(s, 3, 'Bitte einen Namen eingeben.');
    expect(r.blocked).toBe(true);
    expect(r.message).toBe('Bitte einen Namen eingeben.');
    expect(r.state).toBe(s);
    expect(r.finished).toBe(false);
  });

  it('marks the step completed and moves on when valid', () => {
    const r = advance(initialWizardState(3), 3, true);
    expect(r.blocked).toBe(false);
    expect(r.state).toEqual({ index: 1, completed: [0] });
  });

  it('does not duplicate a completed step when re-advancing after going back', () => {
    const afterBack = goBack(advance(initialWizardState(3), 3, true).state);
    expect(advance(afterBack, 3, true).state).toEqual({ index: 1, completed: [0] });
  });

  it('reports finished on the last step without moving past it', () => {
    let s = initialWizardState(2);
    s = advance(s, 2, true).state;
    const r = advance(s, 2, true);
    expect(r.finished).toBe(true);
    expect(r.state).toEqual({ index: 1, completed: [0, 1] });
  });

  it('a one-step wizard finishes straight away', () => {
    expect(advance(initialWizardState(1), 1, undefined).finished).toBe(true);
  });
});

describe('web/Stepper back and jumps', () => {
  it('goes back one step, clamps at the first and keeps completed steps', () => {
    const s = { index: 2, completed: [0, 1] };
    expect(goBack(s)).toEqual({ index: 1, completed: [0, 1] });
    expect(goBack({ index: 0, completed: [] }).index).toBe(0);
  });

  it('only lets you open steps whose predecessors are all completed', () => {
    const s = { index: 1, completed: [0] };
    expect(furthestReachable(s.completed, 4)).toBe(1);
    expect(canGoTo(s, 0, 4)).toBe(true);
    expect(canGoTo(s, 1, 4)).toBe(true);
    expect(canGoTo(s, 2, 4)).toBe(false);
    expect(canGoTo(s, 9, 4)).toBe(false);
    expect(canGoTo(s, -1, 4)).toBe(false);
  });

  it('goTo moves when allowed and is a no-op otherwise', () => {
    const s = { index: 2, completed: [0, 1] };
    expect(goTo(s, 0, 4).index).toBe(0);
    const blocked = { index: 0, completed: [] as number[] };
    expect(goTo(blocked, 2, 4)).toBe(blocked);
  });

  it('knows the first and last step', () => {
    expect(isFirst(0)).toBe(true);
    expect(isFirst(1)).toBe(false);
    expect(isLast(2, 3)).toBe(true);
    expect(isLast(1, 3)).toBe(false);
  });
});

describe('web/Stepper persistence', () => {
  it('round-trips state and values', () => {
    const state = { index: 2, completed: [0, 1] };
    const parsed = parseWizard(serializeWizard(state, { name: 'Ada' }), 4);
    expect(parsed).toEqual({ state, values: { name: 'Ada' } });
  });

  it('returns null for missing, corrupt or foreign data', () => {
    expect(parseWizard(null, 3)).toBeNull();
    expect(parseWizard('', 3)).toBeNull();
    expect(parseWizard('{not json', 3)).toBeNull();
    expect(parseWizard(JSON.stringify({ v: 99, index: 1, completed: [] }), 3)).toBeNull();
    expect(parseWizard(JSON.stringify({ v: 1, index: 'x', completed: [] }), 3)).toBeNull();
  });

  it('repairs out-of-range saved progress when the step count shrank', () => {
    const raw = serializeWizard({ index: 5, completed: [0, 1, 2, 3, 4] }, {});
    expect(parseWizard(raw, 3)?.state).toEqual({ index: 2, completed: [0, 1, 2] });
  });
});
