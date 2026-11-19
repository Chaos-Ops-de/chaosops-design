import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchBar } from './SearchBar';

const meta = {
  title: 'Web/SearchBar',
  component: SearchBar,
  args: { value: '', onChange: () => {} },
  render: (args) => {
    const [v, setV] = useState(args.value);
    return <div style={{ maxWidth: 360 }}><SearchBar {...args} value={v} onChange={setV} /></div>;
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithMicAndFilter: Story = { args: { onMicClick: () => {}, onFilterClick: () => {} } };
