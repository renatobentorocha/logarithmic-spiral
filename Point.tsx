import React from 'react';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  withSpring,
} from 'react-native-reanimated';

type PointType = {
  center: { x: number; y: number };
  x: number;
  y: number;
};

const POINT_SIZE = 10;

export function Point({ center, x, y }: PointType) {
  const sharedValue = useSharedValue(1);

  sharedValue.value = withRepeat(
    withTiming(1000, { duration: 1000 }),
    -1,
    true
  );

  const styles = useAnimatedStyle(() => {
    const opacity = interpolate(
      sharedValue.value,
      [0, 250, 500, 750, 1000],
      [0, 0.25, 0.5, 0.75, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [
        { translateX: withSpring(center.x + x) },
        { translateY: withSpring(center.y + y) },
        { scale: opacity + 0.3 },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: POINT_SIZE,
          height: POINT_SIZE,
          borderRadius: POINT_SIZE / 2,
          backgroundColor: 'white',
        },
        styles,
      ]}
    />
  );
}
