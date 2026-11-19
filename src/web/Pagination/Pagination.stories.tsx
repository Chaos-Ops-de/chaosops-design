import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination, PaginationSummary, LoadMoreButton } from './Pagination';

const meta = {
  title: 'Web/Pagination',
  component: Pagination,
  parameters: { layout: 'padded' },
  args: { page: 1, totalPages: 1, onPageChange: () => {} },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled({ total, initial = 1, siblings }: { total: number; initial?: number; siblings?: number }) {
  const [page, setPage] = useState(initial);
  return (
    <div style={{ color: 'var(--chaos-ink)' }}>
      <Pagination page={page} totalPages={total} onPageChange={setPage} siblings={siblings} />
      <p style={{ textAlign: 'center', color: 'var(--chaos-ink-muted)', fontSize: 13 }}>Seite {page} von {total}</p>
    </div>
  );
}

/** 500 pages stay seven links wide: first, gap, current with neighbours, gap, last. */
export const Numbered: Story = { render: () => <Controlled total={500} initial={250} /> };

export const FewPages: Story = { render: () => <Controlled total={5} /> };

/** `siblings={0}` keeps the control narrow enough for a phone. */
export const NarrowSiblings: Story = {
  globals: { viewport: { value: 'phone', isRotated: false } },
  render: () => <Controlled total={40} initial={12} siblings={0} />,
};

export const Summary: Story = {
  render: () => {
    const [page, setPage] = useState(2);
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <PaginationSummary page={page} pageSize={25} total={101} />
        <Pagination page={page} totalPages={5} onPageChange={setPage} />
      </div>
    );
  },
};

/** Idle, loading (width stays put) and done. */
export const LoadMore: Story = {
  render: () => {
    const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
    const [count, setCount] = useState(10);
    const load = () => {
      setState('loading');
      setTimeout(() => {
        setCount((c) => c + 10);
        setState(count + 10 >= 30 ? 'done' : 'idle');
      }, 700);
    };
    return (
      <div style={{ color: 'var(--chaos-ink)', display: 'grid', gap: 16, maxWidth: 360 }}>
        <p style={{ margin: 0 }}>{count} Einträge geladen</p>
        <LoadMoreButton onLoadMore={load} loading={state === 'loading'} done={state === 'done'} />
      </div>
    );
  },
};
