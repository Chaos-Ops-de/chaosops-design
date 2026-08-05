import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { ICON_MAP } from '../IconPicker';
import './Select.css';

export interface SelectOption {
    value: string;
    label: string;
    color?: string;
    icon?: string;
}

export interface SelectProps {
    options: SelectOption[];
    value: string | string[];
    onChange: (value: string | string[]) => void;
    placeholder?: string;
    multiple?: boolean;
    label?: string;
    onCreateNew?: () => void;
}

export const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Bitte wählen...',
    multiple = false,
    label,
    onCreateNew
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        if (multiple) {
            const currentValues = Array.isArray(value) ? value : [];
            const newValue = currentValues.includes(optionValue)
                ? currentValues.filter(v => v !== optionValue)
                : [...currentValues, optionValue];
            onChange(newValue);
        } else {
            onChange(optionValue);
            setIsOpen(false);
        }
    };

    const getSelectedOptions = () => {
        if (multiple) {
            return options.filter(opt => (Array.isArray(value) ? value : []).includes(opt.value));
        }
        return options.find(opt => opt.value === value);
    };

    const selected = getSelectedOptions();

    return (
        <div className="chaos-select-container" ref={containerRef}>
            {label && <label className="chaos-select-label">{label}</label>}

            <div
                className={`chaos-select-button ${isOpen ? 'chaos-select-button--active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                tabIndex={0}
            >
                <div>
                    {multiple ? (
                        (selected as SelectOption[]).length > 0 ? (
                            <div className="chaos-select-multiple-values">
                                {(selected as SelectOption[]).map(opt => (
                                    <div
                                        key={opt.value}
                                        className="chaos-select-chip"
                                        style={{ backgroundColor: opt.color || '#64748b' }}
                                    >
                                        {opt.icon && ICON_MAP[opt.icon] && React.createElement(ICON_MAP[opt.icon]!, { size: 12 })}
                                        {opt.label}
                                        <span
                                            role="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelect(opt.value);
                                            }}
                                            style={{ marginLeft: 4, cursor: 'pointer', display: 'flex' }}
                                        >
                                            <X size={12} />
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span className="chaos-select-placeholder">{placeholder}</span>
                        )
                    ) : (
                        (selected as SelectOption) ? (
                            <div className="chaos-select-single-value">
                                {(selected as SelectOption).color && (
                                    <div
                                        className="chaos-select-option-icon"
                                        style={{ backgroundColor: (selected as SelectOption).color + '20', color: (selected as SelectOption).color }}
                                    >
                                        {(selected as SelectOption).icon && ICON_MAP[(selected as SelectOption).icon!]
                                            ? React.createElement(ICON_MAP[(selected as SelectOption).icon!]!, { size: 18, strokeWidth: 2.5 })
                                            : <div style={{ width: 14, height: 14, borderRadius: '50%', background: (selected as SelectOption).color }} />
                                        }
                                    </div>
                                )}
                                <span>{(selected as SelectOption).label}</span>
                            </div>
                        ) : (
                            <span className="chaos-select-placeholder">{placeholder}</span>
                        )
                    )}
                </div>
                <ChevronDown size={16} color="#94a3b8" />
            </div>

            {isOpen && (
                <div className="chaos-select-dropdown">
                    {options.map(option => {
                        const isSelected = multiple
                            ? (Array.isArray(value) ? value : []).includes(option.value)
                            : value === option.value;

                        return (
                            <div
                                key={option.value}
                                className={`chaos-select-option ${isSelected ? 'chaos-select-option--selected' : ''}`}
                                onClick={() => handleSelect(option.value)}
                            >
                                {option.color && (
                                    <div
                                        className="chaos-select-option-icon"
                                        style={{
                                            backgroundColor: option.color + '20',
                                            color: option.color
                                        }}
                                    >
                                        {option.icon && ICON_MAP[option.icon]
                                            ? React.createElement(ICON_MAP[option.icon]!, { size: 18, strokeWidth: 2.5 })
                                            : <div style={{ width: 14, height: 14, borderRadius: '50%', background: option.color }} />
                                        }
                                    </div>
                                )}
                                <span>{option.label}</span>
                                {isSelected && <Check size={16} className="chaos-select-checkmark" />}
                            </div>
                        );
                    })}
                    {options.length === 0 && !onCreateNew && (
                        <div style={{ padding: '0.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                            Keine Optionen verfügbar
                        </div>
                    )}
                    {onCreateNew && (
                        <div
                            style={{
                                padding: '0.6rem 0.75rem',
                                marginTop: '0.25rem',
                                borderTop: '1px solid #e2e8f0',
                                color: '#3b82f6',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: '#f8fafc',
                                borderRadius: '0 0 6px 6px',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#eff6ff';
                                e.currentTarget.style.color = '#2563eb';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8fafc';
                                e.currentTarget.style.color = '#3b82f6';
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsOpen(false);
                                onCreateNew();
                            }}
                        >
                            <span style={{ fontSize: '1.2em' }}>+</span> Neue Kategorie erstellen
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
