import type { Meta, StoryObj } from '@storybook/react-vite';
import { LevelBadge } from './LevelBadge';

const meta = {
  title: 'Web/LevelBadge',
  component: LevelBadge,
  args: { label: 'Level 1', caption: '5 Pts Next' },
} satisfies Meta<typeof LevelBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithPlus: Story = { args: { onPlusClick: () => {} } };
