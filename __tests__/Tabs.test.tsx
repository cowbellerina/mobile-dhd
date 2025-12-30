import React from 'react';
import { render } from '@testing-library/react-native';
import TabLayout from '../app/(tabs)/_layout';

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock expo-router
jest.mock('expo-router', () => {
  const React = require('react');
  const View = require('react-native').View;
  
  const Tabs = ({ children }: { children: any }) => {
    return <View testID="tabs">{children}</View>;
  };
  
  Tabs.Screen = ({ name, options }: { name: string; options: any }) => {
    return <View testID={`tab-${name}`} options={options} />;
  };
  
  return { Tabs };
});

describe('TabLayout', () => {
  it('renders DHD and Cartouche tabs', () => {
    const { getByTestId } = render(<TabLayout />);
    
    expect(getByTestId('tabs')).toBeTruthy();
    expect(getByTestId('tab-index')).toBeTruthy();
    expect(getByTestId('tab-cartouche')).toBeTruthy();
  });
});
