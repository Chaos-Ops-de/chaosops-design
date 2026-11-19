/** What a step's `validate` may return: `true`/`undefined` = valid, `false` = invalid, a string = invalid with that message. */
export type StepResult = boolean | string | undefined;

export interface Validity {
  valid: boolean;
  message?: string;
}

/** Turns a `validate` return value into a verdict plus an optional message. */
export function interpretValidation(result: StepResult): Validity {
  if (result === undefined || result === true) return { valid: true };
  if (result === false) return { valid: false };
  return result ? { valid: false, message: result } : { valid: false };
}

export interface WizardState {
  /** Current step, 0-based. */
  index: number;
  /** Steps already passed with a valid result, sorted ascending. */
  completed: number[];
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));

/** The furthest step the user may open: the first one not completed yet. */
export function furthestReachable(completed: readonly number[], count: number): number {
  const done = new Set(completed);
  let i = 0;
  while (done.has(i)) i++;
  return clamp(i, 0, Math.max(0, count - 1));
}

/** Builds a state, dropping bad entries and never starting beyond what is reachable. */
export function initialWizardState(count: number, index = 0, completed: readonly number[] = []): WizardState {
  const max = Math.max(0, count - 1);
  const clean = [...new Set(completed.filter((n) => Number.isInteger(n) && n >= 0 && n <= max))].sort((a, b) => a - b);
  const reach = furthestReachable(clean, count);
  return { index: clamp(Number.isInteger(index) ? index : 0, 0, reach), completed: clean };
}

export const isFirst = (index: number) => index <= 0;
export const isLast = (index: number, count: number) => index >= count - 1;

export interface AdvanceResult {
  state: WizardState;
  /** The current step is invalid, so nothing moved. */
  blocked: boolean;
  message?: string;
  /** Advanced from the last step: the wizard is done. */
  finished: boolean;
}

/**
 * "Weiter" / "Fertig". An invalid step blocks and keeps its message; a valid
 * one is marked completed and moves on. On the last step it does not move, it
 * reports `finished` instead.
 */
export function advance(state: WizardState, count: number, result: StepResult): AdvanceResult {
  const { valid, message } = interpretValidation(result);
  if (!valid) return { state, blocked: true, message, finished: false };

  const completed = state.completed.includes(state.index)
    ? state.completed
    : [...state.completed, state.index].sort((a, b) => a - b);
  const last = isLast(state.index, count);
  return {
    state: { index: last ? state.index : state.index + 1, completed },
    blocked: false,
    finished: last,
  };
}

/** One step back. Completed steps stay completed, so the entered data is kept. */
export function goBack(state: WizardState): WizardState {
  return { ...state, index: Math.max(0, state.index - 1) };
}

/** A step can be opened if every step before it is completed (no skipping validation). */
export function canGoTo(state: WizardState, target: number, count: number): boolean {
  return Number.isInteger(target) && target >= 0 && target < count && target <= furthestReachable(state.completed, count);
}

/** Jumps to `target` when allowed; otherwise returns the state unchanged. */
export function goTo(state: WizardState, target: number, count: number): WizardState {
  return canGoTo(state, target, count) ? { ...state, index: target } : state;
}

const STORAGE_VERSION = 1;

/** JSON for persisting progress plus the entered values (values must be serializable). */
export function serializeWizard(state: WizardState, values: unknown): string {
  return JSON.stringify({ v: STORAGE_VERSION, index: state.index, completed: state.completed, values });
}

/** Reads what `serializeWizard` wrote; `null` for missing, foreign or corrupt data. */
export function parseWizard(raw: string | null | undefined, count: number): { state: WizardState; values: unknown } | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as { v?: unknown; index?: unknown; completed?: unknown; values?: unknown };
    if (!data || typeof data !== 'object' || data.v !== STORAGE_VERSION) return null;
    if (typeof data.index !== 'number' || !Array.isArray(data.completed)) return null;
    return {
      state: initialWizardState(count, data.index, data.completed.filter((n): n is number => typeof n === 'number')),
      values: data.values,
    };
  } catch {
    return null;
  }
}
