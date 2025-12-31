import { DialingSequence, CartoucheEntry } from '@/types';
import { StorageService } from './StorageService';
import { sequencesMatch } from '@/utils/sequenceValidation';

export interface DialingDependencies {
  loadCartouche: () => Promise<CartoucheEntry[]>;
  openPhone: (phoneNumber: string) => void;
}

/**
 * Service for cartouche lookup and phone dialing
 * Uses dependency injection for testability
 */
export class DialingService {
  constructor(private deps: DialingDependencies) {}

  /**
   * Finds cartouche entry matching the sequence
   * @param sequence - The dialing sequence to match
   * @returns Matching entry or null if not found
   */
  async findMatchingDestination(
    sequence: DialingSequence
  ): Promise<CartoucheEntry | null> {
    const cartouche = await this.deps.loadCartouche();

    return cartouche.find(entry =>
      sequencesMatch(entry.dialingSequence, sequence)
    ) || null;
  }

  /**
   * Attempts to dial a sequence
   * If match found, initiates phone call
   * @param sequence - The sequence to dial
   * @returns Result indicating match status
   */
  async dialSequence(
    sequence: DialingSequence
  ): Promise<{ match: CartoucheEntry } | { match: null }> {
    const match = await this.findMatchingDestination(sequence);

    if (match) {
      this.deps.openPhone(match.phoneNumber);
      return { match };
    }

    return { match: null };
  }
}

/**
 * Default instance using real dependencies
 * Components use this in production
 */
export const defaultDialingService = new DialingService({
  loadCartouche: () => StorageService.loadCartouche(),
  openPhone: (phoneNumber) => {
    const { Linking } = require('react-native');
    Linking.openURL(`tel:${phoneNumber}`);
  },
});
