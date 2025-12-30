import { useState, useCallback } from 'react';

export function useDialing(maxLength = 7) {
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
