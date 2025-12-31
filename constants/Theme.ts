/**
 * Centralized theme configuration
 * All colors, spacing, and design tokens should be defined here
 */

import { MAX_SEQUENCE_LENGTH } from './DialingConfig';

export const Colors = {
  // Background colors
  background: {
    primary: '#1a1a1a',
    secondary: '#111111',
    tertiary: '#000000',
    card: '#111',
  },

  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    tertiary: '#aaa',
    quaternary: '#888',
    disabled: '#333',
    muted: 'rgba(255, 255, 255, 0.3)',
  },

  // Accent colors - Stargate themed
  accent: {
    gold: '#ccac00',
    goldSymbol: '#ccac00', // For gradient use
    orange: '#ff8c00',
    glow: '#ff8c00',
  },

  // Border colors
  border: {
    default: '#333333',
    dark: '#1a1a1a',
  },

  // Status colors
  status: {
    error: 'red',
    success: '#00ff00',
    warning: '#ff8c00',
  },

  // Interactive element colors
  interactive: {
    activeTint: '#ccac00',
    inactiveTint: '#888888',
    hover: 'rgba(255, 255, 255, 0.05)',
  },

  // Shadow colors
  shadow: {
    gold: '#ff8c00',
    orange: '#ff8c00',
  },

  // Symbol/glyph colors
  glyph: {
    active: '#f5f5f5',
    inactive: '#333',
    placeholder: '#505050',
  },

  // Transparent overlays
  overlay: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.3)',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 32,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
};

export const Animation = {
  // Duration in milliseconds
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },

  // Timeout durations (for delays, not animations)
  timeout: {
    resetAfterDial: 2000, // Reset DHD after successful dial
  },

  // Scale values
  scale: {
    active: 1.1,
    inactive: 1,
    pressed: 0.95,
  },

  // Opacity values
  opacity: {
    visible: 1,
    hidden: 0,
    dimmed: 0.5,
    shadow: 0.8,
  },
};

export const Layout = {
  chevron: {
    size: 34,
    gap: 8,
    count: MAX_SEQUENCE_LENGTH, // Number of chevron slots in the display
  },
  shadow: {
    radius: 10,
    elevation: 5,
  },
  itemHeight: {
    cartouche: 88, // Estimated, adjust based on actual rendering
  },
  flatList: {
    maxToRenderPerBatch: 10,
    windowSize: 5,
    initialNumToRender: 10,
  },
};
