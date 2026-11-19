import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { UnitStepper } from './UnitStepper';

const meta = {
  title: 'Web/UnitStepper',
  component: UnitStepper,
  args: { label: 'Gewicht', value: 70, unit: 'kg', onChange: () => {} },
} satisfies Meta<typeof UnitStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: () => {
    const [v, setV] = useState(70);
    const [u, setU] = useState('kg');
    return <div style={{ maxWidth: 320 }}><UnitStepper label="Gewicht" value={v} onChange={setV} unit={u} units={['kg', 'lb']} onUnitChange={setU} min={0} max={300} /></div>;
  },
};
