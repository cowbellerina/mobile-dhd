// jest-setup.ts
const matchers = require('@testing-library/react-native/matchers');
(global as any).expect.extend(matchers);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-audio', () => ({
  useAudioPlayer: jest.fn(() => ({
    play: jest.fn(),
  })),
}));

jest.mock('expo-contacts', () => ({
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  presentContactPickerAsync: jest.fn(() => Promise.resolve(null)),
}));