import React, { useId, useState } from 'react';
import { Check, Circle, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Input, type InputProps } from '../Input';
import {
  defaultPasswordRules,
  estimateEntropyBits,
  generatePassword,
  passwordRequirements,
  strengthHints,
  strengthLevel,
  type PasswordRule,
} from '../../utils/password';
import './PasswordField.css';

export interface PasswordFieldProps extends Omit<InputProps, 'type'> {
  /** Shows a bar that grows as the password gets stronger, with a coaching line. */
  showStrength?: boolean;
  /** Shows a live checklist of `rules` that ticks as the user types. */
  showChecklist?: boolean;
  /** Rules for the checklist; defaults to a 12-character minimum. */
  rules?: PasswordRule[];
  /**
   * Offers a generated password: shows a key button that calls this with a
   * fresh 16-character password and reveals the field so it can be read and
   * copied. Set the value yourself in the callback.
   */
  onGenerate?: (password: string) => void;
}

/**
 * Password input with an eye toggle, an optional strength bar and requirement
 * checklist, and an optional "generate" button. Pasting is never blocked —
 * password managers type stronger passwords than people do. Because it passes
 * `id` and `aria-*` through to the input, it works inside `FormField`.
 */
export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { showStrength = false, showChecklist = false, rules = defaultPasswordRules, onGenerate, className, value, defaultValue, onChange, autoComplete, disabled, ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState(typeof defaultValue === 'string' ? defaultValue : '');
  const password = typeof value === 'string' ? value : typed;

  const listId = useId();
  const choosing = showStrength || showChecklist || Boolean(onGenerate);
  const actions = onGenerate ? 2 : 1;

  const bits = estimateEntropyBits(password);
  const level = strengthLevel(bits);
  const requirements = showChecklist ? passwordRequirements(password, rules) : [];
  const metCount = requirements.filter((r) => r.met).length;

  return (
    <div className={['chaos-password', className].filter(Boolean).join(' ')}>
      <div className="chaos-password__field" style={{ '--chaos-password-actions': actions } as React.CSSProperties}>
        <Input
          ref={ref}
          {...rest}
          type={visible ? 'text' : 'password'}
          className="chaos-password__input"
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          autoComplete={autoComplete ?? (choosing ? 'new-password' : 'current-password')}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          onChange={(e) => {
            setTyped(e.target.value);
            onChange?.(e);
          }}
        />
        <div className="chaos-password__actions">
          {onGenerate && (
            <button
              type="button"
              className="chaos-password__action"
              disabled={disabled}
              aria-label="Passwort vorschlagen"
              title="Passwort vorschlagen"
              onClick={() => {
                onGenerate(generatePassword(16));
                setVisible(true);
              }}
            >
              <KeyRound size={18} aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            className="chaos-password__action"
            disabled={disabled}
            aria-pressed={visible}
            aria-label={visible ? 'Passwort verbergen' : 'Passwort anzeigen'}
            title={visible ? 'Passwort verbergen' : 'Passwort anzeigen'}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {showStrength && (
        <div className="chaos-password__strength">
          <div
            className="chaos-password__meter"
            role="progressbar"
            aria-label="Passwortstärke"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={password ? level : 0}
            aria-valuetext={password ? strengthHints[level] : undefined}
          >
            <div
              className="chaos-password__meter-fill"
              data-level={level}
              style={{ width: password ? `${((level + 1) / 5) * 100}%` : '0%' }}
            />
          </div>
          <span className="chaos-password__hint">{password ? strengthHints[level] : ''}</span>
        </div>
      )}

      {showChecklist && (
        <>
          <ul className="chaos-password__checklist" id={listId} aria-label="Anforderungen">
            {requirements.map((req) => (
              <li key={req.id} className="chaos-password__rule" data-met={req.met || undefined}>
                {req.met ? <Check size={14} strokeWidth={3} aria-hidden="true" /> : <Circle size={14} aria-hidden="true" />}
                <span>{req.label}</span>
              </li>
            ))}
          </ul>
          <span className="chaos-password__sr" aria-live="polite">
            {password ? `${metCount} von ${requirements.length} Anforderungen erfüllt` : ''}
          </span>
        </>
      )}
    </div>
  );
});
