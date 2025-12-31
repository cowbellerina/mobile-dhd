import { DialingService } from '../../services/DialingService';

describe('DialingService', () => {
  describe('dialSequence', () => {
    // Happy path
    it('dials phone when match found', async () => {
      const mockOpenPhone = jest.fn();
      const mockLoadCartouche = jest.fn().mockResolvedValue([
        { id: '1', name: 'Earth', phoneNumber: '555-1234', dialingSequence: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] }
      ]);

      const service = new DialingService({
        loadCartouche: mockLoadCartouche,
        openPhone: mockOpenPhone,
      });

      const result = await service.dialSequence(['a', 'b', 'c', 'd', 'e', 'f', 'g']);

      expect(result.match).toBeTruthy();
      expect(result.match).toEqual({ id: '1', name: 'Earth', phoneNumber: '555-1234', dialingSequence: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] });
      expect(mockOpenPhone).toHaveBeenCalledWith('555-1234');
    });

    // Critical edge cases
    it('does not dial when no match found', async () => {
      const mockOpenPhone = jest.fn();
      const mockLoadCartouche = jest.fn().mockResolvedValue([
        { id: '1', name: 'Earth', phoneNumber: '555-1234', dialingSequence: ['x', 'y', 'z', 'a', 'b', 'c', 'd'] }
      ]);

      const service = new DialingService({
        loadCartouche: mockLoadCartouche,
        openPhone: mockOpenPhone,
      });

      const result = await service.dialSequence(['a', 'b', 'c', 'd', 'e', 'f', 'g']);

      expect(result.match).toBeNull();
      expect(mockOpenPhone).not.toHaveBeenCalled();
    });

    it('handles empty cartouche', async () => {
      const mockOpenPhone = jest.fn();
      const mockLoadCartouche = jest.fn().mockResolvedValue([]);

      const service = new DialingService({
        loadCartouche: mockLoadCartouche,
        openPhone: mockOpenPhone,
      });

      const result = await service.dialSequence(['a', 'b', 'c', 'd', 'e', 'f', 'g']);

      expect(result.match).toBeNull();
      expect(mockOpenPhone).not.toHaveBeenCalled();
    });
  });
});
