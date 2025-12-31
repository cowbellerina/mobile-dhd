import { useState, useCallback } from 'react';
import { MAX_SEQUENCE_LENGTH } from '@/constants/DialingConfig';

export function useDialing(maxLength = MAX_SEQUENCE_LENGTH) {
  const [sequence, setSequence] = useState<string[]>([]);

  const dialGlyph = useCallback((slug: string) => {
    setSequence((prev) => {
      if (prev.length >= maxLength) return prev;
      if (prev.includes(slug)) return prev;
      return [...prev, slug];
    });
  }, [maxLength]);

  const reset = useCallback(() => {
    setSequence([]);
  }, []);

  return {
    sequence,
    dialGlyph,
    reset,
  };
}
