import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    Search, Tag, Clock, User, MapPin,
    Calendar, Coffee, Camera, Music, Video,
    MessageSquare, Heart, Star, Cloud, Sun,
    Moon, Umbrella, Zap, Gift, ShoppingCart,
    Briefcase, CreditCard, Activity, Box,
    Award, Globe, Smartphone, Monitor, Printer,
    Headphones, Mic, Film, Image, Layout,
    List, Grid, Table, CheckSquare, Bell,
    Settings, Shield, Key, Lock,
    Unlock, Eye, EyeOff, Edit, Trash2,
    Plus, Minus, ArrowRight, ArrowLeft,
    ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
    FileText, Wrench, PauseCircle, Gamepad2, Megaphone, Utensils
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import './IconPicker.css';

export interface IconPickerProps {
    value: string;
    onChange: (iconName: string) => void;
    color?: string;
    label?: string;
}

// Map of available icons
export const ICON_MAP: Record<string, LucideIcon> = {
    Tag, Clock, User, MapPin, Calendar, Coffee, Camera,
    Music, Video, MessageSquare, Heart, Star, Cloud,
    Sun, Moon, Umbrella, Zap, Gift, ShoppingCart,
    Briefcase, CreditCard, Activity, Box, Award,
    Globe, Smartphone, Monitor, Printer, Headphones,
    Mic, Film, Image, Layout, List, Grid, Table,
    CheckSquare, Bell, Settings, Shield, Key,
    Lock, Unlock, Eye, EyeOff, Edit, Trash2, Plus,
    Minus, ArrowRight, ArrowLeft, ChevronDown,
    ChevronUp, ChevronLeft, ChevronRight,
    FileText, Wrench, PauseCircle, Gamepad2, Megaphone, Utensils
};

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, color = 'var(--chaos-ink-muted)', label = 'Icon' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const [isPositioned, setIsPositioned] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const SelectedIcon = ICON_MAP[value] || Tag;

    const filteredIcons = Object.keys(ICON_MAP).filter(name =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Escape closes the popover and returns focus to the trigger — a
    // popover must never trap keyboard focus (apple-design skill §22).
    React.useEffect(() => {
        if (!isOpen) return;
        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                buttonRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    }, [isOpen]);

    // Use useLayoutEffect to calculate position before paint to avoid flickering/jumping
    React.useLayoutEffect(() => {
        if (isOpen && buttonRef.current) {
            const updatePosition = () => {
                const rect = buttonRef.current?.getBoundingClientRect();
                if (rect) {
                    setPosition({
                        top: rect.bottom + window.scrollY + 8,
                        left: rect.left + window.scrollX,
                        width: rect.width
                    });
                    setIsPositioned(true);
                }
            };

            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true);

            return () => {
                window.removeEventListener('resize', updatePosition);
                window.removeEventListener('scroll', updatePosition, true);
                setIsPositioned(false);
            };
        } else {
            setIsPositioned(false);
        }
    }, [isOpen]);

    return (
        <div style={{ position: 'relative' }}>
            <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontFamily: '"Gloria Hallelujah", "Caveat", cursive',
                fontSize: 'clamp(0.9rem, 2.25vw, 1rem)',
                fontWeight: '700',
                color: 'var(--chaos-ink)',
            }}>
                {label}
            </label>

            <button
                ref={buttonRef}
                type="button"
                className="chaos-iconpicker-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '2px solid var(--chaos-input-border, #cbd5e1)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--chaos-input-bg, #fff)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        padding: '4px',
                        borderRadius: '4px',
                        backgroundColor: `${color}20`,
                        color: color
                    }}>
                        <SelectedIcon size={20} aria-hidden="true" />
                    </div>
                    <span style={{
                        fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                        fontSize: '0.95rem',
                        color: 'var(--chaos-ink)'
                    }}>
                        {value || 'Icon wählen'}
                    </span>
                </div>
                <ChevronDown size={16} color="var(--chaos-ink-muted, #94a3b8)" aria-hidden="true" />
            </button>

            {isOpen && isPositioned && createPortal(
                <div style={{
                    position: 'absolute',
                    top: position.top,
                    left: position.left,
                    width: position.width,
                    minWidth: '300px',
                    backgroundColor: 'var(--chaos-surface-elevated, #fff)',
                    borderRadius: '12px',
                    border: '1px solid var(--chaos-input-border, #e2e8f0)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    zIndex: 9999,
                    padding: '1rem',
                }} role="listbox" aria-label={label}>
                    <div style={{
                        position: 'relative',
                        marginBottom: '1rem'
                    }}>
                        <Search
                            size={16}
                            aria-hidden="true"
                            style={{
                                position: 'absolute',
                                left: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--chaos-ink-muted, #94a3b8)'
                            }}
                        />
                        <input
                            type="text"
                            className="chaos-iconpicker-search"
                            placeholder="Suchen..."
                            aria-label="Icons durchsuchen"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '0.6rem 0.6rem 0.6rem 2.5rem',
                                border: '2px solid var(--chaos-input-border, #e2e8f0)',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                background: 'var(--chaos-input-bg)',
                                color: 'var(--chaos-ink)',
                                fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                            }}
                        />
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))',
                        gap: '0.5rem',
                        maxHeight: '240px',
                        overflowY: 'auto',
                        paddingRight: '0.25rem'
                    }}>
                        {filteredIcons.map(iconName => {
                            const Icon = ICON_MAP[iconName]!;
                            const isSelected = value === iconName;

                            return (
                                <button
                                    key={iconName}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    className="chaos-iconpicker-option"
                                    onClick={() => {
                                        onChange(iconName);
                                        setIsOpen(false);
                                    }}
                                    title={iconName}
                                    aria-label={iconName}
                                    style={{
                                        width: '100%',
                                        aspectRatio: '1',
                                        padding: '0',
                                        borderRadius: '8px',
                                        border: isSelected ? `2px solid ${color}` : '1px solid var(--chaos-input-border, #e2e8f0)',
                                        backgroundColor: isSelected ? `${color}10` : 'var(--chaos-surface-elevated, #fff)',
                                        color: isSelected ? color : 'var(--chaos-ink-muted, #64748b)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--chaos-ink) 6%, transparent)';
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.backgroundColor = 'var(--chaos-surface-elevated, #fff)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }
                                    }}
                                >
                                    <Icon size={20} strokeWidth={isSelected ? 2.5 : 2} aria-hidden="true" />
                                </button>
                            );
                        })}
                    </div>

                    {filteredIcons.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '1.5rem',
                            color: 'var(--chaos-ink-muted, #94a3b8)',
                            fontSize: '0.9rem',
                            fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                        }}>
                            Keine Icons gefunden
                        </div>
                    )}

                    {/* Backdrop for closing when clicking outside */}
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: -1,
                        }}
                        onClick={() => setIsOpen(false)}
                    />
                </div>,
                document.body
            )}
        </div>
    );
};
