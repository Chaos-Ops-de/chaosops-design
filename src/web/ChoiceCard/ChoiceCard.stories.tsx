import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Building2, ChevronRight } from 'lucide-react';
import { ChoiceCard } from './ChoiceCard';

const meta = {
  title: 'Web/ChoiceCard',
  component: ChoiceCard,
  args: { title: 'Sommerlager 2026', description: '3 Tage · 12 Teamer' },
} satisfies Meta<typeof ChoiceCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Navigates: Story = { args: { trailing: <ChevronRight size={20} /> } };
export const Selected: Story = { args: { selected: true, leading: <Building2 size={20} /> } };
export const Disabled: Story = { args: { disabled: true, description: 'Bereits beendet' } };
export const PickOne: Story = {
  render: () => {
    const [v, setV] = useState('a');
    return (
      <div style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
        {['a', 'b', 'c'].map((k) => (
          <ChoiceCard key={k} title={`Organisation ${k.toUpperCase()}`} selected={v === k} onClick={() => setV(k)} leading={<Building2 size={20} />} />
        ))}
      </div>
    );
  },
};
