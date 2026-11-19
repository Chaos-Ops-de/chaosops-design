import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { OtpInput } from './OtpInput';

const meta = { title: 'Primitives/OtpInput', component: OtpInput } satisfies Meta<typeof OtpInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: '', onChange: () => {} },
  render: () => {
    const [code, setCode] = useState('');
    return <View style={{ width: 340 }}><OtpInput value={code} onChange={setCode} /></View>;
  },
};

export const Error: Story = {
  args: { value: '123456', onChange: () => {} },
  render: () => {
    const [code, setCode] = useState('123456');
    return <View style={{ width: 340 }}><OtpInput value={code} onChange={setCode} status="error" /></View>;
  },
};

export const Success: Story = {
  args: { value: '123456', onChange: () => {} },
  render: () => <View style={{ width: 340 }}><OtpInput value="123456" onChange={() => {}} status="success" /></View>,
};

/** For the display pairing code: letters and digits, any length. */
export const Alphanumeric: Story = {
  args: { value: 'AB12', onChange: () => {} },
  render: () => {
    const [code, setCode] = useState('AB12');
    return <View style={{ width: 340 }}><OtpInput length={8} charset="alphanumeric" value={code} onChange={setCode} /></View>;
  },
};
