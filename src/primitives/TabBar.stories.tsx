import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabBar } from './TabBar';

const meta = { title: 'Primitives/TabBar', component: TabBar } satisfies Meta<typeof TabBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { items: [], activeKey: 'home', onChange: () => {} },
  render: () => {
    const [k, setK] = useState('home');
    return (
      <View style={{ width: 300 }}>
        <TabBar activeKey={k} onChange={setK} items={[{ key: 'home', label: 'Start', icon: '🏠' }, { key: 'plan', label: 'Plan', icon: '🗓' }, { key: 'me', label: 'Profil', icon: '👤' }]} />
      </View>
    );
  },
};
