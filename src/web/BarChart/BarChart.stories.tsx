import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart } from './BarChart';

const data = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((label, i) => ({ label, value: [800, 1200, 600, 1800, 1500, 900, 1100][i]! }));

const meta = {
  title: 'Web/BarChart',
  component: BarChart,
  args: { data, topLeft: '250ml', topRight: '2000ml', formatValue: (v: number) => `${v}ml` },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selectable: Story = {
  render: (args) => {
    const [i, setI] = useState<number | null>(3);
    return <div style={{ maxWidth: 360 }}><BarChart {...args} selectedIndex={i} onSelect={setI} /></div>;
  },
};
