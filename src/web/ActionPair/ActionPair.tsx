import React from 'react';
import './ActionPair.css';

export interface ActionPairProps {
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  primaryDisabled?: boolean;
  onHaptic?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/** Footer pair: mint outlined pill ("Submit") plus a plain bold text action ("Skip Now"). */
export const ActionPair: React.FC<ActionPairProps> = ({
  primaryLabel, secondaryLabel, onPrimary, onSecondary, primaryDisabled, onHaptic, className, style,
}) => {
  const press = (fn: () => void) => () => { try { onHaptic?.(); } catch { /* ignore */ } fn(); };
  return (
    <div className={['chaos-action-pair', className].filter(Boolean).join(' ')} style={style}>
      <button type="button" className="chaos-action-pair__primary" disabled={primaryDisabled} onClick={press(onPrimary)}>
        {primaryLabel}
      </button>
      <button type="button" className="chaos-action-pair__secondary" onClick={press(onSecondary)}>
        {secondaryLabel}
      </button>
    </div>
  );
};
