import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useBlurValidation } from './useBlurValidation';
import { FormField } from '../FormField';
import { Input } from '../Input';

const validateEmail = (value: string) => (/^\S+@\S+\.\S+$/.test(value) ? undefined : 'Bitte eine gültige E-Mail eingeben.');

function EmailField() {
  const [email, setEmail] = useState('');
  const validation = useBlurValidation<string>(validateEmail);

  return (
    <div style={{ maxWidth: 360 }}>
      <FormField
        label="E-Mail"
        required
        error={validation.error}
        valid={validation.valid ? 'Sieht gut aus.' : undefined}
        hint="Fehler erscheinen erst, wenn du das Feld verlässt — danach live."
        reserveMessageSpace
      >
        <Input
          type="email"
          value={email}
          valid={validation.valid}
          onChange={(e) => {
            setEmail(e.target.value);
            validation.onChange(e.target.value);
          }}
          onBlur={() => validation.onBlur(email)}
        />
      </FormField>
    </div>
  );
}

const meta = {
  title: 'Web/useBlurValidation',
  component: EmailField,
} satisfies Meta<typeof EmailField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Type a few letters (no error), tab away (error), then fix it (error clears instantly). */
export const EmailValidation: Story = {};
