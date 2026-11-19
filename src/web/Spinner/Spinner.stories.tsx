import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';
import { Button } from '../Button';

const meta = {
  title: 'Web/Spinner',
  component: Spinner,
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size={56} />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Spinner tone="info" />
      <Spinner tone="success" />
      <Spinner tone="warning" />
      <Spinner tone="danger" />
      <Spinner tone="neutral" />
    </div>
  ),
};

/** Inside a button the spinner takes the label color; the Button already shows its own while `loading`. */
export const InheritsTextColor: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Button icon={<Spinner size="sm" tone="inherit" label="Speichert…" />}>Speichern</Button>
      <Button variant="accent" icon={<Spinner size="sm" tone="inherit" label="Speichert…" />}>Speichern</Button>
    </div>
  ),
};
