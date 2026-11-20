import Contacts

enum ContactHelpers {
    /// Display name for a contact, falling back to "Unknown" when no name fields are set.
    static func name(of contact: CNContact) -> String {
        let parts = [contact.givenName, contact.middleName, contact.familyName]
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }
        if !parts.isEmpty {
            return parts.joined(separator: " ")
        }
        if !contact.organizationName.isEmpty {
            return contact.organizationName
        }
        return "Unknown"
    }

    /// The contact's first phone number, or `nil` if it has none.
    static func primaryPhoneNumber(of contact: CNContact) -> String? {
        guard let number = contact.phoneNumbers.first?.value.stringValue, !number.isEmpty else {
            return nil
        }
        return number
    }
}
