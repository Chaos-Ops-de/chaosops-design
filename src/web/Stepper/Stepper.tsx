import React from 'react';
import { Check } from 'lucide-react';
import './Stepper.css';

export type StepperVariant = 'bar' | 'dots' | 'labels';

export interface StepperStep {
  id: string;
  label: string;
}

export interface StepperProps {
  steps: readonly StepperStep[];
  /** Current step, 0-based. */
  current: number;
  /**
   * One progress style per stepper: `bar` (default) fills a segmented bar and
   * names the current step above it; `dots` is a row of numbered dots; `labels`
   * puts every step name under its dot. Completed steps show a check in `dots`
   * and `labels`; in `bar` they are the filled segments.
   */
  variant?: StepperVariant;
  /** Accessible name of the list. */
  'aria-label'?: string;
  className?: string;
}

/** Where the user is in a multi-step flow. Pair it with the Wizard, or drive it yourself. */
export const Stepper: React.FC<StepperProps> = ({
  steps,
  current,
  variant = 'bar',
  'aria-label': ariaLabel = 'Fortschritt',
  className,
}) => {
  const active = Math.min(Math.max(0, current), Math.max(0, steps.length - 1));
  const currentStep = steps[active];

  return (
    <div className={['chaos-stepper', `chaos-stepper--${variant}`, className].filter(Boolean).join(' ')}>
      {variant === 'bar' && currentStep && (
        <p className="chaos-stepper__caption">
          <span className="chaos-stepper__count">Schritt {active + 1} von {steps.length}</span>
          <span className="chaos-stepper__title">{currentStep.label}</span>
        </p>
      )}
      <ol className="chaos-stepper__list" aria-label={ariaLabel}>
        {steps.map((step, i) => {
          const state = i < active ? 'done' : i === active ? 'current' : 'todo';
          return (
            <li
              key={step.id}
              className={`chaos-stepper__step chaos-stepper__step--${state}`}
              aria-current={state === 'current' ? 'step' : undefined}
            >
              {variant !== 'bar' && (
                <span className="chaos-stepper__dot" aria-hidden="true">
                  {state === 'done' ? <Check size={14} strokeWidth={3} /> : variant === 'labels' ? i + 1 : null}
                </span>
              )}
              {variant === 'labels' ? (
                <span className="chaos-stepper__label">{step.label}</span>
              ) : (
                <span className="chaos-stepper__sr">
                  {step.label}{state === 'done' ? ', abgeschlossen' : ''}
                </span>
              )}
              {variant === 'labels' && state === 'done' && <span className="chaos-stepper__sr">, abgeschlossen</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
