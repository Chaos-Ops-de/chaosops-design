import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, Textarea } from './Input';

const meta = {
  title: 'Web/Input',
  component: Input,
  args: { placeholder: 'z.B. Jugendfreizeit 2025' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Invalid: Story = { args: { invalid: true, defaultValue: 'Doppelter Name' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Gesperrt' } };
export const Date: Story = { args: { type: 'date' } };
export const Multiline: Story = { render: () => <Textarea placeholder="Beschreibung" /> };
