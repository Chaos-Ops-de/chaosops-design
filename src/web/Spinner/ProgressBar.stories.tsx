import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Web/ProgressBar',
  component: ProgressBar,
  args: { value: 42, 'aria-label': 'Upload' },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
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
    <div style={{ display: 'grid', gap: 16 }}>
      <ProgressBar tone="info" value={30} label="Info" showPercent />
      <ProgressBar tone="success" value={100} label="Fertig" showPercent />
      <ProgressBar tone="warning" value={85} label="Speicher fast voll" showPercent />
      <ProgressBar tone="danger" value={96} label="Kritisch" showPercent />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <ProgressBar size="sm" value={55} aria-label="Klein" />
      <ProgressBar value={55} aria-label="Mittel" />
    </div>
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
