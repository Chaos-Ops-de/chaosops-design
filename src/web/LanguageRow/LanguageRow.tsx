import React from 'react';
import { Check } from 'lucide-react';
import './LanguageRow.css';

export interface LanguageRowProps {
  label: string;
  /** Icon node or a short text code such as "DE". Shown in an outlined tile. */
  leading?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/** Single-choice row (language, setting): outlined tile, label, green check circle; amber tint when selected. */
export const LanguageRow: React.FC<LanguageRowProps> = ({ label, leading, selected, onClick, className, style }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onClick}
    className={['chaos-language-row', selected ? 'chaos-language-row--selected' : '', className].filter(Boolean).join(' ')}
    style={style}
  >
    {leading != null && <span className="chaos-language-row__tile">{leading}</span>}
    <span className="chaos-language-row__label">{label}</span>
    <span className="chaos-language-row__check" aria-hidden="true">{selected && <Check size={14} strokeWidth={3} />}</span>
  </button>
);
