import { ImageSourcePropType } from 'react-native';

/**
 * Represents a static definition of a single Stargate glyph available on the DHD.
 */
export interface Glyph {
  /**
   * A unique identifier for the glyph (e.g., "glyph-taurus").
   * This is used for logic, comparison, and storage.
   */
  slug: string;

  /**
   * A human-readable name for the glyph (e.g., "Taurus").
   */
  name: string;
}

/**
 * Represents a specific combination of glyphs that make up a gate address.
 * Just an array of strings (slugs).
 */
export type DialingSequence = string[];

/**
 * Represents a single, user-saved mapping between a Stargate address and a real-world phone contact.
 */
export interface CartoucheEntry {
  /**
   * A unique identifier (UUID) for this entry.
   */
  id: string;

  /**
   * The name of the destination/contact (e.g., "General Hammond").
   */
  name: string;

  /**
   * The phone number to be dialed.
   */
  phoneNumber: string;

  /**
   * The 7-glyph sequence (stored as slugs) associated with this contact.
   */
  dialingSequence: DialingSequence;
}

/**
 * The collection of all saved addresses.
 */
export type Cartouche = CartoucheEntry[];
