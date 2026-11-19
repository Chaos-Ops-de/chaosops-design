import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, type TabItem } from './Tabs';
import { TabPanel } from './TabPanel';

const meta = {
  title: 'Web/Tabs',
  component: Tabs,
  parameters: { layout: 'padded' },
  args: { items: [], value: '', onChange: () => {} },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const base: TabItem[] = [
  { id: 'overview', label: 'Übersicht' },
  { id: 'schedule', label: 'Ablauf' },
  { id: 'team', label: 'Team' },
];

const many: TabItem[] = [
  'Übersicht', 'Ablauf', 'Team', 'Aufgaben', 'Material', 'Budget', 'Dokumente', 'Einstellungen',
].map((label) => ({ id: label.toLowerCase(), label }));

function Demo({ items, label }: { items: TabItem[]; label: string }) {
  const firstEnabled = items.find((i) => !i.disabled)!;
  const [value, setValue] = useState(firstEnabled.id);
  return (
    <div style={{ maxWidth: 560, color: 'var(--chaos-ink)' }}>
      <Tabs items={items} value={value} onChange={setValue} aria-label={label} />
      <div style={{ paddingTop: 16 }}>
        {items.map((item) => (
          <TabPanel key={item.id} id={item.id} value={value} minHeight={80}>
            <p style={{ margin: 0 }}>Inhalt von „{item.label}“. Beim Wechsel blendet das alte Panel aus, kurze Pause, dann blendet das neue ein.</p>
          </TabPanel>
        ))}
      </div>
    </div>
  );
}

export const Default: Story = { render: () => <Demo items={base} label="Event-Bereiche" /> };

/** Eight tabs in a narrow container: one line, horizontal scroll, edge fades and chevrons (desktop). */
export const EightTabsScrolling: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Demo items={many} label="Alle Bereiche" />
    </div>
  ),
};

/** Five or more tabs on a phone collapse into a trigger that opens a bottom sheet. */
export const Mobile: Story = {
  globals: { viewport: { value: 'phone', isRotated: false } },
  render: () => <Demo items={many} label="Alle Bereiche" />,
};

/** Under five tabs on a phone: a segmented control. */
export const SegmentedUnderFive: Story = {
  globals: { viewport: { value: 'phone', isRotated: false } },
  render: () => <Demo items={base} label="Event-Bereiche" />,
};

export const WithDisabled: Story = {
  render: () => (
    <Demo
      items={[
        { id: 'overview', label: 'Übersicht' },
        { id: 'schedule', label: 'Ablauf', disabled: true },
        { id: 'team', label: 'Team' },
        { id: 'budget', label: 'Budget', disabled: true },
        { id: 'docs', label: 'Dokumente' },
      ]}
      label="Event-Bereiche"
    />
  ),
};
