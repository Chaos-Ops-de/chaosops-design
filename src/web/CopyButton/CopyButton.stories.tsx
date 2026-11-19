import type { Meta, StoryObj } from '@storybook/react-vite';
import { CopyButton } from './CopyButton';

const meta = {
  title: 'Web/CopyButton',
  component: CopyButton,
  args: { value: 'https://chaos-ops.de/e/sommerfest-2026' },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click to see the icon swap to a check for about 1.5 s. */
export const IconOnly: Story = {};

export const WithLabel: Story = {
  args: { label: 'Link kopieren' },
};

export const Small: Story = {
  args: { size: 'sm', label: 'Kopieren' },
};

/** Both the clipboard and the textarea fallback refuse, so the button shows the failure state. */
export const Failure: Story = {
  args: {
    label: 'Link kopieren',
    deps: {
      clipboard: { writeText: () => Promise.reject(new Error('denied')) },
      document: null,
    },
  },
};

export const Disabled: Story = {
  args: { label: 'Link kopieren', disabled: true },
};

export const NextToText: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'monospace', color: 'var(--chaos-ink)' }}>
      <code>{args.value}</code>
      <CopyButton {...args} />
    </div>
  ),
};
