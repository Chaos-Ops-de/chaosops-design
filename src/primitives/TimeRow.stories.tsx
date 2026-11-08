import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimeRow } from './TimeRow';

const meta = { title: 'Primitives/TimeRow', component: TimeRow } satisfies Meta<typeof TimeRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { time: '09:00', value: '200 ml' },
  render: (args) => <View style={{ width: 300 }}><TimeRow {...args} /></View>,
};
