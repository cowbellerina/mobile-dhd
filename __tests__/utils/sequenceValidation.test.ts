import {
  isSequenceComplete,
  isValidDialingSequence,
  sequencesMatch,
} from '../../utils/sequenceValidation';

describe('sequenceValidation', () => {
  describe('isSequenceComplete', () => {
    it('returns true for a complete 7-glyph sequence', () => {
      const sequence = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
      expect(isSequenceComplete(sequence)).toBe(true);
    });

    it('returns false for incomplete sequences', () => {
      expect(isSequenceComplete([])).toBe(false);
      expect(isSequenceComplete(['a', 'b', 'c'])).toBe(false);
      expect(isSequenceComplete(['a', 'b', 'c', 'd', 'e', 'f'])).toBe(false);
    });

    it('returns false for sequences exceeding length', () => {
      const sequence = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      expect(isSequenceComplete(sequence)).toBe(false);
    });

    it('returns false for empty sequence', () => {
      expect(isSequenceComplete([])).toBe(false);
    });
  });

  describe('isValidDialingSequence', () => {
    it('validates correct 7-glyph sequences', () => {
      expect(isValidDialingSequence(['a', 'b', 'c', 'd', 'e', 'f', 'g'])).toBe(true);
    });

    it('rejects non-arrays', () => {
      expect(isValidDialingSequence('not an array')).toBe(false);
      expect(isValidDialingSequence(null)).toBe(false);
      expect(isValidDialingSequence(undefined)).toBe(false);
      expect(isValidDialingSequence(42)).toBe(false);
      expect(isValidDialingSequence({ length: 7 })).toBe(false);
    });

    it('rejects incorrect lengths', () => {
      expect(isValidDialingSequence([])).toBe(false);
      expect(isValidDialingSequence(['a', 'b'])).toBe(false);
      expect(isValidDialingSequence(['a', 'b', 'c', 'd', 'e', 'f'])).toBe(false);
      expect(isValidDialingSequence(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])).toBe(false);
    });

    it('validates sequences with different glyph values', () => {
      expect(isValidDialingSequence(['earth', 'abydos', 'taurus', 'ceti', 'capricorn', 'crater', 'virgo'])).toBe(true);
    });
  });

  describe('sequencesMatch', () => {
    it('returns true for identical sequences', () => {
      const seq1 = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
      const seq2 = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
      expect(sequencesMatch(seq1, seq2)).toBe(true);
    });

    it('returns false for different sequences', () => {
      const seq1 = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
      const seq2 = ['a', 'b', 'c', 'd', 'e', 'f', 'h'];
      expect(sequencesMatch(seq1, seq2)).toBe(false);
    });

    it('returns false for different lengths', () => {
      const seq1 = ['a', 'b', 'c'];
      const seq2 = ['a', 'b', 'c', 'd'];
      expect(sequencesMatch(seq1, seq2)).toBe(false);
    });

    it('returns true for empty sequences', () => {
      expect(sequencesMatch([], [])).toBe(true);
    });

    it('returns false for sequences with same length but different order', () => {
      const seq1 = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
      const seq2 = ['g', 'f', 'e', 'd', 'c', 'b', 'a'];
      expect(sequencesMatch(seq1, seq2)).toBe(false);
    });

    it('returns false for partially matching sequences', () => {
      const seq1 = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
      const seq2 = ['a', 'b', 'c', 'x', 'y', 'z', 'g'];
      expect(sequencesMatch(seq1, seq2)).toBe(false);
    });
  });
});
