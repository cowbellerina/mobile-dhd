import { renderHook, act } from '@testing-library/react-native';
import { useDialing } from '../../hooks/useDialing';

describe('useDialing', () => {
  it('starts with an empty sequence', () => {
    const { result } = renderHook(() => useDialing());
    expect(result.current.sequence).toEqual([]);
  });

  it('adds a glyph to the sequence', () => {
    const { result } = renderHook(() => useDialing());
    act(() => {
      result.current.dialGlyph('test-glyph');
    });
    expect(result.current.sequence).toEqual(['test-glyph']);
  });

  it('does not add duplicate glyphs', () => {
    const { result } = renderHook(() => useDialing());
    act(() => {
      result.current.dialGlyph('test-glyph');
      result.current.dialGlyph('test-glyph');
    });
    expect(result.current.sequence).toEqual(['test-glyph']);
  });

  it('does not add more than maxLength glyphs', () => {
    const { result } = renderHook(() => useDialing(3));
    act(() => {
      result.current.dialGlyph('1');
      result.current.dialGlyph('2');
      result.current.dialGlyph('3');
      result.current.dialGlyph('4');
    });
    expect(result.current.sequence).toEqual(['1', '2', '3']);
  });

  it('resets the sequence', () => {
    const { result } = renderHook(() => useDialing());
    act(() => {
      result.current.dialGlyph('test-glyph');
      result.current.reset();
    });
    expect(result.current.sequence).toEqual([]);
  });
});
