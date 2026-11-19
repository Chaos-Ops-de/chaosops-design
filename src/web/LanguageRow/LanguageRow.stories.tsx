import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LanguageRow } from './LanguageRow';

const meta = {
  title: 'Web/LanguageRow',
  component: LanguageRow,
  args: { label: 'Deutsch', leading: 'DE', selected: false, onClick: () => {} },
} satisfies Meta<typeof LanguageRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Group: Story = {
  render: () => {
    const [v, setV] = useState('de');
    return (
      <div role="radiogroup" style={{ display: 'grid', gap: 10, maxWidth: 320 }}>
        {[['de', 'Deutsch', 'DE'], ['en', 'English', 'EN'], ['fr', 'Français', 'FR']].map(([k, l, c]) => (
          <LanguageRow key={k} label={l!} leading={c} selected={v === k} onClick={() => setV(k!)} />
        ))}
      </div>
    );
  },
};
