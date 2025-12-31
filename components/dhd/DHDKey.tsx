import React from 'react';
import { G } from 'react-native-svg';

/**
 * Props for the DHDKey component
 */
interface DHDKeyProps {
  /** The unique identifier for this glyph */
  slug: string;
  /** SVG path elements representing the glyph symbol */
  children: React.ReactNode;
  /** Whether this key is currently in the active/dialed state */
  active: boolean;
  /** Callback invoked when the key is pressed */
  onPress: (slug: string) => void;
}

/**
 * DHDKey component - represents a single glyph key on the DHD
 */
export const DHDKey: React.FC<DHDKeyProps> = React.memo(({
  slug,
  children,
  active,
  onPress,
}) => {
  const processedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const c = child as React.ReactElement<any>;
      const props = c.props;
      const style = props.style || {};

      const currentFill = props.fill || style.fill;
      let newFill = currentFill;

      if (currentFill === '#505050') {
        if (active) {
          newFill = 'url(#goldSymbol)';
        }
      }
      else if (currentFill === 'url(#brushedMetal)' && active) {
        newFill = 'url(#goldHighlight)';
      }

      if (newFill !== currentFill) {
        const newProps: any = {};
        if (props.fill) {
          newProps.fill = newFill;
        } else {
          newProps.style = { ...style, fill: newFill };
        }
        return React.cloneElement(c, newProps);
      }
    }
    return child;
  });

  return (
    <G
      id={`glyph-${slug}`}
      onPress={() => onPress(slug)}
      opacity={active ? 1.0 : 0.8}
    >
      {processedChildren}
    </G>
  );
}, (prev, next) => {
  return prev.active === next.active;
});

DHDKey.displayName = 'DHDKey';
