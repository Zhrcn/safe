// Fallback for using MaterialIcons on Android and web.

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue } from 'react-native';
import { ICON_MAP } from './icons';

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
};

export function IconSymbol({
  name,
  size = 24,
  color = 'black',
  style,
  weight,
}) {
  const IconComponent = ICON_MAP[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} style={style} />;
} 