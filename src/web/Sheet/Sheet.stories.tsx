import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sheet } from './Sheet';

const meta = {
  title: 'Web/Sheet',
  component: Sheet,
  parameters: {
    layout: 'fullscreen',
    // Below 640px this renders as a draggable bottom sheet instead of a
    // centered dialog — resize the canvas to see the mobile variant.
  },
  args: {
    isOpen: true,
    onClose: () => {},
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Einstellungen',
    children: <p>Inhalt des Sheets. Unter 640px Breite zieht das Sheet vom unteren Bildschirmrand hoch.</p>,
  },
};

export const NoTitle: Story = {
  args: {
    ariaLabel: 'Details',
    children: <p>Ein Sheet ohne sichtbaren Titel, aber mit erreichbarem aria-label.</p>,
  },
};

export const Unpadded: Story = {
  args: {
    title: 'Vollflächig',
    padded: false,
    children: (
      <div style={{ background: 'var(--chaos-amber, #fbbf24)', padding: '2rem', textAlign: 'center' }}>
        Eigenes, randloses Layout (padded=false)
      </div>
    ),
  },
};
