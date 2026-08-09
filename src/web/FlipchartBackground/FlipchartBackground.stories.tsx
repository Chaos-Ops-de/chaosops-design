import type React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlipchartBackground } from './FlipchartBackground';

const wrapperStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: 320,
  background: 'repeating-linear-gradient(0deg, var(--chaos-bg) 0px, var(--chaos-bg) 39px, var(--chaos-tab-bar-border) 40px, var(--chaos-bg) 41px)',
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

export const Default: Story = {};

export const HolesOnly: Story = {
  args: { tornEdge: false, doodles: false },
};

export const Compact: Story = {
  args: { holeSize: 22, holeTop: 10, tornEdge: false, doodles: false },
};
