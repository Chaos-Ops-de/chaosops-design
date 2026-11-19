import type { Meta, StoryObj } from '@storybook/react-vite';
import { StickerCard } from './StickerCard';

const meta = {
  title: 'Web/StickerCard',
  component: StickerCard,
  args: { children: 'Schicht heute: 08:00 bis 16:00' },
  decorators: [(Story) => <div style={{ padding: 16, maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof StickerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const CustomOffset: Story = { args: { offset: 8, offsetColor: '#f5a623' } };
