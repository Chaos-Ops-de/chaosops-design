import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionButton } from './ActionButton';

const meta = {
  title: 'Primitives/ActionButton',
  component: ActionButton,
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: { label: 'Veranstaltung erstellen', variant: 'filled' },
};

export const Outline: Story = {
  args: { label: 'Abbrechen', variant: 'outline' },
};

export const DashedBorder: Story = {
  args: { label: 'Vorlage wählen', variant: 'outline', borderStyle: 'dashed' },
};

export const Disabled: Story = {
  args: { label: 'Nicht verfügbar', variant: 'filled', disabled: true },
};
