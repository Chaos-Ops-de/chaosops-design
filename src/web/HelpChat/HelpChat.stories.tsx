import type { Meta, StoryObj } from '@storybook/react-vite';
import { HelpChat } from './HelpChat';

const meta = {
  title: 'Web/HelpChat',
  component: HelpChat,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HelpChat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onClose: () => {} },
};

export const WithoutCloseButton: Story = {
  args: {},
};
