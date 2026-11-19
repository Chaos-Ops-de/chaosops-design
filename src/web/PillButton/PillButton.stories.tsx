import type { Meta, StoryObj } from '@storybook/react-vite';
import { PillButton } from './PillButton';

const meta = {
  title: 'Web/PillButton',
  component: PillButton,
  args: { label: 'Speichern' },
} satisfies Meta<typeof PillButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <PillButton label="Primary" />
      <PillButton label="Outline" variant="outline" />
      <PillButton label="Danger" variant="danger" />
      <PillButton label="Disabled" disabled />
    </div>
  ),
};
