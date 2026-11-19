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
export const Valid: Story = { args: { valid: true, defaultValue: 'Jugendfreizeit 2025' } };
export const Invalid: Story = { args: { invalid: true, defaultValue: 'Doppelter Name' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Gesperrt' } };
export const Date: Story = { args: { type: 'date' } };
export const Multiline: Story = { render: () => <Textarea placeholder="Beschreibung" /> };

/**
 * Browsers paint autofilled fields pale blue. Here the field keeps the surface
 * color and readable text in both themes. Focus the field and pick a saved
 * address from the browser to see it.
 */
export const AutofillNote: Story = {
  render: () => (
    <form style={{ maxWidth: 360 }} onSubmit={(e) => e.preventDefault()}>
      <Input type="email" name="email" autoComplete="email" placeholder="E-Mail (Autofill testen)" />
    </form>
  ),
};

export const TextareaStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420 }}>
      <Textarea placeholder="Beschreibung" />
      <Textarea valid defaultValue="Sieht gut aus." />
      <Textarea invalid defaultValue="Zu kurz." />
    </div>
  ),
};
