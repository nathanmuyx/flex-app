/**
 * Flex Brand Color Palette
 * These colors are used throughout the app for consistent branding.
 */

import { Platform } from 'react-native';

// Brand Color Palette
export const BrandColors = {
  base: {
    white: '#ffffff',
    black: '#000000',
  },
  orange: {
    25: '#fff9f5',
    50: '#fff4eb',
    100: '#ffe4d1',
    200: '#ffc8a3',
    300: '#ffa566',
    400: '#ff7f2e',
    500: '#e87200',
    600: '#d16600',
    700: '#b85a00',
    800: '#9e4d00',
    900: '#854100',
    950: '#6b3500',
  },
  green: {
    25: '#f5f9f6',
    50: '#ebf4ed',
    100: '#d4e8d9',
    200: '#a9d1b3',
    300: '#7ab88a',
    400: '#4e9964',
    500: '#226937',
    600: '#1e5d31',
    700: '#1a502a',
    800: '#164423',
    900: '#12371d',
    950: '#0e2b16',
  },
  gray: {
    25: '#fdfdfd',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e9eaeb',
    300: '#d5d7da',
    400: '#a4a7ae',
    500: '#717680',
    600: '#535862',
    700: '#414651',
    800: '#252b37',
    900: '#181d27',
    950: '#0a0d12',
  },
  error: {
    25: '#fffbfa',
    50: '#fef3f2',
    100: '#fee4e2',
    200: '#fecdca',
    300: '#fda29b',
    400: '#f97066',
    500: '#f04438',
    600: '#d92d20',
    700: '#b42318',
    800: '#912018',
    900: '#7a271a',
    950: '#55160c',
  },
};

// Theme Colors (mapped from brand palette)
export const Colors = {
  light: {
    text: BrandColors.gray[900],
    background: BrandColors.base.white,
    tint: BrandColors.orange[500],
    icon: BrandColors.gray[500],
    tabIconDefault: BrandColors.gray[400],
    tabIconSelected: BrandColors.orange[500],
    inputBackground: BrandColors.gray[100],
    inputBorder: BrandColors.gray[200],
    inputPlaceholder: BrandColors.gray[400],
    error: BrandColors.error[500],
    // Story ring colors
    memberRing: BrandColors.orange[500],
    // Reaction colors
    reactionPillBackground: BrandColors.gray[100],
    reactionPillActive: BrandColors.orange[50],
    // Text
    secondaryText: BrandColors.gray[500],
    separator: BrandColors.gray[200],
  },
  dark: {
    text: BrandColors.gray[50],
    background: BrandColors.gray[950],
    tint: BrandColors.orange[500],
    icon: BrandColors.gray[400],
    tabIconDefault: BrandColors.gray[500],
    tabIconSelected: BrandColors.orange[500],
    inputBackground: BrandColors.gray[800],
    inputBorder: BrandColors.gray[700],
    inputPlaceholder: BrandColors.gray[500],
    error: BrandColors.error[400],
    // Story ring colors
    memberRing: BrandColors.orange[500],
    // Reaction colors
    reactionPillBackground: BrandColors.gray[800],
    reactionPillActive: BrandColors.orange[950],
    // Text
    secondaryText: BrandColors.gray[400],
    separator: BrandColors.gray[800],
  },
};

// Story ring gradient colors (same for both themes)
export const StoryGradients = {
  admin: {
    start: BrandColors.green[400],
    end: BrandColors.orange[500],
  },
  announcement: {
    start: BrandColors.green[300],
    end: BrandColors.green[500],
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
