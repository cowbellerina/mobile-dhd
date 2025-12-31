import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { Colors, Spacing, Layout, Animation } from '@/constants/Theme';
import { GLYPH_COMPONENT_MAP, ChevronPlaceholder } from '@/components/chevrons';

/**
 * Props for the ChevronDisplay component
 */
interface ChevronDisplayProps {
  /** Array of glyph slugs to display in the chevron slots */
  glyphSlugs: string[];
}

const Chevron = React.memo(({ slug, index }: { slug?: string; index: number }) => {
  const active = !!slug;
  const GlyphComponent = (slug ? GLYPH_COMPONENT_MAP[slug] : null) || ChevronPlaceholder;
  const color = active ? Colors.glyph.active : Colors.glyph.inactive;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(active ? 'transparent' : Colors.interactive.hover, { duration: Animation.duration.normal }),
      transform: [
        { scale: withSpring(active ? Animation.scale.active : Animation.scale.inactive) }
      ],
      shadowOpacity: withTiming(active ? Animation.opacity.shadow : Animation.opacity.hidden),
    };
  });

  return (
    <Animated.View
      style={[styles.chevron, animatedStyle]}
      testID={`chevron-${index}`}
    >
      <GlyphComponent
        width="100%"
        height="100%"
        color={color}
        testID={`chevron-glyph-${active ? slug : 'placeholder-' + index}`}
      />
    </Animated.View>
  );
});

Chevron.displayName = 'Chevron';

export default function ChevronDisplay({ glyphSlugs }: ChevronDisplayProps) {
  return (
    <View style={styles.container} testID="chevron-display">
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
    shadowColor: Colors.shadow.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: Layout.shadow.radius,
    elevation: Layout.shadow.elevation,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: Spacing.xs,
  },
});
