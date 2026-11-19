/**
 * Validate on blur, then go live.
 *
 * - While typing for the first time nothing is flagged (no "invalid email"
 *   after one letter).
 * - Leaving the field validates it.
 * - Once a field has shown an error it switches to live: every change is
 *   re-checked, so the error clears the instant it is fixed (and comes back
 *   if the value breaks again) without a second submit or blur.
 */

export type ValidationPhase = 'pristine' | 'validated';

export interface ValidationState {
  phase: ValidationPhase;
  /** Current error message, if any. */
  error: string | undefined;
  /** True after a validation that passed and while the value hasn't changed since. */
  valid: boolean;
  /** True once an error has been shown; changes are then validated as they happen. */
  live: boolean;
}

/** A validator returns an error message, or `undefined` when the value is fine. */
export type Validator<T> = (value: T) => string | undefined;

export const initialValidationState: ValidationState = {
  phase: 'pristine',
  error: undefined,
  valid: false,
  live: false,
};

function validated<T>(state: ValidationState, value: T, validate: Validator<T>): ValidationState {
  const error = validate(value);
  return {
    phase: 'validated',
    error,
    valid: error === undefined,
    live: state.live || error !== undefined,
  };
}

/** The user left the field: validate it. */
export function onBlur<T>(state: ValidationState, value: T, validate: Validator<T>): ValidationState {
  return validated(state, value, validate);
}

/**
 * The value changed.
 * - Live (an error was shown before): re-validate right away.
 * - Not live: stay quiet. A previously valid field drops back to pristine so a
 *   green check never lingers on a value it didn't check.
 */
export function onChange<T>(state: ValidationState, value: T, validate: Validator<T>): ValidationState {
  if (state.live) return validated(state, value, validate);
  if (state.phase === 'pristine') return state;
  return initialValidationState;
}

/** Forget everything (e.g. after a successful submit or a form reset). */
export function reset(): ValidationState {
  return initialValidationState;
}
