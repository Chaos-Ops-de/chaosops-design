import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner } from './Banner';
import { Button } from '../Button';

const meta = {
  title: 'Web/Banner',
  component: Banner,
  args: { children: 'Neue Version verfügbar. Lade die Seite neu, um sie zu nutzen.' },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Warning: Story = {
  args: { type: 'warning', children: 'Wartungsarbeiten am Samstag zwischen 02:00 und 04:00 Uhr.' },
};

export const Error: Story = {
  args: { type: 'error', children: 'Der Server antwortet nur verzögert. Änderungen werden später synchronisiert.' },
};

export const Success: Story = {
  args: { type: 'success', children: 'Die Verbindung wurde wiederhergestellt.' },
};

export const WithTitle: Story = {
  args: {
    type: 'warning',
    title: 'Eingeschränkter Betrieb',
    children: 'Der Export dauert aktuell länger als gewöhnlich.',
  },
};

/** Stays until the user closes it; a Toast is for transient news instead. */
export const Dismissible: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    return open ? (
      <Banner {...args} onDismiss={() => setOpen(false)} />
    ) : (
      <Button variant="outline" onClick={() => setOpen(true)}>Banner wieder anzeigen</Button>
    );
  },
};
