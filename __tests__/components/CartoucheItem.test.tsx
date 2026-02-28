import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CartoucheItem from '../../components/CartoucheItem';
import { CartoucheEntry } from '../../types';

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

describe('CartoucheItem', () => {
  const mockEntry: CartoucheEntry = {
    id: '123',
    name: 'Test Name',
    phoneNumber: '555-0000',
    dialingSequence: ['glyph1', 'glyph2', 'glyph3', 'glyph4', 'glyph5', 'glyph6', 'glyph7'],
  };

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <CartoucheItem entry={mockEntry} onDelete={() => {}} onReDial={() => {}} />
    );
    expect(getByText('Test Name')).toBeTruthy();
    expect(getByText('555-0000')).toBeTruthy();
    expect(getByTestId('chevron-display')).toBeTruthy();
    expect(getByTestId('chevron-glyph-glyph1')).toBeTruthy();
    expect(getByTestId('chevron-glyph-glyph7')).toBeTruthy();
  });

  it('calls onDelete when delete button is pressed', () => {
    const onDelete = jest.fn();
    const onReDial = jest.fn();
    const { getByTestId } = render(
      <CartoucheItem entry={mockEntry} onDelete={onDelete} onReDial={onReDial} />
    );
    fireEvent.press(getByTestId('delete-btn-123'));
    expect(onDelete).toHaveBeenCalledWith('123');
    expect(onReDial).not.toHaveBeenCalled();
  });

  it('calls onReDial when re-dial button is pressed', () => {
    const onDelete = jest.fn();
    const onReDial = jest.fn();
    const { getByTestId } = render(
      <CartoucheItem entry={mockEntry} onDelete={onDelete} onReDial={onReDial} />
    );
    fireEvent.press(getByTestId('redial-btn-123'));
    expect(onReDial).toHaveBeenCalledWith('123', mockEntry.dialingSequence);
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('renders with correct test IDs for swipe actions', () => {
    const { getByTestId } = render(
      <CartoucheItem entry={mockEntry} onDelete={() => {}} onReDial={() => {}} />
    );
    expect(getByTestId('cartouche-item-123')).toBeTruthy();
    expect(getByTestId('delete-btn-123')).toBeTruthy();
    expect(getByTestId('redial-btn-123')).toBeTruthy();
  });

  it('displays sequence as glyphs in chevron display', () => {
    const shortEntry: CartoucheEntry = {
      id: '456',
      name: 'Short',
      phoneNumber: '555-1111',
      dialingSequence: ['a', 'b', 'c'],
    };
    const { getByTestId } = render(
      <CartoucheItem entry={shortEntry} onDelete={() => {}} onReDial={() => {}} />
    );
    expect(getByTestId('chevron-display')).toBeTruthy();
    expect(getByTestId('chevron-glyph-a')).toBeTruthy();
    expect(getByTestId('chevron-glyph-b')).toBeTruthy();
    expect(getByTestId('chevron-glyph-c')).toBeTruthy();
  });
});
