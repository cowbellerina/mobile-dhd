import * as Contacts from 'expo-contacts';

/**
 * Extracts a display name from an Expo contact object
 * Handles missing fields gracefully
 * @param contact - The Expo contact object
 * @returns Display name or 'Unknown' if no name available
 */
export function extractContactName(contact: Contacts.Contact): string {
  if (contact.name) {
    return contact.name;
  }

  const nameParts = [
    contact.firstName,
    contact.middleName,
    contact.lastName
  ].filter(part => part && part.trim());

  return nameParts.length > 0
    ? nameParts.join(' ')
    : 'Unknown';
}

/**
 * Extracts primary phone number from contact
 * @param contact - The Expo contact object
 * @returns Phone number or null if no valid phone number exists
 */
export function extractContactPhoneNumber(contact: Contacts.Contact): string | null {
  if (!contact.phoneNumbers || contact.phoneNumbers.length === 0) {
    return null;
  }

  const phoneNumber = contact.phoneNumbers[0].number;
  return phoneNumber || null;
}
