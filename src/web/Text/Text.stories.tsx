import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text, type TextVariant } from './Text';

const meta = {
  title: 'Web/Text',
  component: Text,
  args: { children: 'Der Gremlin hat wieder gewütet' },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS: TextVariant[] = ['display', 'body', 'bodyMedium', 'bodySemiBold', 'bodyBold'];

export const Default: Story = {};
export const Muted: Story = { args: { muted: true } };
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      {VARIANTS.map((v) => <Text key={v} variant={v} size="lg">{v}</Text>)}
    </div>
  ),
};
