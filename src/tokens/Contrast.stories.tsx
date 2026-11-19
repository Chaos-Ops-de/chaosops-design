import type { Meta, StoryObj } from '@storybook/react-vite';
import { palettes, type Palette, type ThemeName } from './colors';
import { contrastRatio, contrastThresholds, type ContrastKind } from '../utils/contrast';

interface Row {
  label: string;
  fg: keyof Palette;
  bg: keyof Palette;
  kind: ContrastKind;
  under?: keyof Palette;
  note?: string;
}

const ROWS: Row[] = [
  { label: 'Body text on page', fg: 'ink', bg: 'bg', kind: 'text' },
  { label: 'Body text on card', fg: 'ink', bg: 'cardBg', kind: 'text' },
  { label: 'Soft text on card', fg: 'inkSoft', bg: 'cardBg', kind: 'text' },
  { label: 'Muted text on card', fg: 'inkMuted', bg: 'cardBg', kind: 'text' },
  { label: 'Muted text on inactive chip', fg: 'inkMuted', bg: 'chipInactiveBg', kind: 'text' },
  { label: 'Placeholder on input', fg: 'inkMuted', bg: 'inputBg', kind: 'placeholder' },
  { label: 'Faint hint on card', fg: 'inkFaint', bg: 'cardBg', kind: 'text', note: 'Non-essential copy only (hints, timestamps).' },
  { label: 'Accent (amber) button label', fg: 'surfaceInverse', bg: 'amber', kind: 'text' },
  { label: 'Label on info fill', fg: 'onAccent', bg: 'info', kind: 'text', note: 'Brand fill — bold 16px, not large text.' },
  { label: 'Label on success fill', fg: 'onAccent', bg: 'green', kind: 'text', note: 'Brand fill.' },
  { label: 'Label on danger fill', fg: 'onAccent', bg: 'danger', kind: 'text', note: 'Brand fill.' },
  { label: 'Label on blueStrong fill', fg: 'onAccent', bg: 'blueStrong', kind: 'text' },
  { label: 'Info text on its tint', fg: 'infoInk', bg: 'infoTint', kind: 'text', under: 'cardBg' },
  { label: 'Danger text on its tint', fg: 'dangerInk', bg: 'dangerTint', kind: 'text', under: 'cardBg' },
  { label: 'Input border on input', fg: 'inputBorder', bg: 'inputBg', kind: 'uiComponent', note: 'Soft border is part of the look.' },
  { label: 'Focus ring on page', fg: 'focusRing', bg: 'bg', kind: 'uiComponent' },
];

function ContrastTable() {
  const themes: ThemeName[] = ['light', 'dark'];
  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif', maxWidth: 860, color: 'var(--chaos-ink)' }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Design tokens — Contrast</h1>
      <p style={{ color: 'var(--chaos-ink-muted)', marginBottom: 16, fontSize: 14, maxWidth: 640 }}>
        Measured with <code>contrastRatio</code>. Minimums: text {contrastThresholds.text}:1, large text{' '}
        {contrastThresholds.largeText}:1, icons and input borders {contrastThresholds.uiComponent}:1, placeholders{' '}
        {contrastThresholds.placeholder}:1. Rows marked <b>below minimum</b> are known brand choices, recorded
        in <code>src/tokens/contrast.test.ts</code>.
      </p>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: 'left', color: 'var(--chaos-ink-muted)' }}>
            <th style={{ padding: '6px 8px' }}>Pair</th>
            <th style={{ padding: '6px 8px' }}>Needs</th>
            {themes.map((t) => <th key={t} style={{ padding: '6px 8px' }}>{t}</th>)}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label} style={{ borderTop: '1px solid var(--chaos-hairline)' }}>
              <td style={{ padding: '8px' }}>
                {row.label}
                {row.note && <div style={{ fontSize: 11, color: 'var(--chaos-ink-muted)' }}>{row.note}</div>}
              </td>
              <td style={{ padding: '8px', fontVariantNumeric: 'tabular-nums' }}>{contrastThresholds[row.kind]}:1</td>
              {themes.map((t) => {
                const p = palettes[t];
                const ratio = contrastRatio(p[row.fg], p[row.bg], row.under ? p[row.under] : '#ffffff');
                const ok = ratio >= contrastThresholds[row.kind];
                return (
                  <td key={t} style={{ padding: '8px' }}>
                    <span
                      style={{
                        display: 'inline-block', minWidth: 70, textAlign: 'center', padding: '2px 8px', borderRadius: 6,
                        background: p[row.bg], color: p[row.fg], border: `1px solid ${p.hairline}`,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {Number.isNaN(ratio) ? 'n/a' : `${ratio.toFixed(2)}:1`}
                    </span>
                    {!ok && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--chaos-danger-ink)' }}>below minimum</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const meta = {
  title: 'Tokens/Contrast',
  component: ContrastTable,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ContrastTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
