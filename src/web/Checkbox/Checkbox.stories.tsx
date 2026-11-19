import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';
import { FormField } from '../FormField';

const meta = {
  title: 'Web/Checkbox',
  component: Checkbox,
  args: { label: 'Newsletter abonnieren' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };

/** Mixed state, e.g. a parent row with only some children selected. */
export const Indeterminate: Story = { args: { indeterminate: true, label: 'Alle Schichten' } };

export const WithDescription: Story = {
  args: { description: 'Etwa eine Mail pro Monat, jederzeit abbestellbar.' },
};

export const Invalid: Story = {
  args: { invalid: true, label: 'Ich akzeptiere die Nutzungsbedingungen' },
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Checkbox {...args} disabled />
      <Checkbox {...args} disabled defaultChecked />
    </div>
  ),
};

export const InFormField: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <FormField label="Einwilligung" error="Bitte bestätige, um fortzufahren." hint="Pflichtangabe">
        <Checkbox label="Ich stimme der Datenverarbeitung zu" />
      </FormField>
    </div>
  ),
};

/** A parent box that reflects its children: all, some (mixed), or none. */
export const List: Story = {
  render: () => {
    const [items, setItems] = useState({ aufbau: true, kasse: false, abbau: false });
    const values = Object.values(items);
    const all = values.every(Boolean);
    const some = values.some(Boolean);
    const labels: Record<keyof typeof items, string> = { aufbau: 'Aufbau', kasse: 'Kasse', abbau: 'Abbau' };
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Checkbox
          label="Alle Schichten"
          checked={all}
          indeterminate={some && !all}
          onChange={(e) => setItems({ aufbau: e.target.checked, kasse: e.target.checked, abbau: e.target.checked })}
        />
        <div style={{ paddingInlineStart: 34, display: 'flex', flexDirection: 'column' }}>
          {(Object.keys(items) as Array<keyof typeof items>).map((key) => (
            <Checkbox
              key={key}
              label={labels[key]}
              checked={items[key]}
              onChange={(e) => setItems((prev) => ({ ...prev, [key]: e.target.checked }))}
            />
          ))}
        </div>
      </div>
    );
  },
};
