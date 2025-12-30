import { Glyph, CartoucheEntry, DialingSequence } from '../types';

describe('Domain Types', () => {
  it('validates a Glyph object', () => {
    const glyph: Glyph = {
      slug: 'test-glyph',
      name: 'Test Glyph',
    };
    expect(glyph.slug).toBe('test-glyph');
  });

  it('validates a CartoucheEntry object', () => {
    const sequence: DialingSequence = ['glyph-1', 'glyph-2'];
    const entry: CartoucheEntry = {
      id: '123',
      name: 'Test Entry',
      phoneNumber: '555-1234',
      dialingSequence: sequence,
    };
    expect(entry.dialingSequence).toHaveLength(2);
  });
});
