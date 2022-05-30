import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, PathProps } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

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

export default function App() {
  const { width, height } = useWindowDimensions();

  const center = {
    x: width / 2,
    y: height / 2,
  };

  const angle = useSharedValue(0);
  const a = useSharedValue(0.1);
  const k = useSharedValue(0.1);
  const incrementAngle = useSharedValue(0.1);
  const d = useSharedValue(`M ${center.x} ${center.y}`);

  const animatedPathProps = useAnimatedProps<PathProps>(() => {
    if (angle.value <= NUMBER_OF_CIRCLES * FULL_CIRCLE) {
      const { x, y } = logarithmicSpiralPoint(a.value, k.value, angle.value);
      d.value = `${d.value} L${center.x + x} ${center.y + y}`;
      angle.value = angle.value + incrementAngle.value;
    }

    return {
      d: d.value,
    };
  });

  return (
    <Svg style={[StyleSheet.absoluteFill, { backgroundColor: '#ff000081' }]}>
      <AnimatedPath
        animatedProps={animatedPathProps}
        strokeWidth={3}
        stroke="red"
      />
    </Svg>
  );
}
