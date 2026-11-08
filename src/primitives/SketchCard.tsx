import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { radii } from '../tokens/radii';
import { spacing } from '../tokens/spacing';

export type SketchTone = 'card' | 'mint' | 'lime' | 'yellow';

export interface SketchCardProps extends ViewProps {
  tone?: SketchTone;
  /** Distance of the dotted echo outline behind the card. 0 turns it off. */
  offset?: number;
  /** Optional coloured band across the top (calendar header, section title). */
  header?: React.ReactNode;
  headerTone?: SketchTone;
  radius?: number;
  padding?: number;
  style?: StyleProp<ViewStyle>;
}

/** Fill colour for a tone. mint → green tint, lime/yellow → amber tint / amber. */
export function useSketchTone(tone: SketchTone): string {
  const { palette } = useTheme();
  switch (tone) {
    case 'mint': return palette.greenTint;
    case 'lime': return palette.amberTint;
    case 'yellow': return palette.amber;
    default: return palette.cardBg;
  }
}

/** Hand-drawn card: thick ink outline with a dotted echo outline offset behind it, optional tinted header band. */
export const SketchCard: React.FC<SketchCardProps> = ({
  tone = 'card', offset = 5, header, headerTone = 'mint', radius = radii.lg, padding = spacing.md + 2, style, children, ...rest
}) => {
  const { palette } = useTheme();
  const fill = useSketchTone(tone);
  const headerFill = useSketchTone(headerTone);
  return (
    <View style={{ paddingRight: offset, paddingBottom: offset }}>
      {offset > 0 ? (
        <View
          pointerEvents="none"
          style={[styles.echo, { left: offset, top: offset, right: 0, bottom: 0, borderRadius: radius, borderColor: palette.border }]}
        />
      ) : null}
      <View style={[styles.card, { backgroundColor: fill, borderColor: palette.border, borderRadius: radius }, style]} {...rest}>
        {header ? (
          <View style={[styles.header, { backgroundColor: headerFill, borderBottomColor: palette.border, padding: spacing.sm }]}>
            {header}
          </View>
        ) : null}
        <View style={{ padding }}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  echo: { position: 'absolute', borderWidth: 2, borderStyle: 'dotted' },
  card: { borderWidth: 2, overflow: 'hidden' },
  header: { borderBottomWidth: 2 },
});
