import React, { useId, useState } from 'react';
import './RadioGroup.css';

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  /** Secondary line under the label. */
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  /** Shared by all radios; generated when omitted. Also what a surrounding `<form>` submits. */
  name?: string;
  /** Controlled value. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
  /** Visible group label. Without it, pass `aria-label`. */
  legend?: React.ReactNode;
  /** Marks the group invalid (danger border on every radio + `aria-invalid`). */
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
}

/**
 * Single-choice group on native radios in one `fieldset`: Tab lands on the
 * selected option (or the first), the arrow keys move and select, and a form
 * submits the value, all without any key handling here. Only the dot is
 * redrawn; every row keeps a 44 px hit area.
 */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  options, name, value, defaultValue, onValueChange, orientation = 'vertical', legend, invalid,
  disabled, required, id, className, 'aria-label': ariaLabel, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid,
}) => {
  const autoId = useId();
  const groupName = name ?? `radio-${autoId}`;
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true';

  const select = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <fieldset
      id={id}
      role="radiogroup"
      className={['chaos-radio-group', `chaos-radio-group--${orientation}`, className].filter(Boolean).join(' ')}
      disabled={disabled}
      aria-label={legend == null ? ariaLabel : undefined}
      aria-describedby={describedBy}
      aria-invalid={isInvalid || undefined}
      aria-required={required || undefined}
    >
      {legend != null && <legend className="chaos-radio-group__legend">{legend}</legend>}
      <div className="chaos-radio-group__options">
        {options.map((option) => {
          const optionId = `${groupName}-${option.value}`;
          const descriptionId = option.description != null ? `${optionId}-description` : undefined;
          return (
            <label key={option.value} className="chaos-radio" data-disabled={option.disabled || disabled || undefined}>
              <input
                id={optionId}
                type="radio"
                className="chaos-radio__input"
                name={groupName}
                value={option.value}
                checked={current === option.value}
                disabled={option.disabled}
                required={required}
                aria-invalid={isInvalid || undefined}
                aria-describedby={descriptionId}
                onChange={() => select(option.value)}
              />
              <span className="chaos-radio__dot" aria-hidden="true" />
              <span className="chaos-radio__text">
                <span className="chaos-radio__label">{option.label}</span>
                {option.description != null && <span id={descriptionId} className="chaos-radio__description">{option.description}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
