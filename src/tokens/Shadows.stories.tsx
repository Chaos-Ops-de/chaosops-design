import type { Meta, StoryObj } from '@storybook/react-vite';
import { cssShadows } from './shadows';

function ShadowTokens() {
  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif', maxWidth: 640, background: '#fffbe7', color: '#181818' }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Design tokens — Shadows</h1>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
        Hard offset "sticker" shadows (no blur) that give the flipchart UI its stuck-on-paper feel.
        On React Native, the equivalent is <code>rnOffsetShadow()</code> / <code>paletteShadow()</code>.
      </p>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {Object.entries(cssShadows).map(([key, shadow]) => (
          <div key={key} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 100,
                height: 64,
                background: '#fff',
                border: '2px solid #181818',
                borderRadius: 10,
                boxShadow: shadow,
              }}
            />
            <div style={{ marginTop: 12, fontSize: 12, fontFamily: 'monospace', color: '#666' }}>{key}</div>
          </div>
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
