import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeToggleButton } from './ThemeToggleButton';

const meta = {
  title: 'Web/ThemeToggleButton',
  component: ThemeToggleButton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ThemeToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Floating: Story = {
  args: { variant: 'floating' },
  decorators: [(Story) => <div style={{ position: 'relative', width: 200, height: 100 }}><Story /></div>],
};

export const Inline: Story = {
  args: { variant: 'inline' },
};
