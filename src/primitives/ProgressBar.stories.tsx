import { useEffect, useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Primitives/ProgressBar',
  component: ProgressBar,
  args: { value: 42, label: 'Upload' },
  decorators: [(Story) => <View style={{ maxWidth: 420 }}><Story /></View>],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Determinate: Story = {};

export const WithLabelAndPercent: Story = {
  args: { label: 'Datei wird hochgeladen', showPercent: true, value: 72 },
};

/** The percentage is unknown, so no number is shown. */
export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Backup wird erstellt' },
};

export const Tones: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <ProgressBar tone="info" value={30} label="Info" showPercent />
      <ProgressBar tone="success" value={100} label="Fertig" showPercent />
      <ProgressBar tone="warning" value={85} label="Speicher fast voll" showPercent />
      <ProgressBar tone="danger" value={96} label="Kritisch" showPercent />
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <ProgressBar size="sm" value={55} label="Klein" />
      <ProgressBar value={55} label="Mittel" />
    </View>
  ),
};

export const Live: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    useEffect(() => {
      const id = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 7)), 500);
      return () => clearInterval(id);
    }, []);
    return <ProgressBar value={value} label="Installation" showPercent />;
  },
};
