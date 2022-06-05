import React, { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg from 'react-native-svg';
import { useSharedValue, runOnJS, runOnUI } from 'react-native-reanimated';
import { Point } from './Point';

const FULL_CIRCLE = 2 * Math.PI;
const NUMBER_OF_CIRCLES = 12;

// https://en.wikipedia.org/wiki/Logarithmic_spiral
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

  const [pointsDrawned, setPointsDrawed] = useState(false);
  const points = useSharedValue<Array<number[]>>([[0, 0]]);

  function init() {
    'worklet';
    let angle = 0.1;
    const incrementAngle = 0.1;
    const a = 0.1;
    const k = 0.1;

    while (angle <= NUMBER_OF_CIRCLES * FULL_CIRCLE) {
      const { x, y } = logarithmicSpiralPoint(a, k, angle);

      points.value = [...points.value, [x, y]];
      angle = angle + incrementAngle;
    }
    runOnJS(setPointsDrawed)(true);
  }

  useEffect(() => {
    runOnUI(init)();
  });

  return (
    <Svg style={[StyleSheet.absoluteFill, { backgroundColor: '#ff000081' }]}>
      {pointsDrawned &&
        points.value.map((p, index) => (
          <Point
            key={index.toString()}
            center={{ x: center.x - 10, y: center.y - 10 }}
            x={p[0]}
            y={p[1]}
          />
        ))}
    </Svg>
  );
}
