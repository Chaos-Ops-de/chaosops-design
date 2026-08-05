import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select, type SelectOption } from './Select';

const meta = {
  title: 'Web/Select',
  component: Select,
  args: {
    options: [],
    value: '',
    onChange: () => {},
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const options: SelectOption[] = [
  { value: 'session', label: 'Session', color: '#38bdf8', icon: 'Calendar' },
  { value: 'workshop', label: 'Workshop', color: '#a78bfa', icon: 'Wrench' },
  { value: 'break', label: 'Pause', color: '#f59e0b', icon: 'Coffee' },
];

export const Single: Story = {
  render: () => {
    const [value, setValue] = useState('session');
    return (
      <Select
        label="Typ"
        options={options}
        value={value}
        onChange={(v) => setValue(v as string)}
      />
    );
  },
};

export const Multiple: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['session']);
    return (
      <Select
        label="Typen"
        options={options}
        value={value}
        multiple
        onChange={(v) => setValue(v as string[])}
      />
    );
  },
};

export const WithCreateNew: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Select
        label="Kategorie"
        options={options}
        value={value}
        onChange={(v) => setValue(v as string)}
        onCreateNew={() => {}}
      />
    );
  },
};
