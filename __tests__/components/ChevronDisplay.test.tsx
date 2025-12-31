import React from 'react';
import { render } from '@testing-library/react-native';
import ChevronDisplay from '../../components/ChevronDisplay';

describe('ChevronDisplay', () => {
  it('displays glyph components for all slots', () => {
    const dialedSlugs = ['earth', 'andromeda', 'aquarius'];
    const { getByTestId } = render(<ChevronDisplay glyphSlugs={dialedSlugs} />);
    
    // Check first 3 slots have glyphs (active)
    expect(getByTestId('chevron-glyph-earth')).toBeTruthy();
    expect(getByTestId('chevron-glyph-andromeda')).toBeTruthy();
    expect(getByTestId('chevron-glyph-aquarius')).toBeTruthy();

    // Check the remaining slot have a placeholder
    expect(getByTestId('chevron-glyph-placeholder-4')).toBeTruthy();
    expect(getByTestId('chevron-glyph-placeholder-5')).toBeTruthy();
    expect(getByTestId('chevron-glyph-placeholder-6')).toBeTruthy();
    expect(getByTestId('chevron-glyph-placeholder-7')).toBeTruthy();
  });
});
