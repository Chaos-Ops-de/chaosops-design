import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthScreen } from './AuthScreen';

const meta = {
  title: 'Web/AuthScreen',
  component: AuthScreen,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AuthScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: <h1>Anmelden</h1> },
};
