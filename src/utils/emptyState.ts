export type EmptyStateKind = 'firstRun' | 'noResults' | 'error' | 'filtered';

export interface EmptyStateCopy {
  title: string;
  description: string;
}

/**
 * Default German copy per empty-state kind. Four situations, four messages:
 * a first run is not a failed search, and an error is not a filter that is
 * too strict. Reuse or override per screen.
 */
export const emptyStateCopy: Record<EmptyStateKind, EmptyStateCopy> = {
  firstRun: {
    title: 'Hier ist noch nichts los',
    description: 'Leg den ersten Eintrag an, dann füllt sich diese Seite von selbst.',
  },
  noResults: {
    title: 'Nichts gefunden',
    description: 'Zu deiner Suche gibt es keine Treffer. Probier es mit einem anderen Begriff.',
  },
  error: {
    title: 'Das hat nicht geklappt',
    description: 'Beim Laden ist etwas schiefgelaufen. Versuch es gleich noch einmal.',
  },
  filtered: {
    title: 'Alles ausgefiltert',
    description: 'Mit diesen Filtern bleibt nichts übrig. Lockere sie ein wenig.',
  },
};

/** Title and description for a kind, with per-screen overrides winning. */
export function emptyStateContent(
  kind: EmptyStateKind,
  overrides: Partial<EmptyStateCopy> = {},
): EmptyStateCopy {
  const base = emptyStateCopy[kind] ?? emptyStateCopy.noResults;
  return {
    title: overrides.title ?? base.title,
    description: overrides.description ?? base.description,
  };
}
