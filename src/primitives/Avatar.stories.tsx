import type { Meta, StoryObj } from '@storybook/react-vite';
import { View } from 'react-native';
import { Avatar } from './Avatar';

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  args: { name: 'Luca', size: 40 },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Amber: Story = {};
export const TwoLetters: Story = { args: { initials: 2 } };
export const StaffRing: Story = { args: { ring: true } };

export const ColoredStack: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', paddingLeft: 12 }}>
      {['anna', 'ben', 'cem', 'dora', 'emil'].map((n, i) => (
        <Avatar key={n} name={n} userId={n} overlap={i > 0} />
      ))}
    </View>
  ),
};
