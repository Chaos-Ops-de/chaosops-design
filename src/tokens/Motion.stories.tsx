import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { durations, easings, timings, staggers, springs, motionLimits } from './motion';

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

function MotionRoles() {
  const [on, setOn] = useState(false);

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif', maxWidth: 720, color: 'var(--chaos-ink)' }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Design tokens — Motion roles</h1>
      <p style={{ color: 'var(--chaos-ink-muted)', marginBottom: 16, fontSize: 14, maxWidth: 600 }}>
        Named by what the motion is for. Feedback stays under 100 ms, exits are quicker than entrances, and
        nothing in an interaction runs longer than {motionLimits.interactionMaxMs} ms.
      </p>
      <button
        onClick={() => setOn((v) => !v)}
        style={{ marginBottom: 24, padding: '0.5rem 1rem', border: '2px solid var(--chaos-ink)', borderRadius: 8, background: 'var(--chaos-amber)', color: 'var(--chaos-surface-inverse)', cursor: 'pointer', fontWeight: 700 }}
      >
        {on ? 'Reset' : 'Play'}
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {Object.entries(timings).map(([role, ms]) => (
          <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 120, fontSize: 12, fontFamily: 'monospace', color: 'var(--chaos-ink-muted)' }}>{role} · {ms}ms</span>
            <div style={{ position: 'relative', flex: 1, height: 24, background: 'var(--chaos-chip-inactive-bg)', borderRadius: 999 }}>
              <div
                style={{
                  position: 'absolute', top: 2, left: on ? 'calc(100% - 22px)' : 2, width: 20, height: 20, borderRadius: '50%',
                  background: 'var(--chaos-amber)', border: '2px solid var(--chaos-ink)',
                  transition: `left ${ms}ms ${role === 'exit' ? easings.accelerate : easings.decelerate}`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 20, fontSize: 12, fontFamily: 'monospace', color: 'var(--chaos-ink-muted)' }}>
        stagger list {staggers.list}ms · stagger star {staggers.star}ms · toast spring damping {springs.toast.damping} / stiffness {springs.toast.stiffness}
      </p>
    </div>
  );
}

export const Roles: StoryObj<typeof MotionRoles> = {
  render: () => <MotionRoles />,
  parameters: { layout: 'fullscreen' },
};
