import React from 'react';
import { G, Path } from 'react-native-svg';
import { Colors } from '@/constants/Theme';

/**
 * DHDBackground component - renders the background rings of the DHD
 */
export const DHDBackground: React.FC = () => {
  return (
    <G>
      {/* Outer ring background */}
      <Path
        d="M0 0c0-171.209-138.791-310-310-310S-620-171.209-620 0c0 171.21 138.791 310 310 310S0 171.21 0 0"
        fill={Colors.background.primary}
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(630 640)"
      />
      {/* Inner ring background */}
      <Path
        d="M0 0c0-119.856-97.144-217-217-217-119.857 0-217 97.144-217 217 0 119.857 97.143 217 217 217C-97.144 217 0 119.857 0 0"
        fill={Colors.background.primary}
        fillOpacity={1}
        fillRule="nonzero"
        stroke="none"
        transform="translate(536 642)"
      />
    </G>
  );
};
