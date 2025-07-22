import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export function ChatIcon({ size = 24, color = 'black', ...props }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path d="M4 19v-2a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" stroke={color} strokeWidth={2} />
      <Circle cx={9} cy={13} r={1} fill={color} />
      <Circle cx={12} cy={13} r={1} fill={color} />
      <Circle cx={15} cy={13} r={1} fill={color} />
    </Svg>
  );
} 