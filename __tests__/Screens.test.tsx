import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import DialHomeDevice from '../app/(tabs)/index';
import CartoucheScreen from '../app/(tabs)/cartouche';

// Mock components to avoid complex rendering in screen test
jest.mock('../components/DialHomeDevice', () => {
  const { View } = require('react-native');
  return { DialHomeDevice: (props: any) => <View testID="dial-home-device" {...props} /> };
});
jest.mock('../components/ChevronDisplay', () => {
    const { View } = require('react-native');
    return (props: any) => <View testID="chevron-display" {...props} />;
});

// Mock expo-router
jest.mock('expo-router', () => ({
  useFocusEffect: (callback: any) => {
    const React = require('react');
    React.useEffect(callback, []);
  },
  useLocalSearchParams: jest.fn(() => ({})),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    setParams: jest.fn(),
  })),
}));

// Mock StorageService
jest.mock('../services/StorageService', () => ({
  StorageService: {
    loadCartouche: jest.fn().mockResolvedValue([]),
    deleteCartoucheEntry: jest.fn(),
    saveCartoucheEntry: jest.fn(),
  },
}));

// Spy on audio
const mockPlayDialAbort = jest.fn();
const mockPlayGlyphHit = jest.fn();
jest.mock('../hooks/useDHDSounds', () => ({
    useDHDSounds: () => ({
        playGlyphHit: mockPlayGlyphHit,
        playKawoosh: jest.fn(),
        playDialAbort: mockPlayDialAbort,
    })
}));

// Mock expo-contacts
jest.mock('expo-contacts', () => ({
  requestPermissionsAsync: jest.fn(),
  presentContactPickerAsync: jest.fn(),
}));

// Mock Alert
jest.spyOn(require('react-native').Alert, 'alert');

// Mock useDialing to control sequence
jest.mock('../hooks/useDialing', () => ({
  useDialing: jest.fn(),
}));

describe('Screens', () => {
  const { useDialing } = require('../hooks/useDialing');
  const Contacts = require('expo-contacts');
  const { StorageService } = require('../services/StorageService');
  const { Alert } = require('react-native');

  beforeEach(() => {
    jest.clearAllMocks();
    useDialing.mockReturnValue({
      sequence: [],
      dialGlyph: jest.fn(),
      reset: jest.fn(),
    });
  });

  it('renders DHD screen with keypad and abort button', () => {
    render(<DialHomeDevice />);
    expect(screen.getByTestId('dial-home-device')).toBeTruthy();
    expect(screen.getByTestId('chevron-display')).toBeTruthy();
    expect(screen.getByTestId('abort-button')).toBeTruthy();
  });

  it('saves new destination with constructed name when contact name is missing', async () => {
    const { waitFor } = require('@testing-library/react-native');

    // Setup mocked state
    const mockSequence = ['glyph-1', 'glyph-2', 'glyph-3', 'glyph-4', 'glyph-5', 'glyph-6', 'glyph-7'];
    const mockReset = jest.fn();
    useDialing.mockReturnValue({
      sequence: mockSequence,
      dialGlyph: jest.fn(),
      reset: mockReset,
    });

    // Mock StorageService.saveCartoucheEntry
    // It's already mocked at top level, but we can verify it returns undefined
    StorageService.saveCartoucheEntry.mockResolvedValue(undefined);

    // Mock Alert to simulate pressing "Save"
    Alert.alert.mockImplementation((title: any, message: any, buttons: any) => {
        const saveButton = (buttons || []).find((b: any) => b.text === 'Save');
        if (saveButton) {
            saveButton.onPress();
        }
    });

    // Mock Contacts
    Contacts.requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Contacts.presentContactPickerAsync.mockResolvedValue({
        name: '', // Empty name
        firstName: 'Jack',
        lastName: 'O\'Neill',
        phoneNumbers: [{ number: '555-0199' }]
    });

    const { getByTestId } = render(<DialHomeDevice />);
    const keypad = getByTestId('dial-home-device');

    const onDomePress = keypad.props.onDomePress;
    
    // Execute dome press
    await onDomePress();

    // Verification
    expect(Contacts.requestPermissionsAsync).toHaveBeenCalled();
    expect(Contacts.presentContactPickerAsync).toHaveBeenCalled();
    
    await waitFor(() => {
        expect(StorageService.saveCartoucheEntry).toHaveBeenCalledWith(expect.objectContaining({
            name: "Jack O'Neill", // Constructed name
            phoneNumber: '555-0199',
            dialingSequence: mockSequence
        }));
    });
  });

  describe('Cartouche screen', () => {
    const { useRouter } = require('expo-router');
    const { waitFor } = require('@testing-library/react-native');

    it('renders with empty state', async () => {
      StorageService.loadCartouche.mockResolvedValue([]);
      render(<CartoucheScreen />);

      // Wait for loading to complete
      await waitFor(() => expect(screen.getByText('No saved addresses.')).toBeTruthy());
    });

    it('renders cartouche entries', async () => {
      const mockEntries = [
        {
          id: 'entry1',
          name: 'Abydos',
          phoneNumber: '555-1234',
          dialingSequence: ['gemini', 'aquarius', 'taurus', 'capricorn', 'leo', 'virgo', 'earth'],
        },
        {
          id: 'entry2',
          name: 'Chulak',
          phoneNumber: '555-5678',
          dialingSequence: ['aries', 'pisces', 'cancer', 'scorpio', 'libra', 'sagittarius', 'earth'],
        },
      ];

      StorageService.loadCartouche.mockResolvedValue(mockEntries);
      render(<CartoucheScreen />);

      await waitFor(() => {
        expect(screen.getByText('Abydos')).toBeTruthy();
        expect(screen.getByText('Chulak')).toBeTruthy();
        expect(screen.getByText('555-1234')).toBeTruthy();
        expect(screen.getByText('555-5678')).toBeTruthy();
      });
    });

    it('calls router.push with correct params when handleReDial is triggered', async () => {
      const mockPush = jest.fn();
      useRouter.mockReturnValue({
        push: mockPush,
        setParams: jest.fn(),
      });

      const mockEntries = [
        {
          id: 'entry1',
          name: 'Test Address',
          phoneNumber: '555-0000',
          dialingSequence: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
        },
      ];

      StorageService.loadCartouche.mockResolvedValue(mockEntries);
      const { getByTestId } = render(<CartoucheScreen />);

      await waitFor(() => {
        expect(screen.getByText('Test Address')).toBeTruthy();
      });

      // Simulate pressing re-dial button
      const redialButton = getByTestId('redial-btn-entry1');
      fireEvent.press(redialButton);

      // Verify navigation was called with correct params
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/',
        params: {
          autoDialSequence: JSON.stringify(['a', 'b', 'c', 'd', 'e', 'f', 'g']),
        },
      });
    });

    it('deletes entry when handleDelete is triggered', async () => {
      const mockEntries = [
        {
          id: 'to-delete',
          name: 'Delete Me',
          phoneNumber: '555-9999',
          dialingSequence: ['x', 'y', 'z', 'a', 'b', 'c', 'd'],
        },
      ];

      StorageService.loadCartouche.mockResolvedValue(mockEntries);
      const { getByTestId } = render(<CartoucheScreen />);

      await waitFor(() => {
        expect(screen.getByText('Delete Me')).toBeTruthy();
      });

      // Simulate pressing delete button
      const deleteButton = getByTestId('delete-btn-to-delete');
      fireEvent.press(deleteButton);

      // Verify delete was called
      expect(StorageService.deleteCartoucheEntry).toHaveBeenCalledWith('to-delete');
    });

    it('reloads data after deletion', async () => {
      const mockEntriesBefore = [
        {
          id: 'entry1',
          name: 'First',
          phoneNumber: '555-1111',
          dialingSequence: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
        },
      ];

      const mockEntriesAfter: any[] = [];

      StorageService.loadCartouche
        .mockResolvedValueOnce(mockEntriesBefore)
        .mockResolvedValueOnce(mockEntriesAfter);

      const { getByTestId } = render(<CartoucheScreen />);

      await waitFor(() => {
        expect(screen.getByText('First')).toBeTruthy();
      });

      // Delete entry
      const deleteButton = getByTestId('delete-btn-entry1');
      fireEvent.press(deleteButton);

      // Verify loadCartouche was called again after deletion
      await waitFor(() => {
        expect(StorageService.loadCartouche).toHaveBeenCalledTimes(2);
      });
    });
  });

  it('does not play sound if glyph is already dialed', () => {
    useDialing.mockReturnValue({
      sequence: ['earth'],
      dialGlyph: jest.fn(),
      reset: jest.fn(),
    });
    const { getByTestId } = render(<DialHomeDevice />);
    const keypad = getByTestId('dial-home-device');
    
    // Simulate pressing 'earth'
    keypad.props.onGlyphPress('earth');
    
    expect(mockPlayGlyphHit).not.toHaveBeenCalled();
  });

  it('does not play sound if sequence is full', () => {
     const fullSequence = ['1','2','3','4','5','6','7'];
     useDialing.mockReturnValue({
      sequence: fullSequence,
      dialGlyph: jest.fn(),
      reset: jest.fn(),
    });
    const { getByTestId } = render(<DialHomeDevice />);
    const keypad = getByTestId('dial-home-device');

    // Simulate pressing a new glyph
    keypad.props.onGlyphPress('new-glyph');

    expect(mockPlayGlyphHit).not.toHaveBeenCalled();
  });

  describe('Auto-dial (Re-dial) functionality', () => {
    const { useLocalSearchParams } = require('expo-router');
    const { waitFor } = require('@testing-library/react-native');

    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('auto-dials sequence when autoDialSequence param is provided', async () => {
      const mockDialGlyph = jest.fn();
      const mockReset = jest.fn();
      const testSequence = ['glyph1', 'glyph2', 'glyph3', 'glyph4', 'glyph5', 'glyph6', 'glyph7'];

      useDialing.mockReturnValue({
        sequence: [],
        dialGlyph: mockDialGlyph,
        reset: mockReset,
      });

      useLocalSearchParams.mockReturnValue({
        autoDialSequence: JSON.stringify(testSequence),
      });

      render(<DialHomeDevice />);

      // Advance timers for auto-dial sequence (1000ms * 6 delays between 7 glyphs)
      await waitFor(async () => {
        for (let i = 0; i < 7; i++) {
          jest.advanceTimersByTime(1000);
          await Promise.resolve();
        }
      });

      // Should dial all 7 glyphs
      expect(mockDialGlyph).toHaveBeenCalledTimes(7);
      testSequence.forEach((glyph, index) => {
        expect(mockDialGlyph).toHaveBeenNthCalledWith(index + 1, glyph);
      });

      // Should play sound for each glyph
      expect(mockPlayGlyphHit).toHaveBeenCalledTimes(7);
    });

    it('resets existing sequence before auto-dial', async () => {
      const mockDialGlyph = jest.fn();
      const mockReset = jest.fn();
      const testSequence = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

      useDialing.mockReturnValue({
        sequence: ['existing1', 'existing2'],
        dialGlyph: mockDialGlyph,
        reset: mockReset,
      });

      useLocalSearchParams.mockReturnValue({
        autoDialSequence: JSON.stringify(testSequence),
      });

      render(<DialHomeDevice />);

      // Advance timers for reset (200ms) + auto-dial sequence (1000ms * 6)
      await waitFor(async () => {
        jest.advanceTimersByTime(200); // Reset delay
        await Promise.resolve();
        for (let i = 0; i < 7; i++) {
          jest.advanceTimersByTime(1000);
          await Promise.resolve();
        }
      });

      // Should reset first
      expect(mockReset).toHaveBeenCalled();

      // Then dial new sequence
      expect(mockDialGlyph).toHaveBeenCalledTimes(7);
    });

    it('does not auto-dial if sequence is invalid (not 7 glyphs)', async () => {
      const mockDialGlyph = jest.fn();
      const invalidSequence = ['glyph1', 'glyph2']; // Only 2 glyphs

      // Suppress expected console.error from logger
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      useDialing.mockReturnValue({
        sequence: [],
        dialGlyph: mockDialGlyph,
        reset: jest.fn(),
      });

      useLocalSearchParams.mockReturnValue({
        autoDialSequence: JSON.stringify(invalidSequence),
      });

      render(<DialHomeDevice />);

      await waitFor(() => {
        jest.advanceTimersByTime(100);
      });

      // Should not dial anything
      expect(mockDialGlyph).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('does not auto-dial if sequence is not an array', async () => {
      const mockDialGlyph = jest.fn();

      // Suppress expected console.error from logger
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      useDialing.mockReturnValue({
        sequence: [],
        dialGlyph: mockDialGlyph,
        reset: jest.fn(),
      });

      useLocalSearchParams.mockReturnValue({
        autoDialSequence: JSON.stringify({ invalid: 'data' }),
      });

      render(<DialHomeDevice />);

      await waitFor(() => {
        jest.advanceTimersByTime(100);
      });

      // Should not dial anything
      expect(mockDialGlyph).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('blocks manual glyph presses during auto-dial', async () => {
      const mockDialGlyph = jest.fn();
      const testSequence = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

      useDialing.mockReturnValue({
        sequence: [],
        dialGlyph: mockDialGlyph,
        reset: jest.fn(),
      });

      useLocalSearchParams.mockReturnValue({
        autoDialSequence: JSON.stringify(testSequence),
      });

      const { getByTestId } = render(<DialHomeDevice />);
      const keypad = getByTestId('dial-home-device');

      // Try to manually press a glyph during auto-dial
      keypad.props.onGlyphPress('manual-glyph');

      // Manual press should be blocked (dialGlyph should not be called for manual-glyph)
      expect(mockDialGlyph).not.toHaveBeenCalledWith('manual-glyph');
    });

    it('handles JSON parse errors gracefully', async () => {
      const mockDialGlyph = jest.fn();

      // Suppress expected console.error from logger
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      useDialing.mockReturnValue({
        sequence: [],
        dialGlyph: mockDialGlyph,
        reset: jest.fn(),
      });

      useLocalSearchParams.mockReturnValue({
        autoDialSequence: 'invalid-json{{{',
      });

      const { Alert } = require('react-native');

      render(<DialHomeDevice />);

      await waitFor(() => {
        jest.advanceTimersByTime(100);
      });

      // Should not crash, should not dial
      expect(mockDialGlyph).not.toHaveBeenCalled();

      // Should show error alert
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to auto-dial sequence.');

      consoleSpy.mockRestore();
    });
  });
});
