import Foundation
import Observation

/// Drives the DHD screen: dialing glyphs, engaging the gate, and saving unknown addresses.
/// Replaces the logic in the Expo app's `app/(tabs)/index.tsx`.
@Observable
@MainActor
final class DHDViewModel {
    enum Alert: Equatable {
        case unknownAddress
        case saved(name: String)
        case error(String)

        var title: String {
            switch self {
            case .unknownAddress: "Unknown Address"
            case .saved: "Saved"
            case .error: "Error"
            }
        }

        /// The case without its associated value, to tell which presentation shows it.
        enum Kind { case unknownAddress, saved, error }

        var kind: Kind {
            switch self {
            case .unknownAddress: .unknownAddress
            case .saved: .saved
            case .error: .error
            }
        }

        var message: String {
            switch self {
            case .unknownAddress: "No destination found for this sequence. Save it to a contact to dial them with it."
            case .saved(let name): "\(name) added to Cartouche."
            case .error(let message): message
            }
        }
    }

    let session = DialingSession()
    var alert: Alert?
    /// The delayed reset after a successful dial. Exposed so tests can await it.
    private(set) var pendingReset: Task<Void, Never>?
    /// A re-dial from the Cartouche in progress. Exposed so tests can await it.
    private(set) var pendingAutoDial: Task<Void, Never>?
    /// True from a dome tap until the dial resolves (the wormhole holds until the reset).
    private(set) var isEngaged = false
    /// Bumped on each established wormhole and each failed dial, to trigger effects and haptics in the view.
    private(set) var wormholes = 0
    private(set) var failedDials = 0

    private let dialingService: DialingService
    private let storage: CartoucheStorage
    private let feedback: DHDFeedback
    private let pickContact: @MainActor () async -> PickedContact?
    private let sleep: @Sendable (Duration) async throws -> Void

    init(dialingService: DialingService,
         storage: CartoucheStorage,
         feedback: DHDFeedback,
         pickContact: @escaping @MainActor () async -> PickedContact?,
         sleep: @escaping @Sendable (Duration) async throws -> Void = { try await Task.sleep(for: $0) }) {
        self.dialingService = dialingService
        self.storage = storage
        self.feedback = feedback
        self.pickContact = pickContact
        self.sleep = sleep
    }

    static func live() -> DHDViewModel {
        let storage = CartoucheStorage.live
        return DHDViewModel(
            dialingService: DialingService(
                loadCartouche: { storage.loadOrEmpty() },
                openPhone: { await DialingService.openTelURL($0) }
            ),
            storage: storage,
            feedback: LiveDHDFeedback(),
            pickContact: { await ContactPicker.pick() }
        )
    }

    var sequence: DialingSequence { session.sequence }
    var isDomeActive: Bool { session.isComplete }

    func glyphTapped(_ slug: String) {
        guard !isEngaged, pendingAutoDial == nil, session.dial(slug) else { return }
        feedback.glyphEncoded()
    }

    /// Dials the matching contact, or offers to save an unknown address.
    func domeTapped() async {
        guard session.isComplete, !isEngaged, pendingAutoDial == nil else { return }
        isEngaged = true

        if await dialingService.dial(session.sequence) != nil {
            feedback.wormholeEstablished()
            wormholes += 1
            pendingReset = Task { [sleep] in
                try? await sleep(Theme.Timing.resetAfterDial)
                guard !Task.isCancelled else { return }
                self.reset()
            }
        } else {
            feedback.dialFailed()
            failedDials += 1
            isEngaged = false
            alert = .unknownAddress
        }
    }

    /// Picks a contact and saves the current address for it.
    func saveAddress() async {
        guard session.isComplete, let contact = await pickContact() else { return }
        let entry = CartoucheEntry(
            id: UUID().uuidString.lowercased(),
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            dialingSequence: session.sequence
        )
        do {
            try storage.add(entry)
            session.reset()
            alert = .saved(name: entry.name)
        } catch {
            Log.storage.error("Failed to save address: \(error.localizedDescription, privacy: .public)")
            alert = .error("Failed to save address.")
        }
    }

    /// Re-dials a saved address glyph by glyph, like the Expo app's `autoDialSequence`. The user then taps the dome.
    func startAutoDial(_ sequence: DialingSequence) {
        guard SequenceValidation.isValid(sequence) else {
            Log.dialing.error("Ignoring invalid auto-dial sequence of \(sequence.count) glyphs")
            return
        }
        reset()
        pendingAutoDial = Task { await autoDial(sequence) }
    }

    private func autoDial(_ sequence: DialingSequence) async {
        do {
            // Let the tab switch settle before the first glyph.
            try await sleep(Theme.Timing.autoDialStartDelay)
            for (index, slug) in sequence.enumerated() {
                if index > 0 {
                    try await sleep(Theme.Timing.autoDialInterval)
                }
                try Task.checkCancellation()
                if session.dial(slug) {
                    feedback.glyphEncoded()
                }
            }
            pendingAutoDial = nil
        } catch {
            // Cancelled by reset(), which already cleared the state.
        }
    }

    /// Clears the dialed sequence and stops any auto-dial (the ✕ button, or cancelling the save prompt).
    func reset() {
        pendingReset?.cancel()
        pendingReset = nil
        pendingAutoDial?.cancel()
        pendingAutoDial = nil
        isEngaged = false
        session.reset()
    }
}
