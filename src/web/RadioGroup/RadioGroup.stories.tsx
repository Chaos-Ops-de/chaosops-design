import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from './RadioGroup';
import { FormField } from '../FormField';

const options = [
  { value: 'day', label: 'Tagesplan' },
  { value: 'week', label: 'Wochenplan' },
  { value: 'event', label: 'Ganze Veranstaltung' },
];

const meta = {
  title: 'Web/RadioGroup',
  component: RadioGroup,
  args: { options, legend: 'Ansicht', defaultValue: 'day' },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {};

export const Horizontal: Story = { args: { orientation: 'horizontal' } };

export const WithDescriptions: Story = {
  args: {
    legend: 'Sichtbarkeit',
    defaultValue: 'team',
    options: [
      { value: 'private', label: 'Privat', description: 'Nur du siehst den Plan.' },
      { value: 'team', label: 'Team', description: 'Alle Mitglieder deiner Organisation.' },
      { value: 'public', label: 'Öffentlich', description: 'Jeder mit dem Link.' },
    ],
  },
};

export const DisabledOption: Story = {
  args: {
    options: [
      { value: 'day', label: 'Tagesplan' },
      { value: 'week', label: 'Wochenplan', disabled: true },
      { value: 'event', label: 'Ganze Veranstaltung' },
    ],
  },
};

export const Invalid: Story = {
  args: { defaultValue: undefined, invalid: true },
};

export const InFormField: Story = {
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <FormField label="Plantyp" error="Bitte wähle eine Option." required>
        <RadioGroup {...args} legend={undefined} aria-label="Plantyp" defaultValue={undefined} />
      </FormField>
    </div>
  ),
};
