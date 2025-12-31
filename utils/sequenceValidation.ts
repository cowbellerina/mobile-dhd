import { MAX_SEQUENCE_LENGTH } from '@/constants/DialingConfig';
import { DialingSequence } from '@/types';

/**
 * Business logic utilities for dialing sequence validation
 */

/**
 * Checks if a sequence is complete and ready for dome activation
 * @param sequence - The current dialing sequence
 * @returns true if the sequence is complete (dome should be active)
 */
export function isSequenceComplete(sequence: DialingSequence): boolean {
  return sequence.length === MAX_SEQUENCE_LENGTH;
}

/**
 * Validates if a sequence is a valid complete address
 * @param sequence - The sequence to validate
 * @returns true if the sequence is valid for dialing
 */
export function isValidDialingSequence(sequence: unknown): boolean {
  if (!Array.isArray(sequence)) {
    return false;
  }
  return sequence.length === MAX_SEQUENCE_LENGTH;
}

/**
 * Checks if two sequences match exactly
 * @param sequence1 - First sequence
 * @param sequence2 - Second sequence
 * @returns true if sequences are identical
 */
export function sequencesMatch(
  sequence1: DialingSequence,
  sequence2: DialingSequence
): boolean {
  if (sequence1.length !== sequence2.length) {
    return false;
  }
  return sequence1.every((slug, index) => slug === sequence2[index]);
}
