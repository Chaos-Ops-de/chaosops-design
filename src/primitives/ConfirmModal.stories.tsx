import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { View } from 'react-native';
import { ConfirmModal } from './ConfirmModal';
import { PillButton } from './PillButton';

const meta = {
  title: 'Primitives/ConfirmModal',
  component: ConfirmModal,
  args: { visible: true, title: 'Event löschen?', message: 'Das kann nicht rückgängig gemacht werden.', confirmLabel: 'Löschen', onCancel: () => {}, onConfirm: () => {} },
} satisfies Meta<typeof ConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <View style={{ padding: 24 }}>
        <PillButton label="Öffnen" onPress={() => setOpen(true)} />
        <ConfirmModal {...args} tone="default" visible={open} onCancel={() => setOpen(false)} onConfirm={() => setOpen(false)} />
      </View>
    );
  },
};

export const Danger: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <View style={{ padding: 24 }}>
        <PillButton label="Löschen…" variant="danger" onPress={() => setOpen(true)} />
        <ConfirmModal {...args} tone="danger" visible={open} onCancel={() => setOpen(false)} onConfirm={() => setOpen(false)} />
      </View>
    );
  },
};
