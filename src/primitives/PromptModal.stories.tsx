import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { View } from 'react-native';
import { PromptModal } from './PromptModal';
import { PillButton } from './PillButton';

const meta = {
  title: 'Primitives/PromptModal',
  component: PromptModal,
  args: {
    visible: true, title: 'Zone umbenennen', placeholder: 'Name', confirmLabel: 'Speichern',
    onCancel: () => {}, onSubmit: async () => {},
  },
} satisfies Meta<typeof PromptModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <View style={{ padding: 24 }}>
        <PillButton label="Öffnen" onPress={() => setOpen(true)} />
        <PromptModal
          {...args}
          visible={open}
          onCancel={() => setOpen(false)}
          onSubmit={async (v) => {
            await new Promise((r) => setTimeout(r, 400));
            if (v.toLowerCase() === 'fehler') throw new Error('Name bereits vergeben.');
            setOpen(false);
          }}
        />
      </View>
    );
  },
};
