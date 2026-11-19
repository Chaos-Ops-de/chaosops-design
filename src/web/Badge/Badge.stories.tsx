import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, CheckCircle2, Clock, Shield, XCircle } from 'lucide-react';
import { Badge, type BadgeTone } from './Badge';

const meta = {
  title: 'Web/Badge',
  component: Badge,
  args: { children: 'Neu' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const TONES: BadgeTone[] = ['neutral', 'info', 'success', 'warning', 'danger', 'violet'];

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['soft', 'solid'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {TONES.map((tone) => (
            <Badge key={tone} tone={tone} variant={variant}>{tone}</Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const WithDot: Story = {
  args: { tone: 'success', dot: true, children: 'Online' },
};

export const WithIcon: Story = {
  args: { tone: 'info', icon: Shield, children: 'Admin' },
};

export const Solid: Story = {
  args: { tone: 'danger', variant: 'solid', children: 'Abgelaufen' },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge size="sm" tone="info">Klein</Badge>
      <Badge tone="info">Mittel</Badge>
    </div>
  ),
};

export const Counts: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge tone="danger" variant="solid" size="sm">3</Badge>
      <Badge tone="neutral" size="sm">128</Badge>
      <Badge tone="info">12 neue</Badge>
    </div>
  ),
};

/** Hue is never the only signal: each status has its own label plus a dot or an icon. */
export const StatusSets: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Badge tone="success" dot>Online</Badge>
        <Badge tone="warning" dot>Verzögert · 24 s</Badge>
        <Badge tone="danger" dot>Offline</Badge>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Badge tone="success" icon={<CheckCircle2 size={13} />}>Gültig</Badge>
        <Badge tone="warning" icon={<Clock size={13} />}>Läuft bald ab</Badge>
        <Badge tone="danger" icon={<XCircle size={13} />}>Abgelaufen</Badge>
        <Badge tone="warning" icon={<AlertTriangle size={13} />}>Prüfen</Badge>
      </div>
    </div>
  ),
};
