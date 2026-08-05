import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotFoundPage } from './NotFoundPage';
import gremlin404 from '../../assets/gremlins/404.png';

const meta = {
  title: 'Web/NotFoundPage',
  component: NotFoundPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof NotFoundPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { gremlinSrc: gremlin404 },
};
