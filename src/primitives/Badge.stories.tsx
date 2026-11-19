import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, CheckCircle2, Clock, Shield, XCircle } from 'lucide-react-native';
import { Badge, type BadgeTone } from './Badge';

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  args: { label: 'Neu' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const TONES: BadgeTone[] = ['neutral', 'info', 'success', 'warning', 'danger', 'violet'];

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      {(['soft', 'solid'] as const).map((variant) => (
        <View key={variant} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {TONES.map((tone) => (
            <Badge key={tone} tone={tone} variant={variant} label={tone} />
          ))}
        </View>
      ))}
    </View>
  ),
};

export const WithDot: Story = { args: { tone: 'success', dot: true, label: 'Online' } };

export const WithIcon: Story = { args: { tone: 'info', icon: Shield, label: 'Admin' } };

export const Solid: Story = { args: { tone: 'danger', variant: 'solid', label: 'Abgelaufen' } };

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
      <Badge size="sm" tone="info" label="Klein" />
      <Badge tone="info" label="Mittel" />
    </View>
  ),
};

/** Hue is never the only signal: each status has its own label plus a dot or an icon. */
export const StatusSets: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Badge tone="success" dot label="Online" />
        <Badge tone="warning" dot label="Verzögert · 24 s" />
        <Badge tone="danger" dot label="Offline" />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Badge tone="success" icon={CheckCircle2} label="Gültig" />
        <Badge tone="warning" icon={Clock} label="Läuft bald ab" />
        <Badge tone="danger" icon={XCircle} label="Abgelaufen" />
        <Badge tone="warning" icon={AlertTriangle} label="Prüfen" />
      </View>
    </View>
  ),
};
