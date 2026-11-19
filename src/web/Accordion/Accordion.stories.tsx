import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, type AccordionItem } from './Accordion';

const meta = {
  title: 'Web/Accordion',
  component: Accordion,
  parameters: { layout: 'padded' },
  args: { items: [] },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const items: AccordionItem[] = [
  { id: 'what', title: 'Was ist ein Ablaufplan?', content: 'Eine Liste aller Programmpunkte eines Events mit Uhrzeit, Ort und Verantwortlichen.' },
  { id: 'who', title: 'Wer kann den Plan sehen?', content: 'Alle Mitglieder der Organisation. Gäste sehen nur freigegebene Pläne.' },
  { id: 'share', title: 'Wie teile ich einen Plan?', content: 'Über „Teilen“ erzeugst du einen Link, der jederzeit wieder deaktiviert werden kann.' },
];

/** One item open at a time. Clicking the open one closes it. */
export const Single: Story = { args: { items, type: 'single' } };

/** Each item opens on its own. */
export const Multiple: Story = { args: { items, type: 'multiple', defaultOpen: ['what', 'share'] } };

/** Disabled headers can't be opened and are skipped by the arrow keys. */
export const Disabled: Story = {
  args: {
    items: items.map((item, i) => (i === 1 ? { ...item, disabled: true } : item)),
    type: 'single',
  },
};

export const DefaultOpen: Story = { args: { items, type: 'single', defaultOpen: ['who'], collapsible: false } };

export const Controlled: Story = {
  args: { items },
  render: (args) => {
    const [open, setOpen] = useState<string[]>(['what']);
    return (
      <div style={{ display: 'grid', gap: 8, color: 'var(--chaos-ink)' }}>
        <Accordion {...args} type="multiple" value={open} onValueChange={setOpen} />
        <span style={{ fontSize: 13, color: 'var(--chaos-ink-muted)' }}>Offen: {open.join(', ') || 'nichts'}</span>
      </div>
    );
  },
};
