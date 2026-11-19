import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pencil, Trash2, X, ZoomIn } from 'lucide-react';
import { IconButton } from './IconButton';

const meta = {
  title: 'Web/IconButton',
  component: IconButton,
  args: { icon: <Pencil size={16} />, 'aria-label': 'Bearbeiten' },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ghost: Story = {};
export const Outline: Story = { args: { variant: 'outline' } };
export const Danger: Story = { args: { variant: 'danger', icon: <Trash2 size={16} />, 'aria-label': 'Löschen' } };
export const Close: Story = { args: { icon: <X size={18} />, 'aria-label': 'Schließen' } };
export const Pressed: Story = { args: { icon: <ZoomIn size={16} />, 'aria-label': 'Raster anzeigen', pressed: true } };
export const Disabled: Story = { args: { disabled: true } };
/** Dense rows use `sm`; touch screens still get the full 44 px target. */
export const Small: Story = { args: { size: 'sm' } };
