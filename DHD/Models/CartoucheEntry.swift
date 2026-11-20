import Foundation

/// A sequence of glyph slugs that make up a gate address.
typealias DialingSequence = [String]

/// A user-saved mapping between a gate address and a phone contact.
///
/// The Codable shape matches the Expo app's JSON (`id`, `name`, `phoneNumber`, `dialingSequence`)
/// so AsyncStorage data can be decoded as-is during migration.
struct CartoucheEntry: Identifiable, Codable, Hashable, Sendable {
    /// UUID string. Kept as `String` because the Expo app stored lowercase UUID strings.
    let id: String
    let name: String
    let phoneNumber: String
    let dialingSequence: DialingSequence
}

/// The collection of all saved addresses.
typealias Cartouche = [CartoucheEntry]
