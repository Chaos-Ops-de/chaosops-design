import type { Meta, StoryObj } from '@storybook/react-vite';
import { CookieBanner } from './CookieBanner';

const meta = {
  title: 'Web/CookieBanner',
  component: CookieBanner,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CookieBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    localStorage.removeItem('cookieConsent');
    return <CookieBanner />;
  },
};
