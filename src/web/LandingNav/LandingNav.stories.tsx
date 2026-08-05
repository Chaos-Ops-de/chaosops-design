import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingNav } from './LandingNav';
import logo from '../../assets/logo.png';

const meta = {
  title: 'Web/LandingNav',
  component: LandingNav,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    logoSrc: logo,
    onNavigate: () => {},
  },
} satisfies Meta<typeof LandingNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { activePath: '/' },
};

export const OnDocumentationPage: Story = {
  args: { activePath: '/documentation' },
};
