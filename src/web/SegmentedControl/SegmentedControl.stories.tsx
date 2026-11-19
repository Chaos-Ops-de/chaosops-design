import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayoutGrid, List } from 'lucide-react';
import { SegmentedControl } from './SegmentedControl';

const meta = { title: 'Web/SegmentedControl', component: SegmentedControl } satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [view, setView] = useState('week');
    return (
      <SegmentedControl
        aria-label="Zeitraum"
        value={view}
        onChange={setView}
        options={[{ value: 'day', label: 'Tag' }, { value: 'week', label: 'Woche' }, { value: 'month', label: 'Monat' }]}
      />
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const [view, setView] = useState('list');
    return (
      <SegmentedControl
        aria-label="Ansicht"
        size="sm"
        value={view}
        onChange={setView}
        options={[
          { value: 'list', label: 'Liste', icon: <List size={14} /> },
          { value: 'grid', label: 'Raster', icon: <LayoutGrid size={14} /> },
        ]}
      />
    );
  },
};
