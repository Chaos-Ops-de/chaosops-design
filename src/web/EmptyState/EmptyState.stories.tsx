import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';
import sleepGremlin from '../../assets/gremlins/sleep.png';
import hideGremlin from '../../assets/gremlins/hide.png';
import downGremlin from '../../assets/gremlins/down.png';
import notFoundGremlin from '../../assets/gremlins/404.png';

const mascot = (src: string) => <img src={src} alt="" width={120} height={120} />;

const meta = {
  title: 'Web/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstRun: Story = {
  args: {
    kind: 'firstRun',
    illustration: mascot(sleepGremlin),
    action: { label: 'Erstes Event anlegen', onClick: () => {} },
  },
};

export const NoResults: Story = {
  args: {
    kind: 'noResults',
    illustration: mascot(hideGremlin),
    action: { label: 'Suche zurücksetzen', onClick: () => {} },
  },
};

export const Error: Story = {
  args: {
    kind: 'error',
    illustration: mascot(downGremlin),
    action: { label: 'Erneut laden', onClick: () => {} },
    secondaryAction: { label: 'Support kontaktieren', onClick: () => {} },
  },
};

export const Filtered: Story = {
  args: {
    kind: 'filtered',
    illustration: mascot(notFoundGremlin),
    action: { label: 'Filter lockern', onClick: () => {} },
  },
};

export const WithoutIllustration: Story = {
  args: { kind: 'firstRun', action: { label: 'Loslegen', onClick: () => {} } },
};
