import type { Meta, StoryObj } from '@storybook/react-vite';
import { PillButton } from './PillButton';

const meta = {
  title: 'Primitives/PillButton',
  component: PillButton,
} satisfies Meta<typeof PillButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { label: 'Speichern', variant: 'primary' },
};

export const Outline: Story = {
  args: { label: 'Abbrechen', variant: 'outline' },
};

export const Danger: Story = {
  args: { label: 'Löschen', variant: 'danger' },
};
