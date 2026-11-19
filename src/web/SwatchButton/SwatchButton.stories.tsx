import type { Meta, StoryObj } from '@storybook/react-vite';
import { SwatchButton } from './SwatchButton';

const meta = {
  title: 'Web/SwatchButton',
  component: SwatchButton,
  args: { color: '#7c3aed', 'aria-label': 'Violett' },
} satisfies Meta<typeof SwatchButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Palette: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      {['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#7c3aed'].map((c, i) => (
        <SwatchButton key={c} color={c} aria-label={c} selected={i === 2} />
      ))}
    </div>
  ),
};
