import type { Meta, StoryObj } from '@storybook/react-vite';
import { cssShadows } from './shadows';

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

// Story renders outside CssVariables/ThemeProvider, so resolve --chaos-ink
// manually for the preview swatches.
const INK = '#181818';

function ShadowSample({ label, varName, value }: { label: string; varName: string; value: string }) {
  const previewShadow = value.replace(/var\(--chaos-ink\)/g, INK);
  return (
    <div style={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 10, overflow: 'hidden', fontFamily: 'Inter, Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100, background: '#fffbe7' }}>
        <div
          style={{
            width: 100,
            height: 64,
            background: '#fff',
            border: '2px solid #181818',
            borderRadius: 10,
            boxShadow: previewShadow,
          }}
        />
      </div>
      <div style={{ padding: '8px 10px' }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{label}</div>
        <div style={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>--chaos-{varName}</div>
        <div style={{ fontSize: 10, color: '#999', fontFamily: 'monospace', marginTop: 2, wordBreak: 'break-word' }}>{value}</div>
      </div>
    </div>
  );
}

function ShadowTokens() {
  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif', maxWidth: 1040, background: '#fffbe7', color: '#181818' }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Design tokens — Shadows</h1>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14, maxWidth: 640 }}>
        Hard offset "sticker" shadows (no blur) that give the flipchart UI its stuck-on-paper feel. Each
        step keys off <code>var(--chaos-ink)</code> so the shadow stays themed light/dark, and is consumed
        as a <code>--chaos-shadow-*</code> CSS custom property on web. On React Native, the equivalent is{' '}
        <code>rnOffsetShadow()</code> / <code>paletteShadow()</code>.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {Object.entries(cssShadows).map(([key, value]) => (
          <ShadowSample key={key} label={key} varName={`shadow-${kebab(key)}`} value={value} />
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Tokens/Shadows',
  component: ShadowTokens,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ShadowTokens>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
