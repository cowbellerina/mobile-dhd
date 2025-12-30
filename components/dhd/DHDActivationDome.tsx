import React from 'react';
import { G, Path } from 'react-native-svg';
import { Colors } from '@/constants/Theme';

/**
 * Props for the DHDActivationDome component
 */
interface ActivationDomeProps {
  /** Callback invoked when the dome is pressed */
  onDomePress: () => void;
}

/**
 * DHDActivationDome component - the central red dome button that activates the gate
 */
export const DHDActivationDome: React.FC<ActivationDomeProps> = ({ onDomePress }) => {
  return (
    <G onPress={onDomePress}>
      <Path
        d="M0 0c-27.992 51.726-8.755 116.337 42.971 144.324 51.719 27.994 116.339 8.757 144.317-42.97 27.995-51.719 8.751-116.334-42.963-144.318C92.6-70.958 27.989-51.714 0 0"
        fill="url(#domeGradient)"
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(225.38 591.116)"
      />
      <Path
        d="M0 0a104.644 104.644 0 0 1 2.72-5.407l-11.24-6.082a116.896 116.896 0 0 0-3.062 6.086z"
        fill={Colors.border.default}
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(228.28 599.564)"
      />
      <Path
        d="M0 0a98.979 98.979 0 0 1 2.392-5.557L-9.189-10.96a110.894 110.894 0 0 0-2.696 6.261z"
        fill={Colors.background.primary}
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(225.889 605.121)"
      />
    </G>
  );
};
