import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimeRow } from './TimeRow';

const meta = {
  title: 'Web/TimeRow',
  component: TimeRow,
  args: { time: '09:00', value: '200 ml' },
} satisfies Meta<typeof TimeRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
