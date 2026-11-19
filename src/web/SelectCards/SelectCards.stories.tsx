import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { User, UserRound, Users } from 'lucide-react';
import { SelectCards } from './SelectCards';

const options = [
  { value: 'f', label: 'Weiblich', image: <UserRound size={28} /> },
  { value: 'm', label: 'Männlich', image: <User size={28} /> },
  { value: 'x', label: 'Divers', image: <Users size={28} /> },
];

const meta = {
  title: 'Web/SelectCards',
  component: SelectCards,
  args: { label: 'Geschlecht', options, value: 'f', onChange: () => {} },
  render: (args) => {
    const [v, setV] = useState<string | null>(args.value);
    return <div style={{ maxWidth: 360 }}><SelectCards {...args} value={v} onChange={setV} /></div>;
  },
} satisfies Meta<typeof SelectCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoneSelected: Story = { args: { value: null } };
