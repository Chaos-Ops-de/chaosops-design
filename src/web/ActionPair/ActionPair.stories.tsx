import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionPair } from './ActionPair';

const meta = {
  title: 'Web/ActionPair',
  component: ActionPair,
  args: { primaryLabel: 'Absenden', secondaryLabel: 'Jetzt überspringen', onPrimary: () => {}, onSecondary: () => {} },
} satisfies Meta<typeof ActionPair>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const PrimaryDisabled: Story = { args: { primaryDisabled: true } };
