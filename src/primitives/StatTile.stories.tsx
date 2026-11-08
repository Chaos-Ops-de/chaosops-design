import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatTile } from './StatTile';

const meta = { title: 'Primitives/StatTile', component: StatTile } satisfies Meta<typeof StatTile>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Letzte 7 Tage', value: '14%', detail: '250ml | 1L' },
  render: (args) => <View style={{ width: 260 }}><StatTile {...args} /></View>,
};
