import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordInput } from './PasswordInput';

const meta = { title: 'Primitives/PasswordInput', component: PasswordInput } satisfies Meta<typeof PasswordInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => {
    const [pw, setPw] = useState('');
    return <View style={{ width: 320 }}><PasswordInput value={pw} onChangeText={setPw} /></View>;
  },
};

/** The bar grows with length and unpredictability. */
export const WithStrength: Story = {
  args: {},
  render: () => {
    const [pw, setPw] = useState('correct horse');
    return <View style={{ width: 320 }}><PasswordInput showStrength placeholder="Neues Passwort" value={pw} onChangeText={setPw} /></View>;
  },
};

export const Invalid: Story = {
  args: {},
  render: () => {
    const [pw, setPw] = useState('falsch');
    return <View style={{ width: 320 }}><PasswordInput invalid value={pw} onChangeText={setPw} /></View>;
  },
};
