import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SketchCard } from './SketchCard';
import { Text } from './Text';
import { WEEKDAY_LABELS, addMonths, buildMonthGrid, isSameDay, toDateKey } from './calendarMath';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface CalendarProps {
  /** Any date inside the month to show. */
  month: Date;
  onMonthChange: (month: Date) => void;
  selected?: Date | null;
  onSelect: (date: Date) => void;
  /** Days that carry something (events, shifts) — shown with a dot. */
  marked?: Date[];
  /** Defaults to now; injectable for stories/tests. */
  today?: Date;
  locale?: string;
  style?: StyleProp<ViewStyle>;
}

/** Month grid (Monday-first): mint header band with weekday letters, selected day = yellow outlined circle. */
export const Calendar: React.FC<CalendarProps> = ({
  month, onMonthChange, selected, onSelect, marked = [], today = new Date(), locale = 'de-DE', style,
}) => {
  const { palette } = useTheme();
  const cells = useMemo(() => buildMonthGrid(month), [month]);
  const markedKeys = useMemo(() => new Set(marked.map(toDateKey)), [marked]);
  const title = month.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  const nav = (label: string, glyph: string, delta: number) => (
    <Pressable accessibilityRole="button" accessibilityLabel={label} hitSlop={8} onPress={() => onMonthChange(addMonths(month, delta))}>
      <Text variant="bodyBold" size="lg">{glyph}</Text>
    </Pressable>
  );

  const header = (
    <View>
      <View style={styles.title}>
        {nav('Vorheriger Monat', '‹', -1)}
        <Text variant="bodySemiBold" size="sm" accessibilityRole="header">{title}</Text>
        {nav('Nächster Monat', '›', 1)}
      </View>
      <View style={styles.week}>
        {WEEKDAY_LABELS.map((w, i) => (
          <Text key={i} variant="bodyBold" size="xs" style={styles.cell}>{w}</Text>
        ))}
      </View>
    </View>
  );

  return (
    <SketchCard header={header} headerTone="mint" padding={spacing.sm} style={style}>
      {weeks.map((week) => (
        <View key={toDateKey(week[0]!.date)} style={styles.week}>
          {week.map(({ date, inMonth }) => {
            const isSel = !!selected && isSameDay(date, selected);
            const isToday = isSameDay(date, today);
            return (
              <Pressable
                key={toDateKey(date)}
                accessibilityRole="button"
                accessibilityLabel={date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}
                accessibilityState={{ selected: isSel }}
                onPress={() => onSelect(date)}
                style={[
                  styles.cell, styles.day,
                  isSel && { backgroundColor: palette.amber, borderWidth: 2, borderColor: palette.border },
                  isToday && !isSel && { borderWidth: 2, borderColor: palette.border, borderStyle: 'dashed' },
                ]}
              >
                <Text variant={isSel || isToday ? 'bodyBold' : 'body'} size="sm" muted={!inMonth} style={isSel ? { color: palette.ink } : undefined}>
                  {date.getDate()}
                </Text>
                {markedKeys.has(toDateKey(date)) ? <View style={[styles.dot, { backgroundColor: palette.green }]} /> : null}
              </Pressable>
            );
          })}
        </View>
      ))}
    </SketchCard>
  );
};

const styles = StyleSheet.create({
  title: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xs, marginBottom: spacing.xs },
  week: { flexDirection: 'row' },
  cell: { flex: 1, textAlign: 'center' },
  day: { aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radii.full, margin: 1 },
  dot: { position: 'absolute', bottom: 3, width: 4, height: 4, borderRadius: 2 },
});
