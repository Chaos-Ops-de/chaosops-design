import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from './Chip';
import { useTheme } from '../theme/ThemeContext';
import { SCHEDULE_ITEM_TYPES, itemTypeStyles } from '../tokens/itemTypes';

function ChipRow() {
  const { palette } = useTheme();
  const [active, setActive] = useState<string>(SCHEDULE_ITEM_TYPES[0]);

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {SCHEDULE_ITEM_TYPES.map((type) => {
        const style = itemTypeStyles[type];
        return (
          <Chip
            key={type}
            label={style.label}
            active={active === type}
            activeBg={style.bgLight}
            activeBorder={style.border}
            activeText={style.textLight}
            inactiveBg={palette.chipInactiveBg}
            inactiveBorder={palette.inputBorder}
            inactiveText={palette.inkMuted}
            onPress={() => setActive(type)}
          />
        );
      })}
    </View>
  );
}

const meta = {
  title: 'Primitives/Chip',
  component: Chip,
  render: () => <ChipRow />,
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ScheduleItemTypes: Story = {};
