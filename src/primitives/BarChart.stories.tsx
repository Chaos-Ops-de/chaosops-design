import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart } from './BarChart';

const meta = { title: 'Primitives/BarChart', component: BarChart } satisfies Meta<typeof BarChart>;
export default meta;
type Story = StoryObj<typeof meta>;

const DATA = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((label, i) => ({ label, value: [12, 18, 25, 9, 22, 30, 14][i]! }));

export const Interactive: Story = {
  args: { data: DATA },
  render: () => {
    const [i, setI] = useState<number | null>(2);
    return <View style={{ width: 320 }}><BarChart data={DATA} selectedIndex={i} onSelect={setI} topLeft="0 Std." topRight="30 Std." formatValue={(v) => `${v} Std.`} /></View>;
  },
};
