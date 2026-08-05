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

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, color = '#64748b', label = 'Icon' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const [isPositioned, setIsPositioned] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const SelectedIcon = ICON_MAP[value] || Tag;

    const filteredIcons = Object.keys(ICON_MAP).filter(name =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                color: '#0f172a',
            }}>
                {label}
            </label>

            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '2px solid #cbd5e1',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
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
                        <SelectedIcon size={20} />
                    </div>
                    <span style={{
                        fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                        fontSize: '0.95rem',
                        color: '#334155'
                    }}>
                        {value || 'Icon wählen'}
                    </span>
                </div>
                <ChevronDown size={16} color="#94a3b8" />
            </button>

            {isOpen && isPositioned && createPortal(
                <div style={{
                    position: 'absolute',
                    top: position.top,
                    left: position.left,
                    width: position.width,
                    minWidth: '300px',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    zIndex: 9999,
                    padding: '1rem',
                }}>
                    <div style={{
                        position: 'relative',
                        marginBottom: '1rem'
                    }}>
                        <Search
                            size={16}
                            style={{
                                position: 'absolute',
                                left: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#94a3b8'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Suchen..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '0.6rem 0.6rem 0.6rem 2.5rem',
                                border: '2px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                outline: 'none',
                                fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                                transition: 'all 0.2s ease',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3b82f6';
                                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e2e8f0';
                                e.target.style.boxShadow = 'none';
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
                                    onClick={() => {
                                        onChange(iconName);
                                        setIsOpen(false);
                                    }}
                                    title={iconName}
                                    style={{
                                        width: '100%',
                                        aspectRatio: '1',
                                        padding: '0',
                                        borderRadius: '8px',
                                        border: isSelected ? `2px solid ${color}` : '1px solid #e2e8f0',
                                        backgroundColor: isSelected ? `${color}10` : '#fff',
                                        color: isSelected ? color : '#64748b',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.backgroundColor = '#f8fafc';
                                            e.currentTarget.style.color = '#334155';
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.backgroundColor = '#fff';
                                            e.currentTarget.style.color = '#64748b';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }
                                    }}
                                >
                                    <Icon size={20} strokeWidth={isSelected ? 2.5 : 2} />
                                </button>
                            );
                        })}
                    </div>

                    {filteredIcons.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '1.5rem',
                            color: '#94a3b8',
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
