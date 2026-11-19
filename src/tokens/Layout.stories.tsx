import type { Meta, StoryObj } from '@storybook/react-vite';
import { touchTarget, rowHeights, breakpoints, gutters, gridCollapse, gridSplits } from './layout';

const mono = { fontFamily: 'monospace', fontSize: 12, color: 'var(--chaos-ink-muted)' } as const;
const heading = { fontSize: 15, margin: '24px 0 8px', color: 'var(--chaos-ink)' } as const;

function LayoutTokens() {
  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif', maxWidth: 720, color: 'var(--chaos-ink)' }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Design tokens — Layout</h1>
      <p style={{ color: 'var(--chaos-ink-muted)', marginBottom: 8, fontSize: 14, maxWidth: 600 }}>
        Sizes that keep touch, tables and grids consistent. All of these are also CSS variables
        (<code>--chaos-touch-target</code>, <code>--chaos-row-*</code>, <code>--chaos-gutter-*</code>).
      </p>

      <h2 style={heading}>Touch target — {touchTarget}px</h2>
      <p style={{ ...mono, marginBottom: 8 }}>Pad the hit area, keep the icon small.</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: touchTarget, height: touchTarget, border: '2px dashed var(--chaos-ink-muted)', borderRadius: 8, display: 'grid', placeItems: 'center' }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--chaos-amber)', border: '2px solid var(--chaos-ink)' }} />
        </div>
        <span style={mono}>20px icon inside a {touchTarget}px hit area</span>
      </div>

      <h2 style={heading}>Row heights</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {Object.entries(rowHeights).map(([name, px]) => (
          <div key={name} style={{ height: px, display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px', border: '1px solid var(--chaos-hairline)', borderRadius: 8, background: 'var(--chaos-card-bg)' }}>
            <span style={{ ...mono, width: 90 }}>{name}</span>
            <span style={mono}>{px}px</span>
          </div>
        ))}
      </div>

      <h2 style={heading}>Breakpoints</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(breakpoints).map(([name, px]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ ...mono, width: 60 }}>{name}</span>
            <span style={{ ...mono, width: 50 }}>{px}px</span>
            <div style={{ height: 12, width: px / 1.5, background: 'var(--chaos-info)', borderRadius: 2 }} />
          </div>
        ))}
      </div>

      <h2 style={heading}>Gutters</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Object.entries(gutters).map(([name, px]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ ...mono, width: 80 }}>{name}</span>
            <span style={{ ...mono, width: 40 }}>{px}px</span>
            <div style={{ display: 'flex', gap: px }}>
              <div style={{ width: 48, height: 24, background: 'var(--chaos-amber)', border: '2px solid var(--chaos-ink)', borderRadius: 4 }} />
              <div style={{ width: 48, height: 24, background: 'var(--chaos-amber)', border: '2px solid var(--chaos-ink)', borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>

      <h2 style={heading}>Grid splits (of 12 columns)</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(gridSplits).map(([name, [a, b]]) => (
          <div key={name} style={{ display: 'grid', gridTemplateColumns: `${a}fr ${b}fr`, gap: 8 }}>
            <div style={{ padding: 8, background: 'var(--chaos-info-tint)', borderRadius: 6, ...mono }}>{name} · {a}</div>
            <div style={{ padding: 8, background: 'var(--chaos-amber-tint)', borderRadius: 6, ...mono }}>{b}</div>
          </div>
        ))}
      </div>
      <p style={{ ...mono, marginTop: 8 }}>As the screen narrows: {gridCollapse.join(', then ')} columns.</p>
    </div>
  );
}

const meta = {
  title: 'Tokens/Layout',
  component: LayoutTokens,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof LayoutTokens>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
