import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton, SkeletonGroup, SkeletonText, useDelayedLoading } from './Skeleton';

const meta = {
  title: 'Web/Skeleton',
  component: Skeleton,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

const card: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  alignItems: 'flex-start',
  width: 320,
  padding: 16,
  border: '2px solid var(--chaos-border)',
  borderRadius: 'var(--chaos-radius-lg)',
  background: 'var(--chaos-card-bg)',
  boxShadow: 'var(--chaos-shadow-offset-ink-sm)',
  boxSizing: 'border-box',
};

/** Avatar circle, short name bar, long text lines — shaped like the content that replaces it. */
export const Card: Story = {
  render: () => (
    <SkeletonGroup style={card}>
      <Skeleton variant="circle" width={48} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Skeleton width="40%" height={14} />
        <SkeletonText lines={3} />
      </div>
    </SkeletonGroup>
  ),
};

export const List: Story = {
  render: () => (
    <SkeletonGroup style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360 }}>
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Skeleton variant="circle" width={40} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton width="55%" height={14} />
            <Skeleton width="85%" height={10} />
          </div>
        </div>
      ))}
    </SkeletonGroup>
  ),
};

export const Article: Story = {
  render: () => (
    <SkeletonGroup style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 480 }}>
      <Skeleton width="70%" height={28} />
      <Skeleton variant="block" height={180} />
      <SkeletonText lines={4} />
      <SkeletonText lines={3} lastLineWidth="35%" />
    </SkeletonGroup>
  ),
};

function Swap() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <button onClick={() => setLoaded((v) => !v)} style={{ padding: '0.5rem 1rem', border: '2px solid var(--chaos-border)', borderRadius: 8, background: 'var(--chaos-amber)', color: 'var(--chaos-ink)', fontWeight: 700, cursor: 'pointer' }}>
        {loaded ? 'Skeleton zeigen' : 'Inhalt laden'}
      </button>
      {/* Both states fill the same slots (48px avatar, 14px name, 3 × 12px lines), so the card never changes size. */}
      <div style={card}>
        {loaded ? (
          <>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--chaos-amber)', border: '2px solid var(--chaos-ink)', boxSizing: 'border-box', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ height: 14, lineHeight: '14px', fontSize: 14, fontWeight: 700, color: 'var(--chaos-ink)' }}>Mia Chaos</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, lineHeight: '12px', color: 'var(--chaos-ink-muted)' }}>
                <span>Plant das Sommerfest und alles</span>
                <span>drumherum, vom Aufbau bis zum</span>
                <span style={{ width: '60%' }}>letzten Gast.</span>
              </div>
            </div>
          </>
        ) : (
          <SkeletonGroup style={{ display: 'contents' }}>
            <Skeleton variant="circle" width={48} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Skeleton width="40%" height={14} />
              <SkeletonText lines={3} />
            </div>
          </SkeletonGroup>
        )}
      </div>
    </div>
  );
}

export const SwapNoLayoutShift: Story = { render: () => <Swap /> };

function DelayedDemo() {
  const [wait, setWait] = useState(150);
  const [loading, setLoading] = useState(false);
  const show = useDelayedLoading(loading);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), wait);
    return () => clearTimeout(t);
  }, [loading, wait]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', color: 'var(--chaos-ink)' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {[150, 800].map((ms) => (
          <button
            key={ms}
            onClick={() => { setWait(ms); setLoading(true); }}
            style={{ padding: '0.5rem 1rem', border: '2px solid var(--chaos-border)', borderRadius: 8, background: 'var(--chaos-card-bg)', color: 'var(--chaos-ink)', fontWeight: 700, cursor: 'pointer' }}
          >
            Antwort nach {ms} ms
          </button>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--chaos-ink-muted)', maxWidth: 360 }}>
        Unter 300 ms erscheint kein Ladezustand (kein Aufblitzen). Darüber zeigt das Skeleton sich nach der Verzögerung.
      </p>
      <div style={{ ...card, minHeight: 96 }}>
        {show ? (
          <SkeletonGroup style={{ display: 'contents' }}>
            <Skeleton variant="circle" width={48} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Skeleton width="40%" height={14} />
              <SkeletonText lines={3} />
            </div>
          </SkeletonGroup>
        ) : (
          <span style={{ fontSize: 14 }}>{loading ? '…(noch nichts zu sehen)' : 'Fertig.'}</span>
        )}
      </div>
    </div>
  );
}

export const DelayedLoading: Story = { render: () => <DelayedDemo /> };
