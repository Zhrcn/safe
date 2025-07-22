import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export function ProvidersIcon({ size = 24, color = 'black', ...props }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Circle cx={7} cy={10} r={2} stroke={color} strokeWidth={2} />
      <Circle cx={17} cy={10} r={2} stroke={color} strokeWidth={2} />
      <Circle cx={12} cy={7} r={2} stroke={color} strokeWidth={2} />
      <Path d="M2 20c0-2 3-3 5-3s5 1 5 3" stroke={color} strokeWidth={2} />
      <Path d="M12 20c0-2 3-3 5-3s5 1 5 3" stroke={color} strokeWidth={2} />
      <Path d="M7 14c0-1.5 2-2.5 5-2.5s5 1 5 2.5" stroke={color} strokeWidth={2} />
    </Svg>
  );
} 