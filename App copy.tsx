import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Polyline, PolylineProps } from 'react-native-svg';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useAnimatedStyle,
  useAnimatedReaction,
  interpolate,
  runOnJS,
  withSpring,
  withRepeat,
  Extrapolate,
} from 'react-native-reanimated';

const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

const POINT_SIZE = 10;
const FULL_CIRCLE = 2 * Math.PI;
const NUMBER_OF_CIRCLES = 12;

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

type PointType = {
  center: { x: number; y: number };
  x: number;
  y: number;
};

function Point({ center, x, y }: PointType) {
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

export default function App() {
  const { width, height } = useWindowDimensions();

  const [showPoints, setShowPoints] = useState(false);

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const step = useSharedValue(0);

  const points = useSharedValue<Array<number[]>>([[0, 0]]);

  const animatedPoints = useSharedValue<Array<number>>([0, 0]);
  const incrementAngle = useSharedValue(0.1);

  function animateBall() {
    'worklet';

    runOnJS(setShowPoints)(true);
  }

  function draw() {
    'worklet';
    const a = 0.1;
    const b = 0.1;
    let angle = 0;

    while (angle <= NUMBER_OF_CIRCLES * FULL_CIRCLE) {
      const { x, y } = logarithmicSpiralPoint(a, b, angle);

      animatedPoints.value = [...animatedPoints.value, x, y];
      points.value = [...points.value, [x, y]];

      angle = angle + incrementAngle.value;
    }
  }

  function goToCenter() {
    'worklet';
    x.value = width / 2;
    y.value = height / 2;
  }

  useAnimatedReaction(
    () => {
      return step.value;
    },
    (data, prev) => {
      if (data === prev) return;

      switch (data) {
        case 0:
          goToCenter();
          step.value = withTiming(1);
          break;

        case 1:
          draw();
          step.value = withTiming(2);
          break;

        case 2:
          animateBall();
          step.value = withTiming(3);
          break;

        default:
          break;
      }
    }
  );

  const polylineProps = useAnimatedProps<PolylineProps>(() => {
    return {
      points: animatedPoints.value,
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
      {showPoints &&
        points.value.map((p, index) => (
          <Point
            key={index.toString()}
            center={{ x: x.value - 10, y: y.value - 10 }}
            x={p[0]}
            y={p[1]}
          />
        ))}
    </Svg>
  );
}
