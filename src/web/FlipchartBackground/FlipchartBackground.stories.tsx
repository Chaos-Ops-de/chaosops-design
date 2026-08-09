import type React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlipchartBackground } from './FlipchartBackground';

const wrapperStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: 320,
  background: 'var(--chaos-bg)',
  overflow: 'hidden',
};

const meta = {
  title: 'Web/FlipchartBackground',
  component: FlipchartBackground,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={wrapperStyle}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FlipchartBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { lines: true },
};

export const LinesOnly: Story = {
  args: { lines: true, holes: false, tornEdge: false, doodles: false },
};

export const HolesOnly: Story = {
  args: { tornEdge: false, doodles: false },
};

export const Compact: Story = {
  args: { holeSize: 22, holeTop: 10, tornEdge: false, doodles: false },
};
