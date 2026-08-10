import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';

const meta = {
  title: 'Primitives/Text',
  component: Text,
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Text variant="display" size="xxl">Display</Text>
      <Text variant="body" size="base">Body — regular</Text>
      <Text variant="bodyMedium" size="base">Body — medium</Text>
      <Text variant="bodySemiBold" size="base">Body — semibold</Text>
      <Text variant="bodyBold" size="base">Body — bold</Text>
      <Text variant="body" size="sm" muted>Body — muted, small</Text>
    </View>
  ),
};
