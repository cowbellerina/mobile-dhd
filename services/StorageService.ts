import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cartouche, CartoucheEntry } from '../types';
import { logger } from '../utils/logger';

const STORAGE_KEY = '@dhd_cartouche_v1';

export const StorageService = {
  async loadCartouche(): Promise<Cartouche> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      logger.error('Failed to load cartouche', e);
      return [];
    }
  },

  async saveCartouche(cartouche: Cartouche): Promise<void> {
    try {
      const jsonValue = JSON.stringify(cartouche);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      logger.error('Failed to save cartouche', e);
    }
  },

  async saveCartoucheEntry(entry: CartoucheEntry): Promise<void> {
    const currentCartouche = await this.loadCartouche();
    const updatedCartouche = [...currentCartouche, entry];
    await this.saveCartouche(updatedCartouche);
  },

  async deleteCartoucheEntry(id: string): Promise<void> {
    const currentCartouche = await this.loadCartouche();
    const updatedCartouche = currentCartouche.filter((entry) => entry.id !== id);
    await this.saveCartouche(updatedCartouche);
  }
};
