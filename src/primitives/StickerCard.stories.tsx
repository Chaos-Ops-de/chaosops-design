import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StickerCard } from './StickerCard';
import { Text } from './Text';

const meta = {
  title: 'Primitives/StickerCard',
  component: StickerCard,
} satisfies Meta<typeof StickerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StickerCard style={{ width: 240 }}>
      <Text variant="bodyBold">Workshop: Improv Basics</Text>
      <Text variant="body" muted>14:00 – 15:30 · Zelt 3</Text>
    </StickerCard>
  ),
};

export const CustomOffset: Story = {
  render: () => (
    <View style={{ padding: 12 }}>
      <StickerCard style={{ width: 240 }} offsetColor="#f59e0b" offset={8}>
        <Text variant="bodyBold">Größerer Farbversatz</Text>
      </StickerCard>
    </View>
  ),
};
