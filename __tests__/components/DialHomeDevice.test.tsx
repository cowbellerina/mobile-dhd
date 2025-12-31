import React from 'react';
import { render } from '@testing-library/react-native';
import { DialHomeDevice } from '../../components/DialHomeDevice';

describe('DialHomeDevice', () => {
  const defaultProps = {
    dialedSlugs: [],
    onGlyphPress: jest.fn(),
    onDomePress: jest.fn(),
    isDomeActive: false,
  };

  it('renders without crashing', () => {
    const { UNSAFE_getByType } = render(<DialHomeDevice {...defaultProps} />);
    const svg = UNSAFE_getByType(require('react-native-svg').Svg);
    expect(svg).toBeTruthy();
  });
});
