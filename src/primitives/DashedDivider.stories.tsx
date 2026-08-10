import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DashedDivider } from './DashedDivider';

const meta = {
  title: 'Primitives/DashedDivider',
  component: DashedDivider,
  render: () => (
    <View style={{ width: 280 }}>
      <Text>Vormittag</Text>
      <DashedDivider />
      <Text>Nachmittag</Text>
    </View>
  ),
} satisfies Meta<typeof DashedDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
