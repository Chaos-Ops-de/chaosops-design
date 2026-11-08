import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchBar } from './SearchBar';

const meta = { title: 'Primitives/SearchBar', component: SearchBar } satisfies Meta<typeof SearchBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: '', onChangeText: () => {} },
  render: () => {
    const [q, setQ] = useState('');
    return <View style={{ width: 320 }}><SearchBar value={q} onChangeText={setQ} onMicPress={() => {}} onFilterPress={() => {}} /></View>;
  },
};
