import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const meta = {
  title: 'Web/Avatar',
  component: Avatar,
  args: { name: 'Luca' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initial: Story = {};
export const NoName: Story = { args: { name: null } };
export const StaffRing: Story = { args: { ring: true } };
export const Interactive: Story = { args: { onClick: () => {}, 'aria-label': 'Menü' } };

export const ColoredStack: Story = {
  render: () => (
    <div style={{ display: 'flex', paddingLeft: 8 }}>
      {['anna', 'ben', 'cem', 'dora', 'emil'].map((n, i) => (
        <Avatar key={n} name={n} userId={n} size={30} overlap={i > 0} ringed={n === 'cem'} />
      ))}
    </div>
  ),
};
