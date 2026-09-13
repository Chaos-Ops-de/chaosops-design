import type { Meta, StoryObj } from '@storybook/react-vite';
import { radii } from './radii';

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

function toCssValue(v: number | string): string {
  return typeof v === 'number' ? `${v}px` : v;
}

function RadiusSample({ label, varName, value }: { label: string; varName: string; value: number | string }) {
  const cssValue = toCssValue(value);
  return (
    <div style={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 10, overflow: 'hidden', fontFamily: 'Inter, Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100, background: '#fffbe7' }}>
        <div
          style={{
            width: 80,
            height: 80,
            background: '#fbbf24',
            border: '2px solid #181818',
            borderRadius: cssValue,
          }}
        />
      </div>
      <div style={{ padding: '8px 10px' }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{label}</div>
        <div style={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>--chaos-{varName}</div>
        <div style={{ fontSize: 10, color: '#999', fontFamily: 'monospace', marginTop: 2 }}>{cssValue}</div>
      </div>
    </div>
  );
}

function RadiiTokens() {
  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif', maxWidth: 1040, background: '#fff', color: '#181818' }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Design tokens — Radii</h1>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14, maxWidth: 640 }}>
        Corner radii used across cards, buttons, inputs, and dialogs. The app consumes these as{' '}
        <code>--chaos-radius-*</code> CSS custom properties on web (via <code>CssVariables</code>), and as
        numeric/string values from <code>radii</code> directly on React Native — nothing downstream should
        hardcode a radius. <code>pill</code> is used for fully-rounded chips/buttons; <code>card</code> is the
        hand-drawn irregular corner shared by dialogs, sheets, and error/404 fallbacks.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {Object.entries(radii).map(([key, value]) => (
          <RadiusSample key={key} label={key} varName={`radius-${kebab(key)}`} value={value} />
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Tokens/Radii',
  component: RadiiTokens,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof RadiiTokens>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
