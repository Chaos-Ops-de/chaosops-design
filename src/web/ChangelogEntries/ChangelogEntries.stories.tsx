import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChangelogEntries, type ChangelogEntry } from './ChangelogEntries';

const meta = {
  title: 'Web/ChangelogEntries',
  component: ChangelogEntries,
} satisfies Meta<typeof ChangelogEntries>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleEntries: ChangelogEntry[] = [
  {
    id: 'event-archiving',
    date: '2026-07-17',
    tag: 'neu',
    title: 'Veranstaltungen archivieren',
    description:
      'Vergangene Veranstaltungen wandern jetzt automatisch ins Archiv, sodass dein Dashboard übersichtlich bleibt.',
  },
  {
    id: 'faster-dashboard',
    date: '2026-07-02',
    tag: 'verbessert',
    title: 'Schnelleres Dashboard',
    description: 'Die Ladezeit des Dashboards wurde um 40% reduziert.',
  },
  {
    id: 'fix-login-bug',
    date: '2026-06-20',
    tag: 'behoben',
    title: 'Login-Fehler behoben',
    description: 'Ein Fehler, der gelegentlich zu doppelten Login-Anfragen führte, wurde behoben.',
  },
];

export const Default: Story = {
  args: { entries: sampleEntries },
};

export const Empty: Story = {
  args: { entries: [] },
};
