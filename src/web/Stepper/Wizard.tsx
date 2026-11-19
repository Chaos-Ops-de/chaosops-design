import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from '../Button';
import type { ThemeStorage } from '../../theme/storage';
import { Stepper, type StepperVariant } from './Stepper';
import {
  advance, goBack as goBackState, goTo as goToState, canGoTo, initialWizardState, interpretValidation,
  isFirst, isLast, parseWizard, serializeWizard, type StepResult, type WizardState,
} from './wizardLogic';
import './Stepper.css';

/*
 * Usage notes: group fields by context (personal, shipping, payment, review),
 * not by count, so each step earns its own screen. Validate inside the step so
 * a wrong e-mail on step one never surfaces on step four. Progress is saved on
 * every change when `persistKey` and `storage` are given, so Back and a page
 * refresh keep what was entered (values must be JSON-serializable).
 */

export interface WizardStepContext<V> {
  values: V;
  setValues: (next: V | ((prev: V) => V)) => void;
  index: number;
  valid: boolean;
  /** Message from `validate` while the step is invalid. */
  message?: string;
  next: () => void;
  back: () => void;
}

export interface WizardStep<V> {
  id: string;
  label: string;
  /** Static content. Use `render` when the step needs the values. */
  content?: React.ReactNode;
  render?: (ctx: WizardStepContext<V>) => React.ReactNode;
  /** `true`/`undefined` valid, `false` invalid, a string invalid with that message. Gates "Weiter". */
  validate?: (values: V) => boolean | string | undefined;
}

export interface UseWizardOptions<V> {
  steps: readonly WizardStep<V>[];
  /** Starting values when uncontrolled. */
  initialValues?: V;
  /** Controlled values. Pair with `onChange`. */
  values?: V;
  onChange?: (values: V) => void;
  /** Save progress and values under this key (needs `storage`). */
  persistKey?: string;
  storage?: ThemeStorage;
  onFinish?: (values: V) => void;
}

export interface UseWizard<V> {
  index: number;
  step: WizardStep<V> | undefined;
  steps: readonly WizardStep<V>[];
  completed: number[];
  values: V;
  setValues: (next: V | ((prev: V) => V)) => void;
  /** Validity of the current step right now. */
  valid: boolean;
  message?: string;
  /** Message from the last blocked `next()`; cleared when the step or values change. */
  error?: string;
  isFirst: boolean;
  isLast: boolean;
  /** False while saved progress is still being loaded from `storage`. */
  hydrated: boolean;
  next: () => void;
  back: () => void;
  goTo: (index: number) => void;
  canGoTo: (index: number) => boolean;
}

/** State and navigation for a validated, optionally persisted, multi-step flow. */
export function useWizard<V>({
  steps, initialValues, values: controlledValues, onChange, persistKey, storage, onFinish,
}: UseWizardOptions<V>): UseWizard<V> {
  const count = steps.length;
  const controlled = controlledValues !== undefined;
  const [state, setState] = useState<WizardState>(() => initialWizardState(count));
  const [internalValues, setInternalValues] = useState<V>(initialValues as V);
  const [error, setError] = useState<string | undefined>();
  const persisted = Boolean(persistKey && storage);
  const [hydrated, setHydrated] = useState(!persisted);

  const values = controlled ? (controlledValues as V) : internalValues;
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const applyValues = useCallback((next: V) => {
    if (!controlled) setInternalValues(next);
    onChangeRef.current?.(next);
  }, [controlled]);

  const setValues = useCallback((next: V | ((prev: V) => V)) => {
    const resolved = typeof next === 'function' ? (next as (prev: V) => V)(valuesRef.current) : next;
    valuesRef.current = resolved;
    setError(undefined);
    applyValues(resolved);
  }, [applyValues]);

  // Load saved progress once.
  useEffect(() => {
    if (!persistKey || !storage) return;
    let cancelled = false;
    Promise.resolve(storage.getItem(persistKey)).then((raw) => {
      if (cancelled) return;
      const saved = parseWizard(raw, count);
      if (saved) {
        setState(saved.state);
        if (saved.values !== undefined) applyValues(saved.values as V);
      }
      setHydrated(true);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistKey, storage]);

  // Save on every step or value change, once the saved copy has been read.
  useEffect(() => {
    if (!persistKey || !storage || !hydrated) return;
    Promise.resolve(storage.setItem(persistKey, serializeWizard(state, values))).catch(() => {});
  }, [state, values, hydrated, persistKey, storage]);

  const step = steps[state.index];
  const check = interpretValidation(step?.validate?.(values) as StepResult);

  const next = useCallback(() => {
    const result = advance(state, count, steps[state.index]?.validate?.(valuesRef.current));
    if (result.blocked) {
      setError(result.message);
      return;
    }
    setError(undefined);
    setState(result.state);
    if (result.finished) onFinishRef.current?.(valuesRef.current);
  }, [state, count, steps]);

  const back = useCallback(() => {
    setError(undefined);
    setState((s) => goBackState(s));
  }, []);

  const goTo = useCallback((index: number) => {
    setError(undefined);
    setState((s) => goToState(s, index, count));
  }, [count]);

  return {
    index: state.index,
    step,
    steps,
    completed: state.completed,
    values,
    setValues,
    valid: check.valid,
    message: check.message,
    error,
    isFirst: isFirst(state.index),
    isLast: isLast(state.index, count),
    hydrated,
    next,
    back,
    goTo,
    canGoTo: (index: number) => canGoTo(state, index, count),
  };
}

export interface WizardProps<V> extends UseWizardOptions<V> {
  variant?: StepperVariant;
  labels?: { back?: string; next?: string; finish?: string };
  className?: string;
}

/** Stepper, the current step, and Zurück / Weiter. "Weiter" stays disabled while the step is invalid. */
export function Wizard<V>({ variant = 'bar', labels, className, ...options }: WizardProps<V>): React.ReactElement {
  const wizard = useWizard<V>(options);
  const { step, index, steps, isFirst: first, isLast: last, valid, message, error } = wizard;
  const back = labels?.back ?? 'Zurück';
  const nextLabel = last ? (labels?.finish ?? 'Fertigstellen') : (labels?.next ?? 'Weiter');
  const shown = error ?? message;

  const ctx: WizardStepContext<V> = {
    values: wizard.values,
    setValues: wizard.setValues,
    index,
    valid,
    message,
    next: wizard.next,
    back: wizard.back,
  };

  return (
    <section className={['chaos-wizard', className].filter(Boolean).join(' ')} aria-busy={!wizard.hydrated || undefined}>
      <Stepper steps={steps} current={index} variant={variant} />
      {step && (
        <div className="chaos-wizard__step" role="group" aria-label={step.label}>
          <h2 className="chaos-wizard__heading">{step.label}</h2>
          {step.render ? step.render(ctx) : step.content}
        </div>
      )}
      {shown && !valid && (
        <p className="chaos-wizard__hint" role="status">
          <Info size={16} aria-hidden="true" />
          {shown}
        </p>
      )}
      <div className="chaos-wizard__nav">
        {first ? <span /> : <Button variant="ghost" onClick={wizard.back}>{back}</Button>}
        <Button variant={last ? 'accent' : 'primary'} onClick={wizard.next} disabled={!valid} disabledReason={message}>
          {nextLabel}
        </Button>
      </div>
    </section>
  );
}
