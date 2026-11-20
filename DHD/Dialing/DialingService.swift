import UIKit

/// Looks up a dialed sequence in the Cartouche and places the phone call.
/// Dependencies are injected for testability.
struct DialingService: Sendable {
    var loadCartouche: @Sendable () async -> Cartouche
    var openPhone: @Sendable (String) async -> Void

    func findMatchingDestination(for sequence: DialingSequence) async -> CartoucheEntry? {
        await loadCartouche().first { SequenceValidation.matches($0.dialingSequence, sequence) }
    }

    /// Dials the matching contact, if any.
    /// - Returns: The matched entry, or `nil` if the address is unknown.
    func dial(_ sequence: DialingSequence) async -> CartoucheEntry? {
        guard let match = await findMatchingDestination(for: sequence) else { return nil }
        await openPhone(match.phoneNumber)
        return match
    }
}

extension DialingService {
    /// Opens the system dialer with `tel:`. Characters not allowed in a URL (spaces etc.) are stripped.
    @MainActor
    static func openTelURL(_ phoneNumber: String) {
        let allowed = CharacterSet(charactersIn: "+*#0123456789")
        let digits = String(phoneNumber.unicodeScalars.filter(allowed.contains))
        guard !digits.isEmpty, let url = URL(string: "tel:\(digits)") else { return }
        UIApplication.shared.open(url)
    }
}
