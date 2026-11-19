import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropzone, RejectedList } from './Dropzone';
import { UploadList, type UploadItemData } from './UploadList';
import { useUploads, type UploadFn } from './useUploads';

const meta = {
  title: 'Web/Dropzone',
  component: Dropzone,
  parameters: { layout: 'padded' },
  args: { onFiles: () => {} },
  decorators: [(Story) => <div style={{ maxWidth: 520 }}><Story /></div>],
} satisfies Meta<typeof Dropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: { multiple: true, accept: 'image/*,.pdf', maxSize: 5 * 1024 * 1024 },
};

/** Dragging a file over the zone: solid colored border, glow, and new copy. Forced here with `dragging`. */
export const DragOver: Story = {
  args: { multiple: true, dragging: true },
};

/** A drop that was turned away says why, per file. Shown with the list the zone renders after a drop. */
export const Rejected: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Dropzone {...args} accept=".pdf" maxSize={2 * 1024 * 1024} />
      <RejectedList
        maxSize={2 * 1024 * 1024}
        rejected={[
          { file: { name: 'bilder.zip', size: 800_000, type: 'application/zip' }, reason: 'type' },
          { file: { name: 'handbuch-komplett.pdf', size: 9_400_000, type: 'application/pdf' }, reason: 'size' },
        ]}
      />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

const FILES: Array<Pick<UploadItemData, 'name' | 'size' | 'type'>> = [
  { name: 'Ablaufplan.pdf', size: 482_000, type: 'application/pdf' },
  { name: 'Buehne-Foto.jpg', size: 3_200_000, type: 'image/jpeg' },
  { name: 'Lageplan.png', size: 1_900_000, type: 'image/png' },
  { name: 'Crew-Liste.xlsx', size: 96_000, type: 'application/vnd.ms-excel' },
  { name: 'Technik-Rider.pdf', size: 740_000, type: 'application/pdf' },
  { name: 'Notizen.txt', size: 4_100, type: 'text/plain' },
  { name: 'Sponsoren.docx', size: 210_000, type: 'application/msword' },
  { name: 'Logo.svg', size: 22_000, type: 'image/svg+xml' },
  { name: 'Backup.zip', size: 12_000_000, type: 'application/zip' },
  { name: 'Programm.pdf', size: 1_100_000, type: 'application/pdf' },
];

const FAILS_AT = 55;

/** Ten files upload on their own: each has its own progress, and the one that fails (index 3) can be retried without blocking the rest. */
export const UploadingMany: Story = {
  render: () => {
    const [items, setItems] = useState<UploadItemData[]>(() =>
      FILES.map((f, i) => ({ id: `f${i}`, ...f, status: 'uploading', progress: i * 4 })),
    );
    const [retried, setRetried] = useState<string[]>([]);

    useEffect(() => {
      const timer = setInterval(() => {
        setItems((prev) => prev.map((it, i) => {
          if (it.status !== 'uploading') return it;
          const next = (it.progress ?? 0) + 3 + (i % 4);
          if (i === 3 && next >= FAILS_AT && !retried.includes(it.id)) {
            return { ...it, status: 'error', progress: FAILS_AT, error: 'Verbindung unterbrochen', remainingMs: null };
          }
          if (next >= 100) return { ...it, status: 'done', progress: 100, remainingMs: null };
          return { ...it, progress: next, remainingMs: Math.round(((100 - next) / (3 + (i % 4))) * 600) };
        }));
      }, 600);
      return () => clearInterval(timer);
    }, [retried]);

    return (
      <UploadList
        items={items}
        onRetry={(id) => {
          setRetried((r) => [...r, id]);
          setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: 'uploading', error: undefined } : it)));
        }}
        onRemove={(id) => setItems((prev) => prev.filter((it) => it.id !== id))}
      />
    );
  },
};

/** An image shows its thumbnail; a file without a preview gets an icon for its kind. */
export const WithPreview: Story = {
  render: () => (
    <UploadList
      items={[
        {
          id: 'a',
          name: 'Buehne-Foto.jpg',
          size: 3_200_000,
          type: 'image/jpeg',
          status: 'done',
          previewUrl:
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='%23fbbf24'/><circle cx='40' cy='34' r='14' fill='%23181818'/><rect x='14' y='54' width='52' height='12' rx='6' fill='%23181818'/></svg>",
        },
        { id: 'b', name: 'Ablaufplan.pdf', size: 482_000, type: 'application/pdf', status: 'uploading', progress: 40, remainingMs: 8000 },
        { id: 'c', name: 'Lageplan.png', size: 1_900_000, type: 'image/png', status: 'queued' },
      ]}
      onRemove={() => {}}
    />
  ),
};

// A pretend server: reports progress every 200 ms, and refuses any file whose name contains "fail".
const fakeUpload: UploadFn = (file, { onProgress, signal }) =>
  new Promise<void>((resolve, reject) => {
    let percent = 0;
    const timer = setInterval(() => {
      percent += 8 + Math.round(Math.random() * 10);
      if (file.name.includes('fail') && percent >= 50) {
        clearInterval(timer);
        reject(new Error('Server hat die Datei abgelehnt'));
        return;
      }
      onProgress(Math.min(100, percent));
      if (percent >= 100) {
        clearInterval(timer);
        resolve();
      }
    }, 200);
    signal.addEventListener('abort', () => {
      clearInterval(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

/**
 * The whole flow with `useUploads`: drop files, they upload three at a time with
 * real progress and time left. Name a file with "fail" in it to see a failure with a
 * retry, while the rest carry on. Swap `fakeUpload` for `xhrUpload({ url })` in an app.
 */
export const WithUploadHook: Story = {
  render: (args) => {
    const { items, add, retry, remove, counts } = useUploads({ upload: fakeUpload, maxConcurrent: 3 });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Dropzone {...args} multiple onFiles={add} />
        <UploadList items={items} onRetry={retry} onRemove={remove} />
        {items.length > 0 && (
          <p style={{ margin: 0, fontSize: 13, color: 'var(--chaos-ink-muted)' }}>
            {counts.uploading} laufen · {counts.queued} warten · {counts.done} fertig · {counts.error} fehlgeschlagen
          </p>
        )}
      </div>
    );
  },
};
