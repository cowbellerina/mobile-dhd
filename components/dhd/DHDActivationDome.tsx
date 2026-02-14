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
        d="M330.077 511.852c-35.456 -65.519 -11.09 -147.36 54.43 -182.81c65.511 -35.459 147.362 -11.092 182.801 54.429c35.46 65.511 11.085 147.356 -54.42 182.802C447.37 601.732 365.53 577.356 330.077 511.852"
        fill="url(#domeGradient)"
      />
      <Path
        d="M333.751 501.151a132.549 132.549 0 0 0 3.445 6.849l-14.237 7.704a148.068 148.068 0 0 1 -3.879 -7.709z"
        fill={Colors.border.default}
      />
      <Path
        d="M330.722 494.112a125.373 125.373 0 0 0 3.03 7.039L319.083 507.995a140.465 140.465 0 0 1 -3.415 -7.931z"
        fill={Colors.background.primary}
      />
    </G>
  );
};
