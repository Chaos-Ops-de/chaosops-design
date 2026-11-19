import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta = {
  title: 'Web/Switch',
  component: Switch,
  args: { checked: false, onChange: () => {}, 'aria-label': 'Benachrichtigungen' },
  render: (args) => {
    const [on, setOn] = useState(args.checked);
    return <Switch {...args} checked={on} onChange={setOn} />;
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};
export const On: Story = { args: { checked: true } };
export const Pending: Story = { args: { checked: true, pending: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Small: Story = { args: { size: 'sm' } };
export const WithLabel: Story = { args: { label: 'Erinnerung jeden Abend um 20 Uhr', 'aria-label': undefined } };

/**
 * Flips at once, asks the "server", and rolls back when it says no — the
 * pattern for a switch backed by a request.
 */
function RollbackDemo() {
  const [on, setOn] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  const change = (next: boolean) => {
    setOn(next); // optimistic
    setPending(true);
    setMessage('');
    setTimeout(() => {
      setOn(!next); // the request failed: roll back
      setPending(false);
      setMessage('Speichern fehlgeschlagen. Die Einstellung wurde zurückgesetzt.');
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <Switch checked={on} onChange={change} pending={pending} label="Mit dem Server synchronisieren" />
      <div role="status" style={{ minHeight: 20, fontSize: 13, color: 'var(--chaos-danger-ink)' }}>{message}</div>
    </div>
  );
}

export const OptimisticRollback: Story = { render: () => <RollbackDemo /> };
