import type { Meta, StoryObj } from '@storybook/react-vite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { AuthScreen } from './AuthScreen';
import { PillButton } from './PillButton';

const meta = {
  title: 'Primitives/AuthScreen',
  component: AuthScreen,
  decorators: [
    (Story) => (
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 700 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
        <div style={{ height: 700 }}>
          <Story />
        </div>
      </SafeAreaProvider>
    ),
  ],
} satisfies Meta<typeof AuthScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AuthScreen>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Passwort zurücksetzen</Text>
      <View style={{ height: 12 }} />
      <PillButton label="Absenden" onPress={() => {}} />
    </AuthScreen>
  ),
};
