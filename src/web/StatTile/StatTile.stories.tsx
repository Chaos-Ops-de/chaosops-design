import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatTile } from './StatTile';

const meta = {
  title: 'Web/StatTile',
  component: StatTile,
  args: { label: 'Letzte 7 Tage', value: '14%', detail: '250ml | 1L' },
} satisfies Meta<typeof StatTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoDetail: Story = { args: { detail: undefined } };
