import type { Meta, StoryObj } from '@storybook/react-vite';
import { FooterAdmin } from './FooterAdmin';

const meta = {
  title: 'Web/FooterAdmin',
  component: FooterAdmin,
} satisfies Meta<typeof FooterAdmin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {
  args: { icon: 'home', text: 'Zur Startseite' },
};

export const Monitor: Story = {
  args: { icon: 'monitor', text: 'Zum Display' },
};
