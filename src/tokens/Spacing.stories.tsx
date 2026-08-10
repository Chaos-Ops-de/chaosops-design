import type { Meta, StoryObj } from '@storybook/react-vite';
import { spacing } from './spacing';

function SpacingTokens() {
  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif', maxWidth: 640, background: '#fff', color: '#181818' }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Design tokens — Spacing</h1>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
        Used for padding, gaps, and margins across primitives. Values are in px (React Native) and map 1:1 to px on web.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Object.entries(spacing).map(([key, px]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 60, fontSize: 12, color: '#888', fontFamily: 'monospace' }}>{key}</span>
            <span style={{ width: 36, fontSize: 12, color: '#888', fontFamily: 'monospace' }}>{px}px</span>
            <div style={{ height: 16, width: px, background: '#fbbf24', borderRadius: 2 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Tokens/Spacing',
  component: SpacingTokens,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SpacingTokens>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
