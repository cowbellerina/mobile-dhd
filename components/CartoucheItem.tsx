import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { CartoucheEntry } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize } from '@/constants/Theme';
import ChevronDisplay from '@/components/ChevronDisplay';

/**
 * Props for the CartoucheItem component
 */
interface CartoucheItemProps {
  /** The cartouche entry to display */
  entry: CartoucheEntry;
  /** Callback invoked when the delete button is pressed */
  onDelete: (id: string) => void;
  /** Callback invoked when the re-dial action is pressed */
  onReDial: (id: string, sequence: string[]) => void;
}

const CartoucheItem = ({ entry, onDelete, onReDial }: CartoucheItemProps) => {
  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        onPress={() => onReDial(entry.id, entry.dialingSequence)}
        testID={`redial-btn-${entry.id}`}
        style={styles.redialAction}
      >
        <Animated.View style={[styles.redialContent, { transform: [{ scale }] }]}>
          <Ionicons name="call-outline" size={24} color={Colors.text.primary} />
          <Text style={styles.redialText}>Dial</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        onPress={() => onDelete(entry.id)}
        testID={`delete-btn-${entry.id}`}
        style={styles.deleteAction}
      >
        <Animated.View style={[styles.deleteContent, { transform: [{ scale }] }]}>
          <Ionicons name="trash-outline" size={24} color={Colors.text.primary} />
          <Text style={styles.deleteText}>Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      overshootLeft={false}
      overshootRight={false}
      friction={2}
      testID={`cartouche-item-${entry.id}`}
    >
      <View style={styles.container}>
        <ChevronDisplay glyphSlugs={entry.dialingSequence} style={styles.chevrons} />
        <View style={styles.info}>
          <Text style={styles.name}>{entry.name}</Text>
          <Text style={styles.phone}>{entry.phoneNumber}</Text>
        </View>
      </View>
    </Swipeable>
  );
};

export default React.memo(CartoucheItem, (prevProps, nextProps) => {
  return prevProps.entry.id === nextProps.entry.id;
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
    backgroundColor: Colors.background.secondary,
  },
  chevrons: {
    paddingVertical: Spacing.sm,
  },
  info: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    alignItems: 'center',
  },
  name: {
    color: Colors.text.primary,
    fontWeight: 'bold',
    fontSize: FontSize.md,
    textAlign: 'center',
  },
  phone: {
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  deleteAction: {
    backgroundColor: Colors.status.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  deleteContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: Colors.text.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  redialAction: {
    backgroundColor: Colors.accent.orange,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  redialContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  redialText: {
    color: Colors.text.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
});
