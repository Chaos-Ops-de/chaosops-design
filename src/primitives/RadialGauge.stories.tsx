import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadialGauge } from './RadialGauge';
import { Text } from './Text';

const meta = { title: 'Primitives/RadialGauge', component: RadialGauge, argTypes: { value: { control: { type: 'range', min: 0, max: 1, step: 0.01 } } } } satisfies Meta<typeof RadialGauge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 0.15, size: 220, accessibilityLabel: 'Besetzung' },
  render: (args) => (
    <RadialGauge {...args}>
      <Text variant="display" size="xxxl">{Math.round(args.value * 100)}%</Text>
      <Text muted size="sm">besetzt</Text>
    </RadialGauge>
  ),
};

export const Full: Story = { ...Default, args: { ...Default.args!, value: 1 } as never };
