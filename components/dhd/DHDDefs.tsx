import React from 'react';
import { Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';

/**
 * Props for the DHDDefs component
 */
interface DHDDefsProps {
  /** Whether the dome is currently active (changes gradient colors) */
  isDomeActive: boolean;
}

/**
 * DHDDefs component - contains all SVG gradient and filter definitions
 * used throughout the DHD component
 */
export const DHDDefs: React.FC<DHDDefsProps> = ({ isDomeActive }) => {
  return (
    <Defs>
      {/* Dome gradient - changes color when active */}
      <RadialGradient
        id="domeGradient"
        cx="50%"
        cy="50%"
        rx="50%"
        ry="50%"
        fx="40%"
        fy="40%"
      >
        <Stop offset="0%" stopColor="#ff9999" stopOpacity="1" />
        <Stop offset="40%" stopColor={isDomeActive ? "#ff0000" : "#b42323"} stopOpacity="1" />
        <Stop offset="100%" stopColor="#660000" stopOpacity="1" />
      </RadialGradient>

      {/* Metallic key gradient */}
      <LinearGradient id="metallicKey" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#6b6b6b" stopOpacity="1" />
        <Stop offset="25%" stopColor="#4a4a4a" stopOpacity="1" />
        <Stop offset="50%" stopColor="#2b2b2b" stopOpacity="1" />
        <Stop offset="75%" stopColor="#1a1a1a" stopOpacity="1" />
        <Stop offset="100%" stopColor="#0a0a0a" stopOpacity="1" />
      </LinearGradient>

      {/* Brushed metal gradient for inactive keys */}
      <LinearGradient id="brushedMetal" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#888888" stopOpacity="1" />
        <Stop offset="10%" stopColor="#5a5a5a" stopOpacity="1" />
        <Stop offset="20%" stopColor="#6b6b6b" stopOpacity="1" />
        <Stop offset="30%" stopColor="#4a4a4a" stopOpacity="1" />
        <Stop offset="40%" stopColor="#5a5a5a" stopOpacity="1" />
        <Stop offset="50%" stopColor="#3b3b3b" stopOpacity="1" />
        <Stop offset="60%" stopColor="#2b2b2b" stopOpacity="1" />
        <Stop offset="70%" stopColor="#3a3a3a" stopOpacity="1" />
        <Stop offset="80%" stopColor="#252525" stopOpacity="1" />
        <Stop offset="90%" stopColor="#1a1a1a" stopOpacity="1" />
        <Stop offset="100%" stopColor="#0a0a0a" stopOpacity="1" />
      </LinearGradient>

      {/* Metallic highlight gradient */}
      <LinearGradient id="metallicHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#aaaaaa" stopOpacity="1" />
        <Stop offset="30%" stopColor="#888888" stopOpacity="1" />
        <Stop offset="60%" stopColor="#666666" stopOpacity="1" />
        <Stop offset="100%" stopColor="#444444" stopOpacity="1" />
      </LinearGradient>

      {/* Gold highlight gradient for active keys */}
      <LinearGradient id="goldHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#fff7cc" stopOpacity="1" />
        <Stop offset="40%" stopColor="#ffcc00" stopOpacity="1" />
        <Stop offset="100%" stopColor="#ff9900" stopOpacity="1" />
      </LinearGradient>

      {/* Gold symbol gradient for active glyphs */}
      <LinearGradient id="goldSymbol" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#ffff00" stopOpacity="1" />
        <Stop offset="50%" stopColor="#ffcc00" stopOpacity="1" />
        <Stop offset="100%" stopColor="#ffaa00" stopOpacity="1" />
      </LinearGradient>
    </Defs>
  );
};
