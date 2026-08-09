import type { Meta, StoryObj } from '@storybook/react-vite';
import { palettes, paletteKeys, amberShades, type Palette } from './colors';
import { itemTypeStyles, SCHEDULE_ITEM_TYPES } from './itemTypes';

const GROUPS: { title: string; keys: (keyof Palette)[] }[] = [
  { title: 'Surfaces', keys: ['bg', 'cardBg', 'surfaceElevated', 'headerBg', 'tabBarBg', 'inputBg', 'chipInactiveBg'] },
  { title: 'Text & borders', keys: ['ink', 'inkMuted', 'border', 'tabBarBorder', 'inputBorder', 'focusRing'] },
  { title: 'Semantic accents', keys: ['amber', 'green', 'danger', 'info'] },
  { title: 'Extended accents', keys: ['violet', 'violetInk', 'blue', 'blueInk', 'pink', 'pinkInk', 'orange', 'orangeInk', 'teal', 'tealInk'] },
  { title: 'Overlay', keys: ['overlayScrim'] },
];

// Anything added to the Palette but not yet sorted into a group above still shows up here.
const groupedKeys = new Set(GROUPS.flatMap((g) => g.keys));
const ungrouped = paletteKeys.filter((k) => !groupedKeys.has(k));
if (ungrouped.length > 0) {
  GROUPS.push({ title: 'Other', keys: ungrouped });
}

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

function Swatch({ label, varName, light, dark }: { label: string; varName: string; light: string; dark: string }) {
  return (
    <div style={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 10, overflow: 'hidden', fontFamily: 'Inter, Arial, sans-serif' }}>
      <div style={{ display: 'flex', height: 56 }}>
        <div style={{ flex: 1, background: light }} title={`light: ${light}`} />
        <div style={{ flex: 1, background: dark }} title={`dark: ${dark}`} />
      </div>
      <div style={{ padding: '8px 10px' }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{label}</div>
        <div style={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>--chaos-{varName}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#999', fontFamily: 'monospace', marginTop: 2 }}>
          <span>{light}</span>
          <span>{dark}</span>
        </div>
      </div>
    </div>
  );
}

function ColorTokens() {
  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif', maxWidth: 1040, background: '#fff', color: '#181818' }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Design tokens — Colors</h1>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14, maxWidth: 640 }}>
        Every color used across ChaosOps comes from this palette. Left half of each swatch is the
        light-theme value, right half is dark. The app consumes these as <code>--chaos-*</code> CSS
        custom properties via <code>CssVariables</code> — nothing downstream should hardcode a hex value.
      </p>

      {GROUPS.map((group) => (
        <div key={group.title} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 15, marginBottom: 10 }}>{group.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {group.keys.map((key) => (
              <Swatch
                key={key}
                label={key}
                varName={kebab(key)}
                light={palettes.light[key]}
                dark={palettes.dark[key]}
              />
            ))}
          </div>
        </div>
      ))}

      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 15, marginBottom: 10 }}>Amber shades <span style={{ fontWeight: 400, color: '#888' }}>(same in both themes)</span></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {Object.entries(amberShades).map(([k, v]) => (
            <Swatch key={k} label={`amber-${k}`} varName={`amber-${k}`} light={v} dark={v} />
          ))}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: 15, marginBottom: 10 }}>Schedule item types <span style={{ fontWeight: 400, color: '#888' }}>(light-mode background / accent border)</span></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {SCHEDULE_ITEM_TYPES.map((type) => {
            const s = itemTypeStyles[type];
            return (
              <Swatch key={type} label={s.label} varName={`item-${type}`} light={s.bgLight} dark={s.border} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: 'Tokens/Colors',
  component: ColorTokens,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ColorTokens>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Palette: Story = {};
