import type { Meta, StoryObj } from '@storybook/react-vite';
import { SentryErrorBoundary } from './SentryErrorBoundary';
import { CloudflareError } from '../../utils/errors';
import downGremlin from '../../assets/gremlins/down.png';

function Bomb({ error }: { error: Error }): never {
  throw error;
}

const meta = {
  title: 'Web/SentryErrorBoundary',
  component: SentryErrorBoundary,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    downGremlinSrc: downGremlin,
    children: null,
  },
} satisfies Meta<typeof SentryErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GenericError: Story = {
  render: (args) => (
    <SentryErrorBoundary {...args}>
      <Bomb error={new Error('Simulierter Fehler für Storybook')} />
    </SentryErrorBoundary>
  ),
};

export const CloudflareOutage: Story = {
  render: (args) => (
    <SentryErrorBoundary {...args}>
      <Bomb error={new CloudflareError(522, '7f3a9c1d2e4b5678')} />
    </SentryErrorBoundary>
  ),
};
