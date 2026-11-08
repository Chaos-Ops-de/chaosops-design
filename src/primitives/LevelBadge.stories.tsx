import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LevelBadge } from './LevelBadge';

const meta = { title: 'Primitives/LevelBadge', component: LevelBadge } satisfies Meta<typeof LevelBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Level 1', caption: '5 Pkt. bis Level 2', onPlusPress: () => {} },
  render: (args) => <View style={{ width: 220 }}><LevelBadge {...args} /></View>,
};
