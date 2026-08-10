import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { durations, easings } from './motion';

function MotionTokens() {
  const [on, setOn] = useState(false);

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif', maxWidth: 720, background: '#fff', color: '#181818' }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Design tokens — Motion</h1>
      <p style={{ color: '#666', marginBottom: 16, fontSize: 14, maxWidth: 600 }}>
        Durations/easings back plain CSS transitions (hover states, non-gesture-driven fades).
        Gesture-driven interactions (sheets, drags, toasts) use springs instead — see the{' '}
        <code>apple-design</code> skill and the <code>Web/Sheet</code>, <code>Web/Toast</code> stories.
      </p>
      <button
        onClick={() => setOn((v) => !v)}
        style={{ marginBottom: 24, padding: '0.5rem 1rem', border: '2px solid #181818', borderRadius: 8, background: '#fbbf24', cursor: 'pointer', fontWeight: 700 }}
      >
        {on ? 'Reset' : 'Play'}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
        {Object.entries(easings).map(([easingKey, easing]) =>
          Object.entries(durations)
            .filter(([, ms]) => ms > 0)
            .map(([durationKey, ms]) => (
              <div key={`${easingKey}-${durationKey}`} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#888', marginBottom: 8 }}>
                  {durationKey} ({ms}ms) · {easingKey}
                </div>
                <div style={{ position: 'relative', height: 24, background: '#f4f1e6', borderRadius: 999 }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: 2,
                      left: on ? 'calc(100% - 22px)' : 2,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#fbbf24',
                      border: '2px solid #181818',
                      transition: `left ${ms}ms ${easing}`,
                    }}
                  />
                </div>
              </div>
            )),
        )}
      </div>
    </div>
  );
}

const meta = {
  title: 'Tokens/Motion',
  component: MotionTokens,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof MotionTokens>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
