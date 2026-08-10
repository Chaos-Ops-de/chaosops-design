import type { Meta, StoryObj } from '@storybook/react-vite';
import { ResponsiveContainer } from './ResponsiveContainer';

const meta = {
  title: 'Web/ResponsiveContainer',
  component: ResponsiveContainer,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ResponsiveContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    style: { display: 'flex', flexDirection: 'column', border: '1px dashed #999' },
    children: (
      <>
        <p>Resize the canvas — padding, gap, and font-size step down at 768px, 480px, and 375px.</p>
        <p>Inspect the rendered element's data-mobile / data-tablet / data-small-mobile attributes.</p>
      </>
    ),
  },
};
