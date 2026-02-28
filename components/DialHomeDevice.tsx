import React from 'react';
import { ViewStyle } from 'react-native';
import Svg from 'react-native-svg';
import { DHDDefs } from './dhd/DHDDefs';
import { DHDBackground } from './dhd/DHDBackground';
import { DHDDomeRing } from './dhd/DHDDomeRing';
import { DHDActivationDome } from './dhd/DHDActivationDome';
import { DHDGlyphKeys } from './dhd/DHDGlyphKeys';

/**
 * Props for the DialHomeDevice component
 */
interface DialHomeDeviceProps {
  /** Optional style to apply to the SVG container */
  style?: ViewStyle;
  /** Array of glyph slugs that have been dialed in sequence */
  dialedSlugs: string[];
  /** Callback invoked when a glyph is pressed */
  onGlyphPress: (slug: string) => void;
  /** Callback invoked when the activation dome is pressed */
  onDomePress: () => void;
  /** Whether the dome is currently active (7 glyphs dialed) */
  isDomeActive: boolean;
}

/**
 * DialHomeDevice component - the main DHD interface
 */
export const DialHomeDevice: React.FC<DialHomeDeviceProps> = ({
  style,
  dialedSlugs,
  onGlyphPress,
  onDomePress,
  isDomeActive
}) => {
  return (
    <Svg style={style} viewBox="0 0 900 900" testID="dial-home-device">
      <DHDDefs isDomeActive={isDomeActive} />
      <DHDBackground />
      <DHDGlyphKeys dialedSlugs={dialedSlugs} disabled={isDomeActive} onGlyphPress={onGlyphPress} />
      <DHDActivationDome onDomePress={onDomePress} />
      <DHDDomeRing />
    </Svg>
  );
};
