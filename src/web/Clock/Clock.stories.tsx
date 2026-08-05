import type { Meta, StoryObj } from '@storybook/react-vite';
import { Clock } from './Clock';

const meta = {
  title: 'Web/Planner/Clock',
  component: Clock,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Clock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: { time: new Date(2026, 0, 1, 10, 30, 0) },
};

export const CountdownWarning: Story = {
  args: {
    time: new Date(2026, 0, 1, 10, 28, 30),
    nextEventTime: '10:30',
    viewType: 'display',
  },
};

export const CountdownUrgent: Story = {
  args: {
    time: new Date(2026, 0, 1, 10, 29, 20),
    nextEventTime: '10:30',
    viewType: 'display',
  },
};

export const NightSuggestions: Story = {
  args: {
    time: new Date(2026, 0, 1, 23, 30, 0),
    viewType: 'display',
  },
};
