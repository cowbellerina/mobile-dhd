import { extractContactName, extractContactPhoneNumber } from '../../utils/contactHelpers';
import * as Contacts from 'expo-contacts';

describe('contactHelpers', () => {
  describe('extractContactName', () => {
    // Happy path
    it('returns name field when present', () => {
      const contact = { name: 'John Doe' } as Contacts.Contact;
      expect(extractContactName(contact)).toBe('John Doe');
    });

    it('constructs name from first and last name', () => {
      const contact = {
        firstName: 'John',
        lastName: 'Doe'
      } as Contacts.Contact;
      expect(extractContactName(contact)).toBe('John Doe');
    });

    // Critical edge case
    it('returns Unknown when no name fields present', () => {
      const contact = {} as Contacts.Contact;
      expect(extractContactName(contact)).toBe('Unknown');
    });
  });

  describe('extractContactPhoneNumber', () => {
    // Happy path
    it('returns first phone number when present', () => {
      const contact = {
        phoneNumbers: [{ number: '555-1234' }]
      } as Contacts.Contact;
      expect(extractContactPhoneNumber(contact)).toBe('555-1234');
    });

    // Critical edge cases
    it('returns null when phoneNumbers array is empty', () => {
      const contact = { phoneNumbers: [] } as Contacts.Contact;
      expect(extractContactPhoneNumber(contact)).toBeNull();
    });

    it('returns null when phoneNumbers is undefined', () => {
      const contact = {} as Contacts.Contact;
      expect(extractContactPhoneNumber(contact)).toBeNull();
    });
  });
});
