import {
  House,
  MagnifyingGlass,
  PlusSquare,
  Bell,
  User,
  Heart,
  ChatCircle,
  PaperPlaneTilt,
  X,
  Camera,
  Image as ImageIcon,
  DotsThree,
  BookmarkSimple,
  PlusCircle,
  ShareNetwork,
  Smiley,
  CaretRight,
  Megaphone,
  SealCheck,
  InstagramLogo,
  CaretLeft,
  Play,
  CheckCircle,
  type IconProps,
} from 'phosphor-react-native';
import { type ComponentType } from 'react';
import { type OpaqueColorValue, type StyleProp, type ViewStyle } from 'react-native';

// Map icon names to Phosphor components
const ICON_MAP: Record<string, ComponentType<IconProps>> = {
  // Tab bar icons
  'house.fill': House,
  'magnifyingglass': MagnifyingGlass,
  'plus.app': PlusSquare,
  'bell.fill': Bell,
  'person.fill': User,
  // Action icons
  'heart': Heart,
  'chat': ChatCircle,
  'paperplane': PaperPlaneTilt,
  'xmark': X,
  'camera': Camera,
  'photo': ImageIcon,
  // Feed icons
  'dots-three': DotsThree,
  'bookmark': BookmarkSimple,
  'plus-circle': PlusCircle,
  'share': ShareNetwork,
  'smiley': Smiley,
  // Navigation icons
  'chevron.right': CaretRight,
  'chevron.left': CaretLeft,
  'megaphone': Megaphone,
  'seal-check': SealCheck,
  'instagram-logo': InstagramLogo,
  'play': Play,
  // Selection icons
  'check-circle': CheckCircle,
};

export type IconSymbolName = keyof typeof ICON_MAP;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
}) {
  const IconComponent = ICON_MAP[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in ICON_MAP`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      color={color as string}
      weight={weight}
      style={style}
    />
  );
}
