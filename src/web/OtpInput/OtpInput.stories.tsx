import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { OtpInput, type OtpStatus } from './OtpInput';
import { ResendCode } from './ResendCode';
import { FormField } from '../FormField';

const meta = {
  title: 'Web/OtpInput',
  component: OtpInput,
  args: { autoFocus: false },
} satisfies Meta<typeof OtpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Paste "123 456" or "123-456" to fill every slot at once. */
export const Prefilled: Story = {
  args: { defaultValue: '123' },
};

export const Error: Story = {
  args: { defaultValue: '123456', status: 'error' },
};

export const Success: Story = {
  args: { defaultValue: '123456', status: 'success' },
};

/** For pairing codes with letters; input is uppercased and the keyboard is the text keyboard. */
export const Alphanumeric: Story = {
  args: { charset: 'alphanumeric', length: 8, defaultValue: 'ab12' },
};

export const Disabled: Story = {
  args: { defaultValue: '12', disabled: true },
};

export const InFormField: Story = {
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <FormField label="Bestätigungscode" hint="Wir haben dir einen Code per E-Mail geschickt.">
        <OtpInput {...args} />
      </FormField>
    </div>
  ),
};

/** The right code is 123456. A wrong one shakes, clears and refocuses; the right one locks green. */
export const VerifyFlow: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    const [status, setStatus] = useState<OtpStatus>('idle');
    return (
      <div style={{ maxWidth: 420 }}>
        <OtpInput
          {...args}
          value={value}
          status={status}
          autoFocus
          onChange={(v) => {
            setValue(v);
            if (status === 'error') setStatus('idle');
          }}
          onComplete={(code) => {
            if (code === '123456') {
              setStatus('success');
            } else {
              setStatus('error');
              setTimeout(() => {
                setValue('');
                setStatus('idle');
              }, 900);
            }
          }}
        />
      </div>
    );
  },
};

export const WithResend: Story = {
  render: (args) => (
    <div style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <OtpInput {...args} />
      <ResendCode seconds={30} onResend={() => {}} />
    </div>
  ),
};
