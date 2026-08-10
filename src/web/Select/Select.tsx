import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
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
    const triggerRef = useRef<HTMLDivElement>(null);
    const listboxId = useId();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Escape closes the dropdown and returns focus to the trigger — a
    // popover must never trap keyboard focus (apple-design skill §22).
    useEffect(() => {
        if (!isOpen) return;
        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    }, [isOpen]);

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

    // A styled div standing in for a button needs its own Enter/Space/Arrow
    // handling — native <button> semantics don't come for free here.
    const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen(v => !v);
        } else if (event.key === 'ArrowDown' && !isOpen) {
            event.preventDefault();
            setIsOpen(true);
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
                ref={triggerRef}
                className={`chaos-select-button ${isOpen ? 'chaos-select-button--active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleTriggerKeyDown}
                role="button"
                tabIndex={0}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                aria-label={label ? undefined : placeholder}
            >
                <div>
                    {multiple ? (
                        (selected as SelectOption[]).length > 0 ? (
                            <div className="chaos-select-multiple-values">
                                {(selected as SelectOption[]).map(opt => (
                                    <div
                                        key={opt.value}
                                        className="chaos-select-chip"
                                        style={{ backgroundColor: opt.color || 'var(--chaos-ink-muted)' }}
                                    >
                                        {opt.icon && ICON_MAP[opt.icon] && React.createElement(ICON_MAP[opt.icon]!, { size: 12 })}
                                        {opt.label}
                                        <span
                                            role="button"
                                            aria-label={`${opt.label} entfernen`}
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
                <ChevronDown size={16} color="var(--chaos-ink-muted)" />
            </div>

            <MotionConfig reducedMotion="user">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            id={listboxId}
                            className="chaos-select-dropdown"
                            role="listbox"
                            aria-multiselectable={multiple || undefined}
                            initial={{ opacity: 0, scale: 0.96, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -4 }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.18 }}
                            style={{ transformOrigin: 'top center' }}
                        >
                            {options.map(option => {
                                const isSelected = multiple
                                    ? (Array.isArray(value) ? value : []).includes(option.value)
                                    : value === option.value;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="option"
                                        aria-selected={isSelected}
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
                                    </button>
                                );
                            })}
                            {options.length === 0 && !onCreateNew && (
                                <div style={{ padding: '0.5rem', textAlign: 'center', color: 'var(--chaos-ink-muted)', fontSize: '0.9rem' }}>
                                    Keine Optionen verfügbar
                                </div>
                            )}
                            {onCreateNew && (
                                <button
                                    type="button"
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem 0.75rem',
                                        marginTop: '0.25rem',
                                        border: 'none',
                                        borderTop: '1px solid var(--chaos-input-border)',
                                        color: 'var(--chaos-info)',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        fontFamily: 'inherit',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        backgroundColor: 'var(--chaos-chip-inactive-bg)',
                                        borderRadius: '0 0 6px 6px',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--chaos-info) 12%, var(--chaos-bg))';
                                        e.currentTarget.style.color = 'color-mix(in srgb, var(--chaos-info) 80%, black)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--chaos-chip-inactive-bg)';
                                        e.currentTarget.style.color = 'var(--chaos-info)';
                                    }}
                                    onClick={() => {
                                        setIsOpen(false);
                                        onCreateNew();
                                    }}
                                >
                                    <span style={{ fontSize: '1.2em' }}>+</span> Neue Kategorie erstellen
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </MotionConfig>
        </div>
    );
};
