import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export function ProfileIcon({ size = 24, color = 'black', ...props }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={2} />
      <Path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
} 