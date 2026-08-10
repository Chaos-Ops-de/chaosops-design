import type { Meta, StoryObj } from '@storybook/react-vite';
import { webFontStack, fontSizes, fontWeights, googleFontsHref } from './fonts';

function TypographyTokens() {
  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif', maxWidth: 720, background: '#fff', color: '#181818' }}>
      <link rel="stylesheet" href={googleFontsHref} />
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Design tokens — Typography</h1>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
        <code>webFontStack.display</code> is the flipchart handwriting face used for headings;{' '}
        <code>webFontStack.body</code> is Inter for everything else.
      </p>

      <h2 style={{ fontSize: 15, marginBottom: 10 }}>Font stacks</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        <div style={{ fontFamily: webFontStack.display, fontSize: 28 }}>
          Display — {webFontStack.display}
        </div>
        <div style={{ fontFamily: webFontStack.body, fontSize: 18 }}>
          Body — {webFontStack.body}
        </div>
        <div style={{ fontFamily: webFontStack.mono, fontSize: 15 }}>
          Mono — {webFontStack.mono}
        </div>
      </div>

      <h2 style={{ fontSize: 15, marginBottom: 10 }}>Font sizes</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
        {Object.entries(fontSizes).map(([key, px]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ width: 48, fontSize: 12, color: '#888', fontFamily: 'monospace' }}>{key} ({px}px)</span>
            <span style={{ fontSize: px, fontFamily: webFontStack.body }}>Chaos Ops Planer</span>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 15, marginBottom: 10 }}>Font weights</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {Object.entries(fontWeights).map(([key, weight]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ width: 64, fontSize: 12, color: '#888', fontFamily: 'monospace' }}>{key} ({weight})</span>
            <span style={{ fontSize: 18, fontWeight: weight, fontFamily: webFontStack.body }}>Chaos Ops Planer</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Tokens/Typography',
  component: TypographyTokens,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TypographyTokens>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
