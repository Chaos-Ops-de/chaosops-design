import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { UnitStepper } from './UnitStepper';

const meta = { title: 'Primitives/UnitStepper', component: UnitStepper } satisfies Meta<typeof UnitStepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Weight: Story = {
  args: { label: 'Dein Gewicht', value: 79, unit: 'kg', onChange: () => {} },
  render: () => {
    const [v, setV] = useState(79);
    const [u, setU] = useState('kg');
    return (
      <View style={{ width: 300 }}>
        <UnitStepper label="Dein Gewicht" value={v} onChange={setV} unit={u} units={['kg', 'lb']} onUnitChange={setU} min={30} max={250} />
      </View>
    );
  },
};
