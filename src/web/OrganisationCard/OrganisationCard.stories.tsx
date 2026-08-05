import type { Meta, StoryObj } from '@storybook/react-vite';
import { OrganisationCard } from './OrganisationCard';

const meta = {
  title: 'Web/OrganisationCard',
  component: OrganisationCard,
  args: {
    onClick: () => {},
  },
} satisfies Meta<typeof OrganisationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Chaos Ops e.V.',
    description: 'Community-Verein für Events und Workshops.',
  },
};

export const Selected: Story = {
  args: {
    name: 'Chaos Ops e.V.',
    description: 'Community-Verein für Events und Workshops.',
    selected: true,
  },
};

export const WithoutDescription: Story = {
  args: {
    name: 'Minimal Org',
  },
};
