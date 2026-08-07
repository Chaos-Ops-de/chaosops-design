import React from 'react';
import { Image, View, StyleSheet, type ImageSourcePropType, type ViewStyle, type StyleProp } from 'react-native';

export { gremlinCss } from './gremlinCss';

export type GremlinName =
  | '404' | 'buy' | 'down' | 'erfolg' | 'hide'
  | 'loadingbar' | 'login' | 'mail' | 'maintance' | 'sleep';

export type GremlinAnimation = 'bounce' | 'wiggle' | 'float' | 'none';

export interface GremlinProps {
  source: ImageSourcePropType;
  name?: GremlinName;
  size?: number;
  animation?: GremlinAnimation;
  style?: StyleProp<ViewStyle>;
}

/**
 * Renders a ChaosOps mascot. Consumers pass the image source explicitly (RN needs a
 * static require(), Web accepts a URL string) — this keeps bundler-agnostic paths.
 * The `animation` prop is honored on the web via className hooks; on native it is a no-op
 * unless the consumer wraps the child in an Animated.View.
 */
export const Gremlin: React.FC<GremlinProps> = ({ source, size = 96, animation = 'none', style }) => {
  const className = animation !== 'none' ? `chaos-gremlin chaos-gremlin--${animation}` : undefined;
  return (
    <View
      style={[styles.wrapper, { width: size, height: size }, style]}
      // @ts-expect-error className is respected by react-native-web
      className={className}
    >
      <Image source={source} style={styles.image} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%' },
});
