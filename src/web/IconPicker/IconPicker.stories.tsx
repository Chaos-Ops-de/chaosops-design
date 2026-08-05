import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconPicker } from './IconPicker';

const meta = {
  title: 'Web/IconPicker',
  component: IconPicker,
  args: {
    value: '',
    onChange: () => {},
  },
} satisfies Meta<typeof IconPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('Calendar');
    return <IconPicker value={value} onChange={setValue} />;
  },
};

export const WithColor: Story = {
  render: () => {
    const [value, setValue] = useState('Star');
    return <IconPicker value={value} onChange={setValue} color="#f59e0b" label="Kategorie-Icon" />;
  },
};
