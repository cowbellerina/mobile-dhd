import { GLYPHS } from '../../constants/Glyphs';

describe('Glyphs', () => {
  it('should contain 38 glyphs', () => {
    expect(GLYPHS.length).toBe(38);
  });

  it('should have unique slugs', () => {
    const slugs = GLYPHS.map(g => g.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });
});
