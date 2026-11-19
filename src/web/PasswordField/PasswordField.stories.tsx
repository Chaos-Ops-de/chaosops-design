import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordField } from './PasswordField';
import { FormField } from '../FormField';
import { optionalPasswordRules, defaultPasswordRules } from '../../utils/password';

const meta = {
  title: 'Web/PasswordField',
  component: PasswordField,
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof PasswordField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Passwort' },
};

export const WithChecklist: Story = {
  args: {
    placeholder: 'Neues Passwort',
    showChecklist: true,
    rules: [...defaultPasswordRules, ...optionalPasswordRules],
  },
};

/** The bar grows as the password gets longer and less predictable; try "P@ssw0rd" against a long phrase. */
export const WithStrength: Story = {
  args: { placeholder: 'Neues Passwort', showStrength: true, showChecklist: true },
};

/** The key button hands a generated password to `onGenerate` and reveals the field. */
export const WithGenerate: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <PasswordField
        {...args}
        placeholder="Neues Passwort"
        showStrength
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onGenerate={setValue}
      />
    );
  },
};

export const Invalid: Story = {
  render: (args) => (
    <FormField label="Passwort" error="Das Passwort stimmt nicht." required>
      <PasswordField {...args} defaultValue="falsches-passwort" />
    </FormField>
  ),
};

export const Strong: Story = {
  args: {
    showStrength: true,
    showChecklist: true,
    defaultValue: 'correct horse battery staple',
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'geheim' },
};
