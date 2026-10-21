import type { Meta, StoryObj } from '@storybook/react-vite';
import { CloudflareBadge } from './CloudflareBadge';

const meta = {
  title: 'Web/CloudflareBadge',
  component: CloudflareBadge,
} satisfies Meta<typeof CloudflareBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
