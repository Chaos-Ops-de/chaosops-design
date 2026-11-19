import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, Check, Copy } from 'lucide-react';
import { copyText, type CopyDeps } from './copyText';
import './CopyButton.css';

export type CopyButtonSize = 'sm' | 'md';
type CopyStatus = 'idle' | 'copied' | 'failed';

export interface CopyButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick' | 'type'> {
  /** Text to copy. Use `getValue` when it has to be computed at click time. */
  value?: string;
  /** Computed at click time; wins over `value`. */
  getValue?: () => string | Promise<string>;
  /** Visible text next to the icon. Without it the button is icon-only: pass `aria-label` (defaults to "Kopieren"). */
  label?: React.ReactNode;
  size?: CopyButtonSize;
  /** Called with the copied text — hook a toast up here. */
  onCopied?: (text: string) => void;
  /** Called when copying failed. */
  onError?: () => void;
  /** How long the success icon stays, in ms. */
  resetAfter?: number;
  /** Swap the clipboard / document, for tests and stories. */
  deps?: CopyDeps;
}

/**
 * Icon button that copies text. The Copy icon swaps to Check for about 1.5 s
 * after success (AlertCircle on failure) and a polite live region announces
 * "Kopiert". The icon is small but the button keeps a 44 px hit area.
 */
export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton(
  { value, getValue, label, size = 'md', onCopied, onError, resetAfter = 1500, deps, className, disabled, title, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const settle = useCallback((next: CopyStatus) => {
    setStatus(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), resetAfter);
  }, [resetAfter]);

  const handleClick = async () => {
    let text = value ?? '';
    try {
      if (getValue) text = await getValue();
    } catch {
      settle('failed');
      onError?.();
      return;
    }
    const ok = await copyText(text, deps);
    if (ok) {
      settle('copied');
      onCopied?.(text);
    } else {
      settle('failed');
      onError?.();
    }
  };

  const Icon = status === 'copied' ? Check : status === 'failed' ? AlertCircle : Copy;
  const classes = [
    'chaos-copy',
    size === 'sm' ? 'chaos-copy--sm' : '',
    label != null ? 'chaos-copy--labelled' : '',
    status !== 'idle' ? `chaos-copy--${status}` : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type="button"
      className={classes}
      disabled={disabled}
      title={status === 'failed' ? 'Kopieren fehlgeschlagen' : title}
      aria-label={label == null ? ariaLabel ?? 'Kopieren' : ariaLabel}
      onClick={handleClick}
      {...rest}
    >
      <span className="chaos-copy__icon" aria-hidden="true">
        <Icon size={size === 'sm' ? 14 : 16} strokeWidth={2.25} />
      </span>
      {label != null && <span className="chaos-copy__label">{label}</span>}
      <span className="chaos-copy__status" role="status" aria-live="polite">
        {status === 'copied' ? 'Kopiert' : status === 'failed' ? 'Kopieren fehlgeschlagen' : ''}
      </span>
    </button>
  );
});
