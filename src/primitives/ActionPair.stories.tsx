import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionPair } from './ActionPair';

const meta = { title: 'Primitives/ActionPair', component: ActionPair } satisfies Meta<typeof ActionPair>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { primaryLabel: 'Absenden', secondaryLabel: 'Überspringen', onPrimary: () => {}, onSecondary: () => {} },
  render: (args) => <View style={{ width: 320 }}><ActionPair {...args} /></View>,
};

export const PrimaryDisabled: Story = { ...Default, args: { ...Default.args!, primaryDisabled: true } as never };
