import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Index from '../../app/(tabs)/index';

describe('DHDScreen', () => {
  it('renders DHD screen with all components', () => {
    const { getByTestId } = render(<Index />);

    expect(getByTestId('chevron-display')).toBeTruthy();
    expect(getByTestId('dial-home-device')).toBeTruthy();
    expect(getByTestId('abort-button')).toBeTruthy();
  });
});
