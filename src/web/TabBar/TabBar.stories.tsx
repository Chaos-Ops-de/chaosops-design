import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart3, Home, Settings, User } from 'lucide-react';
import { TabBar } from './TabBar';

const items = [
  { key: 'home', label: 'Start', icon: <Home size={20} /> },
  { key: 'stats', label: 'Statistik', icon: <BarChart3 size={20} /> },
  { key: 'profile', label: 'Profil', icon: <User size={20} /> },
  { key: 'settings', label: 'Einstellungen', icon: <Settings size={20} /> },
];

const meta = {
  title: 'Web/TabBar',
  component: TabBar,
  args: { items, activeKey: 'home', onChange: () => {}, 'aria-label': 'Hauptnavigation' },
  render: (args) => {
    const [k, setK] = useState(args.activeKey);
    return <div style={{ maxWidth: 360 }}><TabBar {...args} activeKey={k} onChange={setK} /></div>;
  },
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
