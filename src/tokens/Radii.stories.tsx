import type { Meta, StoryObj } from '@storybook/react-vite';
import { radii, innerRadius, ringRadius, cssInnerRadius, cssRingRadius } from './radii';

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

function toCssValue(v: number | string): string {
  return typeof v === 'number' ? `${v}px` : v;
}

// The preview box is 80px square; a numeric radius bigger than half that
// (e.g. full = 9999) would just render as a pill/circle either way, so clamp
// it for display purposes only — the real token value is shown as text.
function previewRadius(v: number | string): string {
  return typeof v === 'number' ? `${Math.min(v, 40)}px` : v;
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
            borderRadius: previewRadius(value),
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

function NestingCard({
  title,
  formula,
  cssFormula,
  children,
}: {
  title: string;
  formula: string;
  cssFormula: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 10, overflow: 'hidden', fontFamily: 'Inter, Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 140, background: '#fffbe7' }}>
        {children}
      </div>
      <div style={{ padding: '8px 10px' }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{title}</div>
        <div style={{ fontSize: 11, color: '#888', fontFamily: 'monospace', marginTop: 2 }}>{formula}</div>
        <div style={{ fontSize: 10, color: '#999', fontFamily: 'monospace', marginTop: 2 }}>{cssFormula}</div>
      </div>
    </div>
  );
}

function RadiiTokens() {
  const outerPx = 16; // radii.xl
  const paddingPx = 4; // spacing.xs equivalent
  const innerPx = innerRadius(outerPx, paddingPx);

  const ringInnerPx = 12; // radii.lg
  const gapPx = 4;
  const ringOuterPx = ringRadius(ringInnerPx, gapPx);

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif', maxWidth: 1040, background: '#fff', color: '#181818' }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Design tokens — Radii</h1>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14, maxWidth: 640 }}>
        Corner radii used across cards, buttons, inputs, and dialogs. The app consumes these as{' '}
        <code>--chaos-radius-*</code> CSS custom properties on web (via <code>CssVariables</code>), and as
        numeric/string values from <code>radii</code> directly on React Native — nothing downstream should
        hardcode a radius. <code>full</code> is used for fully-rounded chips/buttons; <code>card</code> is the
        hand-drawn irregular corner shared by dialogs, sheets, and error/404 fallbacks.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {Object.entries(radii).map(([key, value]) => (
          <RadiusSample key={key} label={key} varName={`radius-${kebab(key)}`} value={value} />
        ))}
      </div>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 4 }}>Nesting</h2>
      <p style={{ color: '#666', marginBottom: 16, fontSize: 14, maxWidth: 640 }}>
        Two rules keep nested corners looking concentric instead of clipped or mismatched.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        <NestingCard
          title="Inner corner = outer − padding"
          formula={`innerRadius(${outerPx}, ${paddingPx}) = ${innerPx}`}
          cssFormula="cssInnerRadius(outerVar, padVar) = calc(outerVar - padVar)"
        >
          <div
            style={{
              width: 120,
              height: 100,
              background: '#181818',
              borderRadius: outerPx,
              padding: paddingPx,
              display: 'flex',
            }}
          >
            <div style={{ flex: 1, background: '#fbbf24', borderRadius: innerPx }} />
          </div>
        </NestingCard>

        <NestingCard
          title="Selection ring outer = inner + gap"
          formula={`ringRadius(${ringInnerPx}, ${gapPx}) = ${ringOuterPx}`}
          cssFormula="cssRingRadius(innerVar, gapVar) = calc(innerVar + gapVar)"
        >
          <div
            style={{
              width: 80,
              height: 60,
              border: '2px solid #2563eb',
              borderRadius: ringOuterPx,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: gapPx,
            }}
          >
            <div style={{ width: '100%', height: '100%', background: '#fbbf24', border: '2px solid #181818', borderRadius: ringInnerPx }} />
          </div>
        </NestingCard>
      </div>
      {/* cssInnerRadius/cssRingRadius produce the same relationship as calc()
          strings, for components that read radii from CSS variables. */}
      <p style={{ fontSize: 11, color: '#999', fontFamily: 'monospace', marginTop: 8 }}>
        {cssInnerRadius('var(--chaos-radius-xl)', 'var(--chaos-space-xs)')} &middot;{' '}
        {cssRingRadius('var(--chaos-radius-lg)', 'var(--chaos-space-xs)')}
      </p>
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
