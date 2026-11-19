import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';

const triggerStyle: React.CSSProperties = {
  padding: '0.6rem 1rem',
  minHeight: 44,
  border: '2px solid var(--chaos-border)',
  borderRadius: 'var(--chaos-radius-lg)',
  background: 'var(--chaos-card-bg)',
  color: 'var(--chaos-ink)',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: 'var(--chaos-shadow-offset-ink-sm)',
};

const meta = {
  title: 'Web/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  args: {
    content: 'Speichert den Entwurf, ohne ihn zu veröffentlichen.',
    children: <button style={triggerStyle}>Hinweis</button>,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <button style={triggerStyle}>Entwurf speichern</button>
    </Tooltip>
  ),
};

/** Triggers pinned to every viewport edge: each tooltip flips or slides so it stays on screen. */
export const FlippedAtEdges: Story = {
  parameters: { layout: 'fullscreen' },
  render: (args) => {
    const pin = (css: React.CSSProperties, label: string, placement: 'top' | 'bottom' | 'left' | 'right') => (
      <div style={{ position: 'fixed', ...css }}>
        <Tooltip {...args} placement={placement} content={`${label}: dieser Hinweis dreht sich, wenn kein Platz ist.`}>
          <button style={triggerStyle}>{label}</button>
        </Tooltip>
      </div>
    );
    return (
      <div style={{ height: '100vh' }}>
        {pin({ top: 8, left: 8 }, 'Oben links', 'top')}
        {pin({ top: 8, right: 8 }, 'Oben rechts', 'top')}
        {pin({ bottom: 8, left: 8 }, 'Unten links', 'bottom')}
        {pin({ bottom: 8, right: 8 }, 'Unten rechts', 'bottom')}
        {pin({ top: '50%', left: 8 }, 'Links', 'left')}
        {pin({ top: '50%', right: 8 }, 'Rechts', 'right')}
      </div>
    );
  },
};

/** Tab to the button: the tooltip appears on focus (after the delay) and Escape dismisses it. */
export const KeyboardFocus: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16 }}>
      <button style={triggerStyle}>Zuerst</button>
      <Tooltip {...args} content="Mit Tab erreichbar, mit Escape schließbar.">
        <button style={triggerStyle}>Dann hierher tabben</button>
      </Tooltip>
    </div>
  ),
};

export const LongTextClamped: Story = {
  render: (args) => (
    <Tooltip
      {...args}
      placement="bottom"
      content="Dieser Hinweis ist absichtlich viel zu lang für einen Tooltip und bricht deshalb bei 300 Pixeln Breite um, statt die ganze Seite zu überspannen."
    >
      <button style={triggerStyle}>Langer Hinweis</button>
    </Tooltip>
  ),
};
