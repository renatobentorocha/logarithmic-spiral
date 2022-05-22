import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Circle, CircleProps } from 'react-native-svg';
import Animated, {
  useSharedValue,
  withTiming,
  withSpring,
  useAnimatedProps,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function App() {
  const { width, height } = useWindowDimensions();

  const x = useSharedValue(0);
  const y = useSharedValue(0);

  useEffect(() => {
    x.value = width / 2;
    y.value = height / 2;
  });

  const circleProps = useAnimatedProps<CircleProps>(() => {
    return {
      cx: withTiming(x.value),
      cy: withSpring(y.value),
    };
  });

  return (
    <Svg style={[StyleSheet.absoluteFill, { backgroundColor: 'red' }]}>
      <AnimatedCircle
        animatedProps={circleProps}
        r="30"
        stroke="blue"
        strokeWidth="1"
        fill="green"
      />
    </Svg>
  );
}
