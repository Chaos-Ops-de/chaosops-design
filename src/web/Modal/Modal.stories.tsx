import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal, ConfirmModal, AlertModal } from './Modal';

const meta = {
  title: 'Web/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    isOpen: true,
    onClose: () => {},
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    title: 'Hinweis',
    type: 'info',
    children: <p>Das ist eine Beispielnachricht innerhalb des Modals.</p>,
  },
};

export const Success: Story = {
  args: {
    title: 'Erledigt',
    type: 'success',
    children: <p>Die Aktion wurde erfolgreich durchgeführt.</p>,
  },
};

export const Warning: Story = {
  args: {
    title: 'Achtung',
    type: 'warning',
    children: <p>Bitte überprüfe deine Eingaben.</p>,
  },
};

export const Error: Story = {
  args: {
    title: 'Fehler',
    type: 'error',
    children: <p>Etwas ist schiefgelaufen.</p>,
  },
};

export const Confirm: StoryObj<typeof ConfirmModal> = {
  render: () => (
    <ConfirmModal
      isOpen
      onClose={() => {}}
      onConfirm={() => {}}
      title="Veranstaltung löschen?"
      message="Diese Aktion kann nicht rückgängig gemacht werden."
    />
  ),
};

export const Alert: StoryObj<typeof AlertModal> = {
  render: () => (
    <AlertModal
      isOpen
      onClose={() => {}}
      title="Nicht möglich"
      message="Diese Veranstaltung hat bereits aktive Anmeldungen."
    />
  ),
};
