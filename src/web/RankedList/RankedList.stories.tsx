import type { Meta, StoryObj } from '@storybook/react-vite';
import { RankedList } from './RankedList';

const meta = {
  title: 'Web/RankedList',
  component: RankedList,
  args: {
    title: 'Am häufigsten genutzt',
    items: [
      { key: 'a', label: 'Wasser', count: 12 },
      { key: 'b', label: 'Tee', count: 7 },
      { key: 'c', label: 'Kaffee', count: 9 },
    ],
  },
} satisfies Meta<typeof RankedList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
