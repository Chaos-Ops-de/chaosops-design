import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Web/Button',
  component: Button,
  args: { children: 'Speichern' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Accent: Story = { args: { variant: 'accent' } };
export const Success: Story = { args: { variant: 'success' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Löschen' } };
export const Outline: Story = { args: { variant: 'outline', children: 'Abbrechen' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Mehr' } };
export const Loading: Story = { args: { loading: true, children: 'Wird erstellt…' } };
export const Disabled: Story = { args: { disabled: true } };
export const Block: Story = { args: { block: true, size: 'lg' } };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button size="sm">Klein</Button>
      <Button>Mittel</Button>
      <Button size="lg">Groß</Button>
    </div>
  ),
};
