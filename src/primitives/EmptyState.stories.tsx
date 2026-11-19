import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';
import { Gremlin } from './Gremlin';
import sleepGremlin from '../assets/gremlins/sleep.png';
import downGremlin from '../assets/gremlins/down.png';
import mailGremlin from '../assets/gremlins/mail.png';
import hideGremlin from '../assets/gremlins/hide.png';

const meta = {
  title: 'Primitives/EmptyState',
  component: EmptyState,
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstRun: Story = {
  args: {
    kind: 'firstRun',
    illustration: <Gremlin source={{ uri: sleepGremlin }} size={120} animation="float" />,
    action: { label: 'Erstes Event anlegen', onPress: () => {} },
  },
};

export const NoResults: Story = {
  args: {
    kind: 'noResults',
    illustration: <Gremlin source={{ uri: hideGremlin }} size={120} />,
    secondaryAction: { label: 'Suche zurücksetzen', onPress: () => {} },
  },
};

export const Error: Story = {
  args: {
    kind: 'error',
    illustration: <Gremlin source={{ uri: downGremlin }} size={120} animation="wiggle" />,
    action: { label: 'Erneut versuchen', onPress: () => {} },
  },
};

export const Filtered: Story = {
  args: {
    kind: 'filtered',
    illustration: <Gremlin source={{ uri: mailGremlin }} size={120} />,
    action: { label: 'Filter lockern', onPress: () => {} },
  },
};

export const WithoutIllustration: Story = {
  args: { kind: 'noResults', title: 'Keine Mitglieder', description: 'Lade jemanden ein, damit er hier erscheint.' },
};
