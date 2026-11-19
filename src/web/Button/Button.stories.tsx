import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Web/Button',
  component: Button,
  args: { children: 'Speichern' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Accent: Story = { args: { variant: 'accent' } };
export const Success: Story = { args: { variant: 'success' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Löschen' } };
/** Destructive buttons name the action ("Projekt löschen"), not a generic "OK". */
export const Destructive: Story = { args: { variant: 'danger', children: 'Projekt löschen' } };
export const DangerOutline: Story = { args: { variant: 'danger-outline', children: 'Löschen' } };
export const Outline: Story = { args: { variant: 'outline', children: 'Abbrechen' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Mehr' } };
/** Inline text action, e.g. "Passwort vergessen?". */
export const Link: Story = { args: { variant: 'link', children: 'Mehr erfahren' } };
export const Loading: Story = { args: { loading: true, children: 'Wird erstellt…' } };
export const Disabled: Story = { args: { disabled: true } };
/** A disabled button says why: the reason is announced and shown as a tooltip. */
export const DisabledWithReason: Story = {
  args: { disabled: true, children: 'Workspace erstellen', disabledReason: 'Gib zuerst deinem Workspace einen Namen.' },
};
export const Block: Story = { args: { block: true, size: 'lg' } };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button size="xs">Kompakt</Button>
      <Button size="sm">Klein</Button>
      <Button>Mittel</Button>
      <Button size="lg">Groß</Button>
    </div>
  ),
};

/** Loading swaps the label for a spinner but keeps the width, so nothing around the button moves. */
export const LoadingKeepsWidth: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button variant="accent">Workspace erstellen</Button>
      <Button variant="accent" loading>Workspace erstellen</Button>
    </div>
  ),
};

/** Tab to the button (or focus it) to see the 3 px focus ring. */
export const FocusVisible: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button autoFocus>Fokussiert</Button>
      <Button variant="outline">Tab zum Weiterspringen</Button>
    </div>
  ),
};
