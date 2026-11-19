import React from 'react';
import { Mic, Search, SlidersHorizontal } from 'lucide-react';
import './SearchBar.css';

export interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  /** Shows a mic button inside the field when given. */
  onMicClick?: () => void;
  /** Shows a separate square filter button next to the field when given. */
  onFilterClick?: () => void;
  micIcon?: React.ReactNode;
  filterIcon?: React.ReactNode;
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Outlined pill search field with leading magnifier, optional mic, and an optional mint filter button beside it. */
export const SearchBar: React.FC<SearchBarProps> = ({
  value, onChange, placeholder = 'Suchen', onMicClick, onFilterClick, micIcon, filterIcon, 'aria-label': ariaLabel, className, style,
}) => (
  <div className={['chaos-search-bar', className].filter(Boolean).join(' ')} role="search" style={style}>
    <label className="chaos-search-bar__field">
      <Search size={18} aria-hidden="true" />
      <input
        type="search"
        className="chaos-search-bar__input"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {onMicClick && (
        <button type="button" className="chaos-search-bar__mic" aria-label="Spracheingabe" onClick={onMicClick}>
          {micIcon ?? <Mic size={20} />}
        </button>
      )}
    </label>
    {onFilterClick && (
      <button type="button" className="chaos-search-bar__filter" aria-label="Filter" onClick={onFilterClick}>
        {filterIcon ?? <SlidersHorizontal size={20} />}
      </button>
    )}
  </div>
);
