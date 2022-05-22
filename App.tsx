import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Polyline, PolylineProps } from 'react-native-svg';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
} from 'react-native-reanimated';

const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

const POINT_SIZE = 5;
const FULL_CIRCLE = 2 * Math.PI;
const NUMBER_OF_CIRCLES = 20;

// # In Cartesian coordinates
//  ## The logarithmic spiral with the polar equation
//  r = ae^k÷ɸ

//  ## can be represented in Cartesian coordinates (x=r cos ɸ, y= r sin ɸ)
//  x = ae^k÷ɸ * cos ɸ
//  y = ae^k÷ɸ * sin ɸ

function logarithmicSpiralPoint(a: number, k: number, ɸ: number) {
  'worklet';

  const r = a * Math.pow(Math.E, k * ɸ);
  const x = r * Math.cos(ɸ);
  const y = r * Math.sin(ɸ);

  return { x, y };
}

export default function App() {
  const { width, height } = useWindowDimensions();

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const incrementAngle = useSharedValue(0.1);

  useEffect(() => {
    x.value = width / 2 - POINT_SIZE / 2;
    y.value = height / 2 - POINT_SIZE / 2;
  });

  function draw() {
    'worklet';
    const a = 0.1;
    const b = 0.1;
    let angle = 0;
    const points: Array<number> = [];

    while (angle <= NUMBER_OF_CIRCLES * FULL_CIRCLE) {
      const { x, y } = logarithmicSpiralPoint(a, b, angle);

      points.push(...[x, y]);
      angle = angle + incrementAngle.value;
    }

    return points;
  }

  const polylineProps = useAnimatedProps<PolylineProps>(() => {
    const points = draw();
    return {
      points: points,
      transform: [
        {
          translateX: withTiming(x.value),
        },
        {
          translateY: withTiming(y.value),
        },
      ],
    };
  });

  return (
    <Svg style={[StyleSheet.absoluteFill, { backgroundColor: 'red' }]}>
      <AnimatedPolyline
        animatedProps={polylineProps}
        fill="none"
        stroke="black"
        strokeWidth="3"
      />
    </Svg>
  );
}
