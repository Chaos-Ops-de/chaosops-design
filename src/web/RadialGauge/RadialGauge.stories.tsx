import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadialGauge } from './RadialGauge';

const meta = {
  title: 'Web/RadialGauge',
  component: RadialGauge,
  args: { value: 0.64, 'aria-label': 'Tagesziel' },
  render: (args) => (
    <RadialGauge {...args}>
      <strong style={{ fontSize: 28 }}>{Math.round(args.value * 100)}%</strong>
      <span style={{ fontSize: 12 }}>Tagesziel</span>
    </RadialGauge>
  ),
} satisfies Meta<typeof RadialGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { value: 0 } };
export const Full: Story = { args: { value: 1 } };
