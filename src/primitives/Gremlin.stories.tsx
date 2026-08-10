import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gremlin, type GremlinName } from './Gremlin';
import loginGremlin from '../assets/gremlins/login.png';
import sleepGremlin from '../assets/gremlins/sleep.png';
import downGremlin from '../assets/gremlins/down.png';

const meta = {
  title: 'Primitives/Gremlin',
  component: Gremlin,
} satisfies Meta<typeof Gremlin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {
  args: { source: loginGremlin, name: 'login' as GremlinName, size: 120, animation: 'none' },
};

export const Bounce: Story = {
  args: { source: loginGremlin, name: 'login' as GremlinName, size: 120, animation: 'bounce' },
};

export const Wiggle: Story = {
  args: { source: sleepGremlin, name: 'sleep' as GremlinName, size: 120, animation: 'wiggle' },
};

export const Float: Story = {
  args: { source: downGremlin, name: 'down' as GremlinName, size: 120, animation: 'float' },
};

export const AllAnimations: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 24 }}>
      <Gremlin source={loginGremlin} size={96} animation="none" />
      <Gremlin source={loginGremlin} size={96} animation="bounce" />
      <Gremlin source={loginGremlin} size={96} animation="wiggle" />
      <Gremlin source={loginGremlin} size={96} animation="float" />
    </View>
  ),
};
