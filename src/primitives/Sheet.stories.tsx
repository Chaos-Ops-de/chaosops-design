import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { View } from 'react-native';
import { Sheet } from './Sheet';
import { PillButton } from './PillButton';
import { Text } from './Text';

const meta = {
  title: 'Primitives/Sheet',
  component: Sheet,
  args: { visible: false, onClose: () => {} },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <View style={{ padding: 24 }}>
        <PillButton label="Sheet öffnen" onPress={() => setOpen(true)} />
        <Sheet {...args} visible={open} onClose={() => setOpen(false)} title="Optionen">
          <Text>Beliebiger Inhalt: Listen, Formulare, Aktionen.</Text>
          <PillButton label="Fertig" onPress={() => setOpen(false)} />
        </Sheet>
      </View>
    );
  },
};
