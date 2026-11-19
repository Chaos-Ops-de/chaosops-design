import { useCallback, useRef, useState } from 'react';
import {
  initialValidationState,
  onBlur as blurState,
  onChange as changeState,
  type ValidationState,
  type Validator,
} from './validationState';

export interface BlurValidation<T> {
  /** Error message to show, if any — pass to `<FormField error={…}>`. */
  error: string | undefined;
  /** True when the last check passed — pass to `<FormField valid={…}>` for the green check. */
  valid: boolean;
  /** Call from the control's `onBlur` with its current value. */
  onBlur: (value: T) => void;
  /** Call from the control's `onChange` with the new value. */
  onChange: (value: T) => void;
  /** Clear error and valid state. */
  reset: () => void;
}

/**
 * Validate on blur, then live once the field has been wrong. See
 * `validationState` for the exact rules.
 */
export function useBlurValidation<T = string>(validate: Validator<T>): BlurValidation<T> {
  const [state, setState] = useState<ValidationState>(initialValidationState);

  // The validator is read through a ref so callers can pass an inline
  // function without the returned handlers changing identity every render.
  const validateRef = useRef(validate);
  validateRef.current = validate;

  const onBlur = useCallback((value: T) => {
    setState((s) => blurState(s, value, validateRef.current));
  }, []);

  const onChange = useCallback((value: T) => {
    setState((s) => changeState(s, value, validateRef.current));
  }, []);

  const reset = useCallback(() => setState(initialValidationState), []);

  return { error: state.error, valid: state.valid, onBlur, onChange, reset };
}
