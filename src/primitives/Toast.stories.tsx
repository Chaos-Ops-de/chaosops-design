import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider, useToast } from './Toast';
import { PillButton } from './PillButton';
import { Text } from './Text';

function Demo() {
  const toast = useToast();
  return (
    <View style={{ padding: 24, gap: 12, maxWidth: 360 }}>
      <Text muted>Toasts erscheinen oben, Fehler bleiben, bis sie geschlossen werden. Wischen oder tippen schließt sie.</Text>
      <PillButton label="Erfolg" onPress={() => toast.success('Änderungen gespeichert.')} />
      <PillButton label="Info" variant="outline" onPress={() => toast.info('Neue Version verfügbar.')} />
      <PillButton label="Warnung" variant="outline" onPress={() => toast.warning('Speicher fast voll.')} />
      <PillButton label="Fehler" variant="danger" onPress={() => toast.error('Upload fehlgeschlagen.')} />
      <PillButton
        label="Mit Rückgängig"
        variant="outline"
        onPress={() => toast.success('Eintrag gelöscht.', { action: { label: 'Rückgängig', onClick: () => toast.info('Wiederhergestellt.') } })}
      />
    </View>
  );
}

function Stack() {
  const toast = useToast();
  return (
    <View style={{ padding: 24, gap: 12, maxWidth: 360 }}>
      <PillButton
        label="Vier Toasts auf einmal"
        onPress={() => {
          toast.info('Erste Meldung', { duration: 0 });
          toast.success('Zweite Meldung', { duration: 0 });
          toast.warning('Dritte Meldung', { duration: 0 });
          toast.error('Vierte wartet in der Warteschlange');
        }}
      />
      <Text muted>Drei sind sichtbar; die vierte rückt nach, sobald ein Platz frei wird.</Text>
    </View>
  );
}

const meta = {
  title: 'Primitives/Toast',
  component: ToastProvider,
  args: { children: null },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Types: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
};

export const StackOfFour: Story = {
  render: () => (
    <ToastProvider maxVisible={3}>
      <Stack />
    </ToastProvider>
  ),
};
