import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function RecordsIcon({ size = 24, color = 'black', ...props }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
} 