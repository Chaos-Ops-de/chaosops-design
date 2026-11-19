import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from './Chip';

const meta = {
  title: 'Web/Chip',
  component: Chip,
  args: { label: 'Alle', active: false },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Active: Story = { args: { active: true } };
export const Group: Story = {
  render: () => {
    const [sel, setSel] = useState('Alle');
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        {['Alle', 'Frühschicht', 'Spätschicht'].map((l) => (
          <Chip key={l} label={l} active={sel === l} onClick={() => setSel(l)} />
        ))}
      </div>
    );
  },
};
