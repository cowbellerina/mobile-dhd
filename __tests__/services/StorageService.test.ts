import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from '../../services/StorageService';
import { CartoucheEntry } from '../../types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('StorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads cartouche returning empty array if null', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const cartouche = await StorageService.loadCartouche();
    expect(cartouche).toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@dhd_cartouche_v1');
  });

  it('loads cartouche returning parsed data', async () => {
    const mockData = [{ id: '1', name: 'Test' }];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockData));
    const cartouche = await StorageService.loadCartouche();
    expect(cartouche).toEqual(mockData);
  });

  it('saves cartouche', async () => {
    const mockData: CartoucheEntry[] = [{ id: '1', name: 'Test', phoneNumber: '123', dialingSequence: [] }];
    await StorageService.saveCartouche(mockData);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@dhd_cartouche_v1', JSON.stringify(mockData));
  });

  it('adds an entry to cartouche', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');
    const newEntry: CartoucheEntry = { id: '1', name: 'Test', phoneNumber: '123', dialingSequence: [] };
    
    await StorageService.saveCartoucheEntry(newEntry);
    
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@dhd_cartouche_v1', 
        JSON.stringify([newEntry])
    );
  });

  it('deletes an entry from cartouche', async () => {
    const existing: CartoucheEntry[] = [{ id: '1', name: 'Test', phoneNumber: '123', dialingSequence: [] }];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existing));
    
    await StorageService.deleteCartoucheEntry('1');
    
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@dhd_cartouche_v1', '[]');
  });
});
