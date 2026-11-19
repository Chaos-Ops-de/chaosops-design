import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gremlin, type GremlinAnimation } from './Gremlin';
import loginGremlin from '../../assets/gremlins/login.png';

const meta = {
  title: 'Web/Gremlin',
  component: Gremlin,
  args: { source: loginGremlin, size: 120 },
} satisfies Meta<typeof Gremlin>;

export default meta;
type Story = StoryObj<typeof meta>;

const ANIMATIONS: GremlinAnimation[] = ['none', 'bounce', 'wiggle', 'float'];

export const Static: Story = {};
export const Animations: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24 }}>
      {ANIMATIONS.map((a) => <Gremlin key={a} {...args} animation={a} />)}
    </div>
  ),
};
