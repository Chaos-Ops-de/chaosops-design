import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontFamilies, fontSizes } from '../tokens/fonts';
import { spacing } from '../tokens/spacing';
import { emptyStateContent, type EmptyStateKind } from '../utils/emptyState';
import { PillButton } from './PillButton';

export type { EmptyStateKind } from '../utils/emptyState';

export interface EmptyStateAction {
  label: string;
  onPress: () => void;
}

export interface EmptyStateProps {
  /** Which of the four empty situations this is; picks the default copy. */
  kind?: EmptyStateKind;
  /** Overrides the default title for `kind`. */
  title?: string;
  /** Overrides the default description for `kind`. */
  description?: string;
  /** A mascot or small illustration (e.g. a `<Gremlin>`). Decorative. */
  illustration?: React.ReactNode;
  /** The next step the user would take (not "refresh"); the primary button. */
  action?: EmptyStateAction;
  /** A quieter alternative, rendered as an outline button. */
  secondaryAction?: EmptyStateAction;
  /** `danger` tints the title; defaults to danger for the `error` kind. */
  tone?: 'default' | 'danger';
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Empty screen, designed per situation: first run, no results, error, or
 * filtered out. Shares its German copy with the web EmptyState.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  kind = 'noResults', title, description, illustration, action, secondaryAction, tone, style, testID,
}) => {
  const { palette } = useTheme();
  const content = emptyStateContent(kind, { title, description });
  const danger = (tone ?? (kind === 'error' ? 'danger' : 'default')) === 'danger';

  return (
    <View testID={testID} accessibilityRole="summary" style={[styles.wrap, style]}>
      {illustration ? (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {illustration}
        </View>
      ) : null}
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: danger ? palette.dangerInk : palette.ink, fontFamily: fontFamilies.display }]}
      >
        {content.title}
      </Text>
      <Text style={[styles.description, { color: palette.inkMuted, fontFamily: fontFamilies.body }]}>{content.description}</Text>
      {action || secondaryAction ? (
        <View style={styles.actions}>
          {action ? <PillButton label={action.label} onPress={action.onPress} /> : null}
          {secondaryAction ? <PillButton label={secondaryAction.label} variant="outline" onPress={secondaryAction.onPress} /> : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing.md, padding: spacing.xxl },
  title: { fontSize: fontSizes.xl, textAlign: 'center' },
  description: { maxWidth: 320, fontSize: fontSizes.md, lineHeight: 22, textAlign: 'center' },
  actions: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
});
