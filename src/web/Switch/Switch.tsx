import React from 'react';
import './Switch.css';

export type SwitchSize = 'sm' | 'md';

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'children' | 'role' | 'type'> {
  checked: boolean;
  /**
   * Called with the requested next value. The switch is controlled and does not
   * flip on its own: set `checked` straight away for an optimistic flip, show
   * `pending` while the request runs, and set `checked` back yourself if the
   * server refuses (the knob then slides back).
   */
  onChange: (checked: boolean) => void;
  /** Text beside the switch; clicking it toggles too. Without it, pass `aria-label`. */
  label?: React.ReactNode;
  /** Shows a spinner in the knob, sets `aria-busy` and blocks clicks. */
  pending?: boolean;
  /** `md` = 20 px knob, `sm` = 16 px knob. */
  size?: SwitchSize;
}

/**
 * On/off switch (`role="switch"` on a native button, so Space and Enter work).
 *
 * Geometry: the rail is twice the knob's width, and the knob sits inset 3 px
 * inside it. (The guidance "padding equals the knob radius" can't hold
 * literally — the knob would have no room to travel — so a fixed 3 px inset is used.)
 * Rail color, knob slide and knob shadow animate together; the visual rail is
 * small but the button keeps a 44 px hit area.
 */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, onChange, label, pending = false, size = 'md', disabled, className, onClick, ...rest },
  ref,
) {
  const classes = [
    'chaos-switch',
    size === 'sm' ? 'chaos-switch--sm' : '',
    checked ? 'chaos-switch--checked' : '',
    pending ? 'chaos-switch--pending' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-busy={pending || undefined}
      className={classes}
      disabled={disabled}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || disabled || pending) return;
        onChange(!checked);
      }}
      {...rest}
    >
      <span className="chaos-switch__rail" aria-hidden="true">
        <span className="chaos-switch__knob">
          {pending && <span className="chaos-switch__spinner" />}
        </span>
      </span>
      {label != null && <span className="chaos-switch__label">{label}</span>}
    </button>
  );
});
