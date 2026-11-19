import { useState } from 'react';
import { View } from 'react-native';
import { BriefcaseMedical, HardHat, Radio } from 'lucide-react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RankedList } from './RankedList';

const meta = { title: 'Primitives/RankedList', component: RankedList } satisfies Meta<typeof RankedList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Am häufigsten genutzt',
    items: [
      { key: 'a', label: 'Warnweste', count: 1, icon: <HardHat size={24} /> },
      { key: 'b', label: 'Funkgerät', count: 3, icon: <Radio size={24} /> },
      { key: 'c', label: 'Erste-Hilfe-Set', count: 2, icon: <BriefcaseMedical size={24} /> },
    ],
  },
  render: (args) => <View style={{ width: 300 }}><RankedList {...args} /></View>,
};
