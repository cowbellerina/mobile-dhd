import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Spacing, Layout } from '@/constants/Theme';
import { GLYPH_COMPONENT_MAP, ChevronPlaceholder } from '@/components/chevrons';

/**
 * Props for the ChevronDisplay component
 */
interface ChevronDisplayProps {
  /** Array of glyph slugs to display in the chevron slots */
  glyphSlugs: string[];
  /** Optional style override for the container */
  style?: ViewStyle;
}

const Chevron = React.memo(({ slug, index }: { slug?: string; index: number }) => {
  const active = !!slug;
  const GlyphComponent = (slug ? GLYPH_COMPONENT_MAP[slug] : null) || ChevronPlaceholder;
  const color = active ? Colors.glyph.active : Colors.glyph.inactive;

  const chevronStyle = active
    ? styles.chevron
    : [styles.chevron, { backgroundColor: Colors.interactive.hover }];

  return (
    <View
      style={chevronStyle}
      testID={`chevron-${index}`}
    >
      <GlyphComponent
        width="100%"
        height="100%"
        color={color}
        testID={`chevron-glyph-${active ? slug : 'placeholder-' + index}`}
      />
    </View>
  );
}, (prev, next) => {
  return prev.slug === next.slug;
});

Chevron.displayName = 'Chevron';

export default function ChevronDisplay({ glyphSlugs, style }: ChevronDisplayProps) {
  return (
    <View style={[styles.container, style]} testID="chevron-display">
      {Array.from({ length: Layout.chevron.count }).map((_, index) => (
        <Chevron
          key={index}
          slug={glyphSlugs[index]}
          index={index + 1}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Layout.chevron.gap,
  },
  chevron: {
    width: Layout.chevron.size,
    height: Layout.chevron.size,
    borderRadius: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: Spacing.xs,
  },
});
