import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

// Just light/dark — no "system" leg. The initial state still follows the OS
// preference (via ThemeProvider's systemScheme), this only affects what the
// toggle cycles through once someone actually clicks it.
const THEME_ICON = { light: Sun, dark: Moon } as const;
const THEME_LABEL = { light: 'Hell', dark: 'Dunkel' } as const;

export interface ThemeToggleButtonProps {
  className?: string;
  style?: React.CSSProperties;
  /** 'floating' (default): fixed top-right corner, for standalone pages. 'inline': natural sizing, for embedding in an existing bar/header. */
  variant?: 'floating' | 'inline';
}

/**
 * Drop-in light/dark toggle for pages outside a dashboard shell that has its
 * own toggle. Same light <-> dark behavior wherever it's placed.
 */
export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ className, style, variant = 'floating' }) => {
  const { resolvedTheme, setPreference } = useTheme();
  const Icon = THEME_ICON[resolvedTheme];

  const baseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    minWidth: 40,
    minHeight: 40,
    borderRadius: '50%',
    border: '2px solid var(--chaos-ink)',
    background: 'var(--chaos-surface-elevated)',
    color: 'var(--chaos-ink)',
    cursor: 'pointer',
    boxShadow: 'var(--chaos-shadow-offset-ink-sm)',
    transition: 'transform 120ms ease-out, box-shadow 120ms ease-out',
    flexShrink: 0,
    ...(variant === 'floating' ? {
      position: 'fixed',
      top: '1.25rem',
      right: '1.25rem',
      zIndex: 1000,
    } : {}),
  };

  return (
    <button
      type="button"
      className={className}
      onClick={() => setPreference(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label={`Farbschema: ${THEME_LABEL[resolvedTheme]}. Klicken zum Wechseln.`}
      title={`Farbschema: ${THEME_LABEL[resolvedTheme]}`}
      style={{ ...baseStyle, ...style }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = 'var(--chaos-shadow-offset-ink-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--chaos-shadow-offset-ink-sm)';
      }}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  );
};
