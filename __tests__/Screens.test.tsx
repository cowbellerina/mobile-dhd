import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import DialHomeDevice from '../app/(tabs)/index';

jest.mock('../components/DialHomeDevice', () => {
  const { View } = require('react-native');
  return { DialHomeDevice: (props: any) => <View testID="dial-home-device" {...props} /> };
});
jest.mock('../components/ChevronDisplay', () => {
    const { View } = require('react-native');
    return (props: any) => <View testID="chevron-display" {...props} />;
});

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
const mockPlayKawoosh = jest.fn();
jest.mock('../hooks/useDHDSounds', () => ({
    useDHDSounds: () => ({
        playGlyphHit: mockPlayGlyphHit,
        playKawoosh: mockPlayKawoosh,
        playDialAbort: mockPlayDialAbort,
    })
}));

jest.spyOn(require('react-native').Alert, 'alert');

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
});
