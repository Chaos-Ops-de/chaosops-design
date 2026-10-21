import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from './FormField';
import { Input, Textarea } from '../Input';
import { Button } from '../Button';

const meta = {
  title: 'Web/FormField',
  component: FormField,
  args: { label: 'Name der Veranstaltung', children: <Input placeholder="z.B. Jugendfreizeit 2025" /> },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { required: true } };
export const WithHint: Story = { args: { hint: 'Wird auf dem Display angezeigt.' } };
export const WithError: Story = { args: { error: 'Bitte einen Namen eingeben.' } };
export const WithWarning: Story = { args: { warning: 'Es gibt bereits eine Veranstaltung mit diesem Namen.' } };

export const Form: Story = {
  render: () => (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 420 }} onSubmit={(e) => e.preventDefault()}>
      <FormField label="Name" required><Input autoFocus /></FormField>
      <FormField label="Datum" required><Input type="date" /></FormField>
      <FormField label="Beschreibung" hint="Optional"><Textarea /></FormField>
      <Button type="submit" block>Erstellen</Button>
    </form>
  ),
};
