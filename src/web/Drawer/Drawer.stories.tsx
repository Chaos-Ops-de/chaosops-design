import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer, type DrawerProps } from './Drawer';
import { Button } from '../Button';

const meta = {
  title: 'Web/Drawer',
  component: Drawer,
  parameters: { layout: 'fullscreen' },
  args: { isOpen: false, onClose: () => {}, children: null },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ children, ...props }: Omit<DrawerProps, 'isOpen' | 'onClose' | 'children'> & { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: 24, color: 'var(--chaos-ink)' }}>
      <p style={{ maxWidth: 520 }}>
        Das Drawer-Panel bleibt neben der Seite lesbar: mindestens 320 px, höchstens 40 % der Breite. Escape oder ein Klick auf den
        Hintergrund schließt es, der Fokus kehrt zum Button zurück.
      </p>
      <Button onClick={() => setOpen(true)}>Drawer öffnen</Button>
      <Drawer {...props} isOpen={open} onClose={() => setOpen(false)}>
        {children ?? <p style={{ margin: 0 }}>Hier steht der Inhalt des Drawers.</p>}
      </Drawer>
    </div>
  );
}

export const End: Story = { render: () => <Demo title="Neuigkeiten" side="end" /> };

export const Start: Story = { render: () => <Demo title="Dokumente" side="start" /> };

/** Right-to-left text flips which physical edge `end` and `start` mean. */
export const Rtl: Story = {
  render: () => {
    useEffect(() => {
      const prev = document.body.dir;
      document.body.dir = 'rtl';
      return () => { document.body.dir = prev; };
    }, []);
    return <Demo title="Neuigkeiten" side="end" />;
  },
};

export const WithLongContent: Story = {
  render: () => (
    <Demo title="Änderungsprotokoll" width={520}>
      {Array.from({ length: 24 }, (_, i) => (
        <section key={i} style={{ marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 4px' }}>Version 0.{24 - i}.0</h3>
          <p style={{ margin: 0, color: 'var(--chaos-ink-muted)' }}>Verbesserungen am Ablaufplan, neue Filter für das Team und kleinere Fehlerbehebungen.</p>
        </section>
      ))}
    </Demo>
  ),
};

/** On a phone the drawer fills the width. For a bottom-anchored panel use `Sheet`. */
export const Narrow: Story = {
  globals: { viewport: { value: 'phone', isRotated: false } },
  render: () => <Demo title="Neuigkeiten" />,
};
