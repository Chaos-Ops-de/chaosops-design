import React from 'react';
import '../surface.css';
import './SelectCards.css';

export interface SelectCardOption {
  value: string;
  label: string;
  /** Picture / icon shown above the label. */
  image: React.ReactNode;
}

export interface SelectCardsProps {
  label?: string;
  options: SelectCardOption[];
  value: string | null;
  onChange: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

/** Single-choice picture cards in a row: outlined tile per option, the selected one turns amber. */
export const SelectCards: React.FC<SelectCardsProps> = ({ label, options, value, onChange, className, style }) => (
  <div className={['chaos-surface', 'chaos-select-cards', className].filter(Boolean).join(' ')} style={style}>
    {label && <span className="chaos-surface__label chaos-select-cards__label">{label}</span>}
    <div className="chaos-select-cards__row" role="radiogroup" aria-label={label}>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`chaos-select-cards__option${selected ? ' chaos-select-cards__option--selected' : ''}`}
            onClick={() => onChange(o.value)}
          >
            <span className="chaos-select-cards__image" aria-hidden="true">{o.image}</span>
            <span className="chaos-select-cards__text">{o.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);
