import type { Meta, StoryObj } from '@storybook/react-vite';
import { WelcomeCard } from './WelcomeCard';

const meta = {
  title: 'Web/WelcomeCard',
  component: WelcomeCard,
  args: { title: 'Hallo!', text: 'Schön, dass du da bist. Lass uns loslegen.', actionLabel: 'Los geht\'s', onAction: () => {} },
} satisfies Meta<typeof WelcomeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
