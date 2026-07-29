import React from 'react';
import { Image, View, StyleSheet, type ImageSourcePropType, type ViewStyle, type StyleProp } from 'react-native';

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

/**
 * Web-only stylesheet block. Inject into <head> once (see `gremlinCss`) so the
 * animation classes above work in browsers.
 */
export const gremlinCss = `
@keyframes chaos-gremlin-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes chaos-gremlin-wiggle { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
@keyframes chaos-gremlin-float  { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-6px) rotate(2deg); } }
.chaos-gremlin--bounce { animation: chaos-gremlin-bounce 1.8s ease-in-out infinite; }
.chaos-gremlin--wiggle { animation: chaos-gremlin-wiggle 1.2s ease-in-out infinite; transform-origin: 50% 80%; }
.chaos-gremlin--float  { animation: chaos-gremlin-float 2.4s ease-in-out infinite; }
`.trim();
