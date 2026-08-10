import type { Meta, StoryObj } from '@storybook/react-vite';
import { radii } from './radii';

function RadiiTokens() {
  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif', maxWidth: 640, background: '#fff', color: '#181818' }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Design tokens — Radii</h1>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
        Corner radii used across cards, buttons, and inputs. <code>pill</code> is used for fully-rounded chips/buttons.
      </p>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {Object.entries(radii).map(([key, px]) => (
          <div key={key} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 80,
                height: 80,
                background: '#fbbf24',
                border: '2px solid #181818',
                borderRadius: Math.min(px, 40),
              }}
            />
            <div style={{ marginTop: 8, fontSize: 12, fontFamily: 'monospace', color: '#666' }}>{key} ({px}px)</div>
          </div>
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
