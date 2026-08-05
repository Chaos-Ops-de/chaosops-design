import type { Meta, StoryObj } from '@storybook/react-vite';
import { Arrow22 } from './Arrow22';

const meta = {
  title: 'Web/Arrow22',
  component: Arrow22,
} satisfies Meta<typeof Arrow22>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
