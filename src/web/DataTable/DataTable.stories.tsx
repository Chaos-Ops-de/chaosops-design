import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pencil, Trash2 } from 'lucide-react';
import { DataTable, type DataTableColumn } from './DataTable';
import type { SortState } from './dataTableLogic';
import { Button } from '../Button';

interface Shift {
  id: string;
  name: string;
  role: string;
  area: string | null;
  hours: number | null;
  cost: number | null;
  status: 'confirmed' | 'open' | 'cancelled';
}

const meta = {
  title: 'Web/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
  args: { columns: [], rows: [], getRowId: () => '' },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Story-only status pill (the package Badge ships separately); the label always accompanies the color. */
function Badge({ tone, children }: { tone: Shift['status']; children: ReactNode }) {
  const color = tone === 'confirmed' ? 'green' : tone === 'open' ? 'amber' : 'danger';
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.1rem 0.55rem',
        borderRadius: 999,
        border: `1.5px solid var(--chaos-${color})`,
        background: `var(--chaos-${color}-tint)`,
        color: `var(--chaos-${color}-ink)`,
        fontSize: '0.75rem',
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

const shifts: Shift[] = [
  { id: 's1', name: 'Anna Berger', role: 'Einlass', area: 'Haupteingang', hours: 6.5, cost: 117, status: 'confirmed' },
  { id: 's2', name: 'Murat Yilmaz', role: 'Technik', area: 'Bühne', hours: 9, cost: 252, status: 'confirmed' },
  { id: 's3', name: 'Lea Schneider', role: 'Catering', area: 'Halle 2', hours: 4, cost: 64, status: 'open' },
  { id: 's4', name: 'Jonas Weber', role: 'Sicherheit', area: 'Halle 10', hours: 8, cost: 184, status: 'cancelled' },
  { id: 's5', name: 'Sofia Rossi', role: 'Kasse', area: null, hours: null, cost: null, status: 'open' },
];

const statusLabel: Record<Shift['status'], string> = { confirmed: 'Bestätigt', open: 'Offen', cancelled: 'Abgesagt' };

const columns: Array<DataTableColumn<Shift>> = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Rolle', sortable: true },
  { key: 'area', header: 'Bereich', sortable: true, cardLabel: true },
  { key: 'hours', header: 'Stunden', numeric: true, sortable: true, cardLabel: true },
  { key: 'cost', header: 'Kosten', numeric: true, sortable: true, render: (r) => (r.cost === null ? null : euro.format(r.cost)) },
  { key: 'status', header: 'Status', render: (r) => <Badge tone={r.status}>{statusLabel[r.status]}</Badge> },
];

const baseProps = { columns, rows: shifts, getRowId: (r: Shift) => r.id, 'aria-label': 'Schichtplan' };

export const Default: Story = {
  render: () => <DataTable {...baseProps} />,
};

/** Compact 40, default 48, comfortable 56: one toggle in an app, three tables here. */
export const Densities: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {(['compact', 'default', 'comfortable'] as const).map((density) => (
        <DataTable key={density} {...baseProps} density={density} caption={density} />
      ))}
    </div>
  ),
};

/** Click a header: ascending, descending, then back to unsorted. Only the sorted column shows an arrow. */
export const Sortable: Story = {
  render: () => {
    const [sort, setSort] = useState<SortState | null>({ key: 'hours', direction: 'desc' });
    return <DataTable {...baseProps} sort={sort} onSortChange={setSort} />;
  },
};

interface Money { id: string; item: string; net: number; tax: number; gross: number; paid: number; open: number; share: number }

const moneyRows: Money[] = [
  { id: 'm1', item: 'Bühnentechnik', net: 12480.5, tax: 2371.3, gross: 14851.8, paid: 7000, open: 7851.8, share: 0.42 },
  { id: 'm2', item: 'Catering', net: 3210, tax: 224.7, gross: 3434.7, paid: 3434.7, open: 0, share: 0.1 },
  { id: 'm3', item: 'Sicherheitsdienst', net: 8890.25, tax: 1689.15, gross: 10579.4, paid: 0, open: 10579.4, share: 0.3 },
  { id: 'm4', item: 'Miete Halle 10', net: 5000, tax: 950, gross: 5950, paid: 2975, open: 2975, share: 0.18 },
];

const fmt = (n: number) => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Wide table: every figure right-aligned in tabular figures, so the digits line up like a receipt. */
export const NumbersRightAligned: Story = {
  render: () => (
    <DataTable<Money>
      aria-label="Kostenübersicht"
      getRowId={(r) => r.id}
      rows={moneyRows}
      columns={[
        { key: 'item', header: 'Posten' },
        { key: 'net', header: 'Netto', numeric: true, render: (r) => fmt(r.net) },
        { key: 'tax', header: 'USt.', numeric: true, render: (r) => fmt(r.tax) },
        { key: 'gross', header: 'Brutto', numeric: true, render: (r) => fmt(r.gross) },
        { key: 'paid', header: 'Bezahlt', numeric: true, render: (r) => fmt(r.paid) },
        { key: 'open', header: 'Offen', numeric: true, render: (r) => fmt(r.open) },
        { key: 'share', header: 'Anteil', numeric: true, render: (r) => `${Math.round(r.share * 100)} %` },
      ]}
    />
  ),
};

interface Wide { id: string; name: string; [k: string]: string }

const wideRows: Wide[] = Array.from({ length: 6 }, (_, i) => ({
  id: `w${i}`,
  name: `Schicht ${i + 1}`,
  mo: '08:00 - 16:00', di: '10:00 - 18:00', mi: 'frei', do: '08:00 - 16:00', fr: '12:00 - 20:00', sa: '14:00 - 22:00', so: 'frei',
}));

/** Narrow container, wide content: the first column stays in view while the rest scrolls sideways. Click into the table and use the arrow keys. */
export const PinnedFirstColumn: Story = {
  render: () => (
    <div style={{ maxWidth: 520 }}>
      <DataTable<Wide>
        aria-label="Wochenplan"
        getRowId={(r) => r.id}
        rows={wideRows}
        maxHeight={260}
        columns={[
          { key: 'name', header: 'Schicht', pin: true, width: 140 },
          ...['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so'].map((d) => ({ key: d, header: d.toUpperCase(), width: 140 })),
        ]}
      />
    </div>
  ),
};

/** Missing values show an en dash, never a blank. A literal 0 is a value and stays 0. */
export const EmptyCells: Story = {
  render: () => <DataTable {...baseProps} rows={[...shifts.slice(0, 2), { id: 'x', name: 'Neu', role: '', area: null, hours: 0, cost: null, status: 'open' }]} />,
};

const longRows: Shift[] = [
  { id: 'l1', name: 'Dr. Maximiliane Freifrau von Hohenzollern-Sigmaringen-Lindenau', role: 'Einlass', area: 'Haupteingang und Nebeneingang Ost, Zugang über den Innenhof', hours: 6.5, cost: 117, status: 'confirmed' },
  { id: 'l2', name: 'Murat Yilmaz', role: 'Technik', area: 'Bühne', hours: 9, cost: 252, status: 'confirmed' },
];

/** Long text clips with an ellipsis and shows in full in the native tooltip. Numbers never clip. */
export const LongTextTruncation: Story = {
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <DataTable<Shift>
        aria-label="Lange Texte"
        getRowId={(r) => r.id}
        rows={longRows}
        columns={[
          { key: 'name', header: 'Name', truncate: true, width: 220 },
          { key: 'area', header: 'Bereich', truncate: true },
          { key: 'cost', header: 'Kosten', numeric: true, truncate: true, render: (r) => euro.format(r.cost ?? 0) },
        ]}
      />
    </div>
  ),
};

/** Hover or tab into a row to reveal its actions. On touch screens they are always shown. */
export const RowActionsOnHover: Story = {
  render: () => (
    <DataTable
      {...baseProps}
      rowActions={(r) => (
        <>
          <Button variant="ghost" size="sm" icon={<Pencil size={16} aria-hidden="true" />} aria-label={`${r.name} bearbeiten`} />
          <Button variant="ghost" size="sm" icon={<Trash2 size={16} aria-hidden="true" />} aria-label={`${r.name} löschen`} />
        </>
      )}
    />
  ),
};

/** Below 640 px of the table's own width, rows turn into cards and sorting moves above them. */
export const PhoneCards: Story = {
  render: () => {
    const [sort, setSort] = useState<SortState | null>(null);
    const [clicked, setClicked] = useState<string>('');
    return (
      <div style={{ width: 375 }}>
        <DataTable
          {...baseProps}
          sort={sort}
          onSortChange={setSort}
          onRowClick={(r) => setClicked(r.name)}
        />
        <p style={{ color: 'var(--chaos-ink-muted)', fontSize: 13 }}>{clicked ? `Angetippt: ${clicked}` : 'Tippe eine Karte an.'}</p>
      </div>
    );
  },
};

export const Loading: Story = {
  render: () => <DataTable {...baseProps} rows={[]} loading loadingRows={4} />,
};

export const Empty: Story = {
  render: () => <DataTable {...baseProps} rows={[]} />,
};
