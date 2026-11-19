import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from './DatePicker';
import { DateRangePicker } from './DateRangePicker';
import type { DateRange, ISODate } from './datePickerLogic';

// A fixed "today" keeps the stories (and screenshots) stable.
const TODAY: ISODate = '2026-11-18';

const meta = {
  title: 'Web/DatePicker',
  component: DatePicker,
  parameters: { layout: 'padded' },
  args: { value: null, onChange: () => {}, today: TODAY },
  decorators: [(Story) => <div style={{ minHeight: 420 }}><Story /></div>],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleDate: Story = {
  render: (args) => {
    const [value, setValue] = useState<ISODate | null>('2026-11-24');
    return <DatePicker {...args} value={value} onChange={setValue} aria-label="Veranstaltungstag" />;
  },
};

/** A range with the two-month panel and the preset list. */
export const DefaultRange: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | null>({ start: '2026-11-10', end: '2026-11-16' });
    return <DateRangePicker value={value} onChange={setValue} today={TODAY} presets={false} />;
  },
};

export const WithPresets: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | null>(null);
    return <DateRangePicker value={value} onChange={setValue} today={TODAY} />;
  },
};

/** Start in November, end in December: the range paints across both months. */
export const CrossMonthRange: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | null>({ start: '2026-11-26', end: '2026-12-04' });
    return <DateRangePicker value={value} onChange={setValue} today={TODAY} presets={false} />;
  },
};

/** Days before the 10th and after the 25th are dimmed and cannot be chosen. */
export const MinMax: Story = {
  render: () => {
    const [value, setValue] = useState<ISODate | null>(null);
    return <DatePicker value={value} onChange={setValue} today={TODAY} min="2026-11-10" max="2026-11-25" aria-label="Anreisetag" />;
  },
};

/**
 * Open the picker with the keyboard: arrows move a day, Page Up and Page Down
 * a month, Shift with those a year, Home and End the start and end of the week,
 * Enter picks, Escape closes and returns focus to the button.
 */
export const KeyboardOnly: Story = {
  render: () => {
    const [value, setValue] = useState<ISODate | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ margin: 0, maxWidth: 420, color: 'var(--chaos-ink-muted)', fontSize: 14 }}>
          Tab to the field, press Enter, then use the arrow keys. Escape closes it.
        </p>
        <DatePicker value={value} onChange={setValue} today={TODAY} />
      </div>
    );
  },
};

/** On a phone the panel is a full-width sheet with a scrolling column of months and a confirm button. */
export const Mobile: Story = {
  globals: { viewport: { value: 'phone', isRotated: false } },
  render: () => {
    const [value, setValue] = useState<DateRange | null>(null);
    return <DateRangePicker value={value} onChange={setValue} today={TODAY} />;
  },
};

/** Type or paste dates into Von and Bis: 18.11.2026, 18/11/26, 18112026 and 2026-11-18 all work. A date that does not exist marks the field invalid. */
export const TypedDates: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | null>(null);
    return <DateRangePicker value={value} onChange={setValue} today={TODAY} presets={false} />;
  },
};

/** With a range chosen, drag its first or last day to move that edge. Dragging past the other edge swaps them. Apply with "Übernehmen". */
export const DragEdges: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | null>({ start: '2026-11-10', end: '2026-11-16' });
    return <DateRangePicker value={value} onChange={setValue} today={TODAY} presets={false} />;
  },
};
