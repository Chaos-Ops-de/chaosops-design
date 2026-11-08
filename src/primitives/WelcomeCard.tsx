import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SketchCard, useSketchTone } from './SketchCard';
import { Text } from './Text';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export interface WelcomeCardProps {
  title: string;
  text: string;
  actionLabel: string;
  onAction: () => void;
  onHaptic?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Intro card: bold greeting, short text and a mint pill CTA with a round dark arrow button. */
export const WelcomeCard: React.FC<WelcomeCardProps> = ({ title, text, actionLabel, onAction, onHaptic, style }) => {
  const { palette } = useTheme();
  const mint = useSketchTone('mint');
  return (
    <SketchCard style={style}>
      <View style={styles.body}>
        <Text variant="display" size="xxl" accessibilityRole="header">{title}</Text>
        <Text size="sm" muted>{text}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={() => { try { onHaptic?.(); } catch { /* ignore */ } onAction(); }}
          style={[styles.cta, { backgroundColor: mint, borderColor: palette.border }]}
        >
          <Text variant="bodyBold" style={styles.ctaLabel}>{actionLabel}</Text>
          <View style={[styles.arrow, { backgroundColor: palette.ink }]}>
            <Text variant="bodyBold" style={{ color: palette.bg }}>→</Text>
          </View>
        </Pressable>
      </View>
    </SketchCard>
  );
};

const styles = StyleSheet.create({
  body: { gap: spacing.sm },
  cta: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', marginTop: spacing.sm,
    borderWidth: 2, borderRadius: radii.full, paddingLeft: spacing.lg, padding: 3,
  },
  ctaLabel: { flex: 1 },
  arrow: { width: 34, height: 34, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center' },
});
