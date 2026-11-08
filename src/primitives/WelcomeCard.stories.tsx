import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { WelcomeCard } from './WelcomeCard';

const meta = { title: 'Primitives/WelcomeCard', component: WelcomeCard } satisfies Meta<typeof WelcomeCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Hallo, ich bin dein Chaos-Helfer',
    text: 'Damit wir dir passende Hinweise geben können, brauchen wir ein paar Angaben.',
    actionLabel: 'Los geht’s',
    onAction: () => {},
  },
  render: (args) => <View style={{ width: 320 }}><WelcomeCard {...args} /></View>,
};
