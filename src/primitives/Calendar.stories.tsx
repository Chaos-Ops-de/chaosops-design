import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './Calendar';

const meta = { title: 'Primitives/Calendar', component: Calendar } satisfies Meta<typeof Calendar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { month: new Date(2026, 10, 1), onMonthChange: () => {}, onSelect: () => {} },
  render: () => {
    const [month, setMonth] = useState(new Date(2026, 10, 1));
    const [sel, setSel] = useState<Date | null>(new Date(2026, 10, 21));
    return (
      <View style={{ width: 320 }}>
        <Calendar
          month={month} onMonthChange={setMonth} selected={sel} onSelect={setSel}
          today={new Date(2026, 10, 8)} marked={[new Date(2026, 10, 12), new Date(2026, 10, 21), new Date(2026, 10, 28)]}
        />
      </View>
    );
  },
};
