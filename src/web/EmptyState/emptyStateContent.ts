// The copy table lives in utils so the React Native EmptyState shares it;
// these names are re-exported so the web entry keeps its existing API.
export { emptyStateCopy, emptyStateContent } from '../../utils/emptyState';
export type { EmptyStateKind, EmptyStateCopy } from '../../utils/emptyState';
