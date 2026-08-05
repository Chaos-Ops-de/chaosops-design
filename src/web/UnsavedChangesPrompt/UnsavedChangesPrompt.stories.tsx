import type { Meta, StoryObj } from '@storybook/react-vite';
import { UnsavedChangesPrompt } from './UnsavedChangesPrompt';

const meta = {
  title: 'Web/UnsavedChangesPrompt',
  component: UnsavedChangesPrompt,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    show: true,
    onConfirm: () => {},
    onCancel: () => {},
  },
} satisfies Meta<typeof UnsavedChangesPrompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
