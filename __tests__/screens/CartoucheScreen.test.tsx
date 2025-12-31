import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import CartoucheScreen from '../../app/(tabs)/cartouche';
import { CartoucheEntry } from '../../types';

// Mock Expo Router
const mockPush = jest.fn();

jest.mock('expo-router', () => {
  const React = require('react');
  return {
    useRouter: () => ({
      push: mockPush,
    }),
    useFocusEffect: (callback: () => void) => {
      // Use useEffect to call once on mount, simulating screen focus
      React.useEffect(() => {
        callback();
        return () => {};
      }, []);
    },
  };
});

// Mock StorageService
jest.mock('../../services/StorageService', () => ({
  StorageService: {
    loadCartouche: jest.fn(),
    deleteCartoucheEntry: jest.fn(),
    saveCartoucheEntry: jest.fn(),
  },
}));

describe('CartoucheScreen', () => {
  const { StorageService } = require('../../services/StorageService');
  const Haptics = require('expo-haptics');

  const mockEntries: CartoucheEntry[] = [
    {
      id: '1',
      name: 'Earth',
      phoneNumber: '555-0001',
      dialingSequence: ['earth', 'andromeda', 'aquarius', 'taurus', 'leo', 'virgo', 'scorpio'],
    },
    {
      id: '2',
      name: 'Atlantis',
      phoneNumber: '555-0002',
      dialingSequence: ['pegasus', 'cancer', 'pisces', 'virgo', 'leo', 'aquarius', 'scorpio'],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
  });

  it('displays empty state when no saved addresses', async () => {
    StorageService.loadCartouche.mockResolvedValue([]);

    const { getByText } = render(<CartoucheScreen />);

    await waitFor(() => {
      expect(getByText('No saved addresses.')).toBeTruthy();
    });
  });

  it('renders FlatList with saved addresses', async () => {
    StorageService.loadCartouche.mockResolvedValue(mockEntries);

    const { getByText } = render(<CartoucheScreen />);

    await waitFor(() => {
      expect(getByText('Earth')).toBeTruthy();
      expect(getByText('555-0001')).toBeTruthy();
      expect(getByText('Atlantis')).toBeTruthy();
      expect(getByText('555-0002')).toBeTruthy();
    });
  });

  it('deletes entry when delete button pressed', async () => {
    StorageService.loadCartouche
      .mockResolvedValueOnce(mockEntries)
      .mockResolvedValueOnce([mockEntries[1]]); // After delete

    StorageService.deleteCartoucheEntry.mockResolvedValue(undefined);

    const { getByTestId, queryByText } = render(<CartoucheScreen />);

    await waitFor(() => {
      expect(getByTestId('delete-btn-1')).toBeTruthy();
    });

    fireEvent.press(getByTestId('delete-btn-1'));

    await waitFor(() => {
      expect(StorageService.deleteCartoucheEntry).toHaveBeenCalledWith('1');
    });
  });

  it('navigates to DHD screen with auto-dial params when re-dial pressed', async () => {
    StorageService.loadCartouche.mockResolvedValue(mockEntries);

    const { getByTestId } = render(<CartoucheScreen />);

    await waitFor(() => {
      expect(getByTestId('redial-btn-1')).toBeTruthy();
    });

    fireEvent.press(getByTestId('redial-btn-1'));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/',
      params: {
        autoDialSequence: JSON.stringify(mockEntries[0].dialingSequence),
      },
    });
  });

  it('handles storage load errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    StorageService.loadCartouche.mockRejectedValue(new Error('Storage error'));

    const { getByText } = render(<CartoucheScreen />);

    await waitFor(() => {
      expect(getByText('No saved addresses.')).toBeTruthy();
    });

    consoleErrorSpy.mockRestore();
  });

  it('renders with correct keys for FlatList items', async () => {
    StorageService.loadCartouche.mockResolvedValue(mockEntries);

    const { getByTestId } = render(<CartoucheScreen />);

    await waitFor(() => {
      expect(getByTestId('cartouche-item-1')).toBeTruthy();
      expect(getByTestId('cartouche-item-2')).toBeTruthy();
    });
  });
});
