import React from 'react';
import { render } from '@testing-library/react-native';
import ChevronDisplay from '../../components/ChevronDisplay';

describe('ChevronDisplay', () => {
  it('renders 7 chevrons', () => {
    const { getAllByTestId } = render(<ChevronDisplay glyphSlugs={[]} />);
    const chevrons = getAllByTestId(/chevron-\d/);
    expect(chevrons.length).toBe(7);
  });

  it('displays glyph components for all slots', () => {
    const dialedSlugs = ['earth', 'andromeda', 'aquarius'];
    const { getByTestId } = render(<ChevronDisplay glyphSlugs={dialedSlugs} />);
    
    // Check first 3 slots have glyphs (active)
    expect(getByTestId('chevron-glyph-0')).toBeTruthy();
    expect(getByTestId('chevron-glyph-1')).toBeTruthy();
    expect(getByTestId('chevron-glyph-2')).toBeTruthy();

    // Check 4th slot also has a glyph (placeholder)
    expect(getByTestId('chevron-glyph-3')).toBeTruthy();
  });
});