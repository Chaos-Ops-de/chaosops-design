import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionButton } from './ActionButton';

const meta = {
  title: 'Web/ActionButton',
  component: ActionButton,
  args: { label: 'Los geht’s' },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Outline: Story = { args: { variant: 'outline', borderStyle: 'dashed' } };
export const Disabled: Story = { args: { disabled: true } };
