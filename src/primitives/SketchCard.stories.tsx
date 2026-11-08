import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SketchCard } from './SketchCard';
import { Text } from './Text';

const meta = { title: 'Primitives/SketchCard', component: SketchCard } satisfies Meta<typeof SketchCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <View style={{ width: 300, gap: 16 }}>
      {(['card', 'mint', 'lime', 'yellow'] as const).map((t) => (
        <SketchCard key={t} tone={t}><Text variant="bodyBold">{t}</Text></SketchCard>
      ))}
      <SketchCard header={<Text variant="bodyBold">Header band</Text>}><Text>Body</Text></SketchCard>
    </View>
  ),
};
