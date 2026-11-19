import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';
import { Wizard } from './Wizard';
import { FormField } from '../FormField';
import { Input } from '../Input';
import { Button } from '../Button';
import { createLocalStorageAdapter } from '../../theme/storage';

const STEPS = [
  { id: 'who', label: 'Person' },
  { id: 'where', label: 'Adresse' },
  { id: 'pay', label: 'Zahlung' },
  { id: 'review', label: 'Prüfen' },
];

const meta = {
  title: 'Web/Stepper',
  component: Stepper,
  parameters: { layout: 'padded' },
  args: { steps: STEPS, current: 1 },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: a segmented bar with the step named above it. */
export const Bar: Story = { args: { variant: 'bar' } };

export const Dots: Story = { args: { variant: 'dots', current: 2 } };

/** Every step named; completed steps show a check. */
export const Labels: Story = { args: { variant: 'labels', current: 2 } };

export const Interactive: Story = {
  render: (args) => {
    const [current, setCurrent] = useState(0);
    return (
      <div style={{ display: 'grid', gap: 16, maxWidth: 520 }}>
        <Stepper {...args} current={current} variant="labels" />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outline" onClick={() => setCurrent((c) => Math.max(0, c - 1))}>Zurück</Button>
          <Button onClick={() => setCurrent((c) => Math.min(STEPS.length - 1, c + 1))}>Weiter</Button>
        </div>
      </div>
    );
  },
};

interface SignupValues {
  name: string;
  email: string;
}

const emailOk = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

const signupSteps = [
  {
    id: 'name',
    label: 'Name',
    validate: (v: SignupValues) => (v.name.trim() ? true : 'Bitte einen Namen eingeben.'),
    render: ({ values, setValues }: { values: SignupValues; setValues: (n: (p: SignupValues) => SignupValues) => void }) => (
      <FormField label="Dein Name">
        <Input value={values.name} onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))} autoComplete="name" />
      </FormField>
    ),
  },
  {
    id: 'email',
    label: 'E-Mail',
    validate: (v: SignupValues) => (emailOk(v.email) ? true : 'Bitte eine gültige E-Mail-Adresse eingeben.'),
    render: ({ values, setValues }: { values: SignupValues; setValues: (n: (p: SignupValues) => SignupValues) => void }) => (
      <FormField label="E-Mail">
        <Input type="email" value={values.email} onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))} autoComplete="email" />
      </FormField>
    ),
  },
  {
    id: 'review',
    label: 'Prüfen',
    render: ({ values }: { values: SignupValues }) => (
      <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 16px' }}>
        <dt style={{ color: 'var(--chaos-ink-muted)' }}>Name</dt><dd style={{ margin: 0 }}>{values.name}</dd>
        <dt style={{ color: 'var(--chaos-ink-muted)' }}>E-Mail</dt><dd style={{ margin: 0 }}>{values.email}</dd>
      </dl>
    ),
  },
];

/** "Weiter" stays disabled while the step is invalid, and the message says why. Back keeps the data. */
export const WizardWithValidation: Story = {
  render: () => {
    const [done, setDone] = useState<SignupValues | null>(null);
    return (
      <div style={{ maxWidth: 480 }}>
        {done ? (
          <p style={{ color: 'var(--chaos-ink)' }}>Fertig: {done.name} ({done.email})</p>
        ) : (
          <Wizard<SignupValues>
            steps={signupSteps}
            initialValues={{ name: '', email: '' }}
            onFinish={setDone}
          />
        )}
      </div>
    );
  },
};

const storage = createLocalStorageAdapter();

/** Reload the page: step and values come back from `storage` under `persistKey`. */
export const WizardPersisted: Story = {
  render: () => (
    <div style={{ maxWidth: 480, display: 'grid', gap: 12 }}>
      <Wizard<SignupValues>
        steps={signupSteps}
        initialValues={{ name: '', email: '' }}
        persistKey="chaos-story-wizard"
        storage={storage}
        variant="dots"
      />
      <Button variant="ghost" size="sm" onClick={() => { void storage.setItem('chaos-story-wizard', ''); location.reload(); }}>
        Gespeicherten Stand löschen
      </Button>
    </div>
  ),
};
