import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  slideFrom?: number;
}

/** Lightweight fade/slide — works in Expo Go without Reanimated native modules. */
export function FadeInView({
  children,
  delay = 0,
  duration = 450,
  style,
  slideFrom = 14,
}: FadeInViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(slideFrom)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration, delay, useNativeDriver: true }),
    ]).start();
  }, [delay, duration, opacity, translateY]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>{children}</Animated.View>
  );
}

interface PulseViewProps {
  children: ReactNode;
  active?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PulseView({ children, active = false, style }: PulseViewProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) {
      scale.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.12, duration: 600, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, scale]);

  return <Animated.View style={[{ transform: [{ scale }] }, style]}>{children}</Animated.View>;
}
