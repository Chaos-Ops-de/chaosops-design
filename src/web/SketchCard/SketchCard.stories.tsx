import type { Meta, StoryObj } from '@storybook/react-vite';
import { SketchCard, type SketchTone } from './SketchCard';

const meta = {
  title: 'Web/SketchCard',
  component: SketchCard,
  args: { children: 'Handgezeichnete Karte' },
  decorators: [(Story) => <div style={{ padding: 16, maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof SketchCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const TONES: SketchTone[] = ['card', 'mint', 'lime', 'yellow'];

export const Default: Story = {};
export const WithHeader: Story = { args: { header: <strong>November</strong> } };
export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {TONES.map((t) => <SketchCard key={t} tone={t}>{t}</SketchCard>)}
    </div>
  ),
};
