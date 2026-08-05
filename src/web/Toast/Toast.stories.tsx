import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast } from './Toast';

const meta = {
  title: 'Web/Toast',
  component: Toast,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    duration: 0,
    onClose: () => {},
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: { message: 'Änderungen gespeichert.', type: 'success' },
};

export const Error: Story = {
  args: { message: 'Speichern fehlgeschlagen.', type: 'error', showCloseButton: true },
};

export const Warning: Story = {
  args: { message: 'Ungespeicherte Änderungen.', type: 'warning' },
};

export const Info: Story = {
  args: { message: 'Neue Version verfügbar.', type: 'info' },
};
