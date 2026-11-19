import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Archive, Copy, MoreHorizontal, Pencil, Share2, Trash2 } from 'lucide-react';
import { Menu, type MenuItem } from './Menu';
import { Popover } from './Popover';
import { Button } from '../Button';
import { FormField } from '../FormField';
import { Input } from '../Input';

const meta = {
  title: 'Web/Menu',
  component: Menu,
  parameters: { layout: 'padded' },
  args: { trigger: <Button variant="outline">Aktionen</Button>, items: [] },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

function useLog() {
  const [last, setLast] = useState('noch nichts gewählt');
  const item = (id: string, label: string, extra: Partial<MenuItem> = {}): MenuItem => ({
    id, label, onSelect: () => setLast(label), ...extra,
  });
  return { last, item };
}

const Frame = ({ last, children }: { last: string; children: React.ReactNode }) => (
  <div style={{ display: 'grid', gap: 12, color: 'var(--chaos-ink)' }}>
    {children}
    <p style={{ margin: 0, fontSize: 13, color: 'var(--chaos-ink-muted)' }}>Zuletzt: {last}</p>
  </div>
);

export const Basic: Story = {
  render: (args) => {
    const { last, item } = useLog();
    return (
      <Frame last={last}>
        <Menu {...args} aria-label="Aktionen" items={[item('rename', 'Umbenennen'), item('copy', 'Duplizieren'), item('share', 'Teilen')]} />
      </Frame>
    );
  },
};

/** Groups get dividers; the destructive item always ends up last, alone, and red. */
/** A header says who or what the menu is about; it is skipped by arrow-key navigation. */
export const WithHeader: Story = {
  render: (args) => (
    <Menu
      {...args}
      aria-label="Konto"
      header={<div><strong>Luca</strong><div style={{ fontSize: '0.8rem' }}>Product Owner</div></div>}
      items={[item('profile', 'Nutzerprofil'), item('logout', 'Abmelden')]}
    />
  ),
};

export const WithGroupsAndDanger: Story = {
  render: (args) => {
    const { last, item } = useLog();
    return (
      <Frame last={last}>
        <Menu
          {...args}
          aria-label="Eintrag"
          groups={[
            [item('rename', 'Umbenennen'), item('copy', 'Duplizieren')],
            [item('share', 'Teilen'), item('archive', 'Archivieren', { disabled: true })],
            [item('delete', 'Löschen', { danger: true })],
          ]}
        />
      </Frame>
    );
  },
};

export const WithIconsAndShortcuts: Story = {
  render: (args) => {
    const { last, item } = useLog();
    return (
      <Frame last={last}>
        <Menu
          {...args}
          trigger={<Button variant="ghost" aria-label="Mehr Aktionen" icon={<MoreHorizontal size={18} />} />}
          aria-label="Mehr Aktionen"
          groups={[
            [
              item('rename', 'Umbenennen', { icon: <Pencil size={16} />, shortcut: 'F2' }),
              item('copy', 'Duplizieren', { icon: <Copy size={16} />, shortcut: 'Strg+D' }),
              item('share', 'Teilen', { icon: <Share2 size={16} /> }),
              item('archive', 'Archivieren', { icon: <Archive size={16} />, shortcut: 'E' }),
            ],
            [item('delete', 'Löschen', { icon: <Trash2 size={16} />, danger: true, shortcut: 'Entf' })],
          ]}
        />
      </Frame>
    );
  },
};

/** The trigger sits at the bottom right: the menu flips upward and stays inside the viewport. */
export const NearViewportEdge: Story = {
  parameters: { layout: 'fullscreen' },
  render: (args) => {
    const { last, item } = useLog();
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 16, boxSizing: 'border-box', color: 'var(--chaos-ink)' }}>
        <div style={{ display: 'grid', gap: 8, justifyItems: 'end' }}>
          <span style={{ fontSize: 13, color: 'var(--chaos-ink-muted)' }}>Zuletzt: {last}</span>
          <Menu
            {...args}
            aria-label="Aktionen"
            placement="bottom-start"
            items={[item('rename', 'Umbenennen'), item('copy', 'Duplizieren'), item('share', 'Teilen'), item('archive', 'Archivieren')]}
          />
        </div>
      </div>
    );
  },
};

/**
 * Tab to the button, then: Enter, Space or ArrowDown opens on the first item; ArrowUp opens on the last.
 * Arrows move (wrapping, disabled items skipped), Home/End jump, a letter jumps ("D" lands on Duplizieren,
 * again on Drucken), Enter selects, Escape closes and refocuses the button, Tab closes.
 */
export const KeyboardOnly: Story = {
  render: (args) => {
    const { last, item } = useLog();
    return (
      <Frame last={last}>
        <Menu
          {...args}
          aria-label="Tastaturtest"
          items={[
            item('rename', 'Umbenennen'),
            item('copy', 'Duplizieren'),
            item('print', 'Drucken'),
            item('lock', 'Sperren', { disabled: true }),
            item('share', 'Teilen'),
          ]}
        />
      </Frame>
    );
  },
};

/** A popover holds free content. Focus lands on the first field; Escape returns it to the button. */
export const PopoverWithForm: Story = {
  render: () => {
    const [name, setName] = useState('');
    const [saved, setSaved] = useState('');
    return (
      <div style={{ display: 'grid', gap: 12, color: 'var(--chaos-ink)' }}>
        <Popover trigger={<Button variant="outline">Umbenennen</Button>} aria-label="Umbenennen">
          {({ close }) => (
            <form
              style={{ display: 'grid', gap: 12, width: 260 }}
              onSubmit={(e) => { e.preventDefault(); setSaved(name); close(); }}
            >
              <FormField label="Neuer Name">
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </FormField>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => close()}>Abbrechen</Button>
                <Button type="submit" disabled={!name.trim()}>Speichern</Button>
              </div>
            </form>
          )}
        </Popover>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--chaos-ink-muted)' }}>Gespeichert: {saved || 'nichts'}</p>
      </div>
    );
  },
};

/**
 * An item with `items` opens a submenu: hover it, or press Enter, Space or the arrow toward
 * the reading direction. Move the pointer diagonally toward the submenu and it stays open
 * (the safe triangle). The arrow back or Escape closes just that level.
 */
export const WithSubmenus: Story = {
  render: (args) => {
    const { last, item } = useLog();
    return (
      <Frame last={last}>
        <Menu
          {...args}
          aria-label="Eintrag"
          groups={[
            [
              item('rename', 'Umbenennen', { icon: <Pencil size={16} /> }),
              {
                id: 'share',
                label: 'Teilen',
                icon: <Share2 size={16} />,
                items: [
                  item('link', 'Link kopieren', { icon: <Copy size={16} /> }),
                  item('mail', 'Per E-Mail'),
                  {
                    id: 'team',
                    label: 'Mit Team teilen',
                    items: [item('crew', 'Crew'), item('staff', 'Leitung'), item('all', 'Alle')],
                  },
                ],
              },
              {
                id: 'move',
                label: 'Verschieben nach',
                icon: <Archive size={16} />,
                items: [item('today', 'Heute'), item('tomorrow', 'Morgen'), item('later', 'Später', { disabled: true })],
              },
            ],
            [item('delete', 'Löschen', { danger: true, icon: <Trash2 size={16} /> })],
          ]}
        />
      </Frame>
    );
  },
};

/** Near the right edge a submenu opens toward the left instead of being clipped. */
export const SubmenuNearEdge: Story = {
  decorators: [(Story) => <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Story /></div>],
  render: (args) => {
    const { last, item } = useLog();
    return (
      <Frame last={last}>
        <Menu
          {...args}
          placement="bottom-end"
          aria-label="Eintrag"
          items={[
            item('rename', 'Umbenennen'),
            { id: 'share', label: 'Teilen', items: [item('link', 'Link kopieren'), item('mail', 'Per E-Mail')] },
          ]}
        />
      </Frame>
    );
  },
};
