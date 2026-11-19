import type { Meta, StoryObj } from '@storybook/react-vite';
import { DashedDivider } from './DashedDivider';

const meta = {
  title: 'Web/DashedDivider',
  component: DashedDivider,
} satisfies Meta<typeof DashedDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <p>Oben</p>
      <DashedDivider />
      <p>Unten</p>
    </div>
  ),
};
