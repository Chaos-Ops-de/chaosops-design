import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast, ToastContainer, useToast } from './Toast';
import { Button } from '../Button';

const meta = {
  title: 'Web/Toast',
  component: Toast,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    duration: 0,
    onClose: () => {},
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: { message: 'Änderungen gespeichert.', type: 'success' },
};

export const Error: Story = {
  args: { message: 'Speichern fehlgeschlagen.', type: 'error', showCloseButton: true },
};

export const Warning: Story = {
  args: { message: 'Ungespeicherte Änderungen.', type: 'warning' },
};

export const Info: Story = {
  args: { message: 'Neue Version verfügbar.', type: 'info' },
};

/** No `duration`: an error stays until acknowledged, so the close button shows by itself. */
export const PersistentError: Story = {
  args: { message: 'Verbindung verloren. Neuer Versuch in 5 Sekunden.', type: 'error', duration: undefined },
};

export const WithUndo: Story = {
  args: {
    message: 'Termin gelöscht.',
    type: 'info',
    duration: undefined,
    action: { label: 'Rückgängig', onClick: () => {} },
  },
};

/**
 * Defaults per type: info/success dismiss after 4 s, warning after 7 s, errors
 * stay. Hover or focus a toast to pause its timer; it resumes with the time
 * that was left. On touch, swipe sideways to dismiss.
 */
export const TimersAndPause: Story = {
  args: { message: 'Demo' },
  render: () => {
    const [run, setRun] = useState(0);
    return (
      <div style={{ padding: 24 }}>
        <Button onClick={() => setRun((n) => n + 1)}>Toasts neu starten</Button>
        <p style={{ maxWidth: 480, color: 'var(--chaos-ink-muted)' }}>
          Info 4 s · Warnung 7 s · Fehler bleibt. Mit der Maus über einen Toast fahren, um ihn anzuhalten.
        </p>
        <ToastContainer
          key={run}
          position="bottom-right"
          onRemove={() => {}}
          toasts={[
            { id: 'a', message: 'Gespeichert (4 s).', type: 'success' },
            { id: 'b', message: 'Speicher fast voll (7 s).', type: 'warning' },
            { id: 'c', message: 'Upload fehlgeschlagen (bleibt).', type: 'error' },
          ]}
        />
      </div>
    );
  },
};

/** Three toasts show at once; the fourth waits in the queue until a slot frees. */
export const StackWithQueue: Story = {
  args: { message: 'Demo' },
  render: () => {
    const { toasts, removeToast, addToast } = useToast();
    return (
      <div style={{ padding: 24 }}>
        <Button onClick={() => addToast(`Meldung ${toasts.length + 1}`, 'info', 0)}>Toast hinzufügen</Button>
        <p style={{ maxWidth: 480, color: 'var(--chaos-ink-muted)' }}>
          Sichtbar: {Math.min(toasts.length, 3)} · in der Warteschlange: {Math.max(0, toasts.length - 3)}. Schließe einen
          Toast, damit der nächste nachrückt.
        </p>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  },
};

/** Without a `position`, phones get `top-center` instead of bottom-right. */
export const MobileTopCenter: Story = {
  globals: { viewport: { value: 'phone', isRotated: false } },
  args: { message: 'Änderungen gespeichert.', type: 'success' },
};
