import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { StorageService } from '@/services/StorageService';
import { CartoucheEntry } from '@/types';
import CartoucheItem from '@/components/CartoucheItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logger } from '@/utils/logger';
import { Layout, Colors, Spacing } from '@/constants/Theme';

export default function CartoucheScreen() {
  const router = useRouter();
  const [cartouche, setCartouche] = useState<CartoucheEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await StorageService.loadCartouche();
      setCartouche(data);
    } catch (error) {
      logger.error('Failed to load cartouche:', error);
      setCartouche([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleDelete = useCallback(async (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await StorageService.deleteCartoucheEntry(id);
    loadData();
  }, [loadData]);

  const handleReDial = useCallback((id: string, sequence: string[]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/',
      params: {
        autoDialSequence: JSON.stringify(sequence),
      },
    });
  }, [router]);

  const renderItem = useCallback(({ item }: { item: CartoucheEntry }) => (
    <CartoucheItem entry={item} onDelete={handleDelete} onReDial={handleReDial} />
  ), [handleDelete, handleReDial]);

  const getItemLayout = useCallback(
    (_data: CartoucheEntry[] | null | undefined, index: number) => ({
      length: Layout.itemHeight.cartouche,
      offset: Layout.itemHeight.cartouche * index,
      index,
    }),
    []
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.accent.orange} />
      ) : (
        <FlatList
          data={cartouche}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          removeClippedSubviews={true}
          maxToRenderPerBatch={Layout.flatList.maxToRenderPerBatch}
          windowSize={Layout.flatList.windowSize}
          initialNumToRender={Layout.flatList.initialNumToRender}
          ListEmptyComponent={<Text style={styles.emptyText}>No saved addresses.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
  },
  emptyText: {
    color: Colors.text.quaternary,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
