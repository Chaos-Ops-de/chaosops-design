import { describe, expect, it } from 'vitest';
import { initialValidationState, onBlur, onChange, reset, type Validator } from './validationState';

const email: Validator<string> = (v) => (/^\S+@\S+\.\S+$/.test(v) ? undefined : 'Bitte eine gültige E-Mail eingeben.');

describe('validationState', () => {
  it('starts pristine with no error and not valid', () => {
    expect(initialValidationState).toEqual({ phase: 'pristine', error: undefined, valid: false, live: false });
  });

  it('shows nothing while typing for the first time', () => {
    const s = onChange(initialValidationState, 'a', email);
    expect(s).toBe(initialValidationState);
    expect(s.error).toBeUndefined();
  });

  it('flags an invalid value on blur and goes live', () => {
    const s = onBlur(initialValidationState, 'anna@', email);
    expect(s).toEqual({ phase: 'validated', error: 'Bitte eine gültige E-Mail eingeben.', valid: false, live: true });
  });

  it('marks a valid value valid on blur without going live', () => {
    const s = onBlur(initialValidationState, 'anna@example.com', email);
    expect(s).toEqual({ phase: 'validated', error: undefined, valid: true, live: false });
  });

  it('clears the error the instant it is fixed', () => {
    let s = onBlur(initialValidationState, 'anna@', email);
    s = onChange(s, 'anna@example', email);
    expect(s.error).toBeDefined();
    s = onChange(s, 'anna@example.com', email);
    expect(s.error).toBeUndefined();
    expect(s.valid).toBe(true);
  });

  it('re-errors live when a cleared field breaks again', () => {
    let s = onBlur(initialValidationState, 'nope', email);
    s = onChange(s, 'anna@example.com', email);
    expect(s.error).toBeUndefined();
    s = onChange(s, 'anna@example', email);
    expect(s.error).toBe('Bitte eine gültige E-Mail eingeben.');
    expect(s.valid).toBe(false);
  });

  it('drops a green check back to pristine when a non-live field is edited', () => {
    let s = onBlur(initialValidationState, 'anna@example.com', email);
    s = onChange(s, 'anna@example.co', email);
    expect(s).toBe(initialValidationState);
  });

  it('does not flag a once-valid field mid-edit; the next blur decides', () => {
    let s = onBlur(initialValidationState, 'anna@example.com', email);
    s = onChange(s, 'anna', email);
    expect(s.error).toBeUndefined();
    s = onBlur(s, 'anna', email);
    expect(s.error).toBeDefined();
  });

  it('treats a validator returning undefined as always valid', () => {
    const always: Validator<string> = () => undefined;
    const s = onBlur(initialValidationState, '', always);
    expect(s.error).toBeUndefined();
    expect(s.valid).toBe(true);
    expect(s.live).toBe(false);
  });

  it('reset forgets the error and live mode', () => {
    let s = onBlur(initialValidationState, 'nope', email);
    s = reset();
    expect(s).toEqual(initialValidationState);
    expect(onChange(s, 'x', email)).toBe(initialValidationState);
  });
});
