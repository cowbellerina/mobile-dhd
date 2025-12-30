import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

describe('App', () => {
  it('renders correctly', () => {
    render(<Text>Hello, world!</Text>);
    expect(screen.getByText('Hello, world!')).toBeTruthy();
  });
});