import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SelectCards } from './SelectCards';

const meta = { title: 'Primitives/SelectCards', component: SelectCards } satisfies Meta<typeof SelectCards>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { options: [], value: null, onChange: () => {} },
  render: () => {
    const [v, setV] = useState<string | null>('f');
    return (
      <View style={{ width: 300 }}>
        <SelectCards label="Dein Geschlecht" value={v} onChange={setV} options={[{ value: 'm', label: 'Männlich', image: '🧍' }, { value: 'f', label: 'Weiblich', image: '🧍‍♀️' }]} />
      </View>
    );
  },
};
