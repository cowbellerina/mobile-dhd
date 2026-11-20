import Observation

/// The in-progress sequence being dialed on the DHD. Replaces the Expo app's `useDialing` hook.
@Observable
@MainActor
final class DialingSession {
    private(set) var sequence: DialingSequence = []
    let maxLength: Int

    init(maxLength: Int = DialingConfig.maxSequenceLength) {
        self.maxLength = maxLength
    }

    var isComplete: Bool {
        SequenceValidation.isComplete(sequence)
    }

    /// Adds a glyph unless the sequence is full or the glyph is already dialed.
    /// - Returns: `true` if the glyph was added.
    @discardableResult
    func dial(_ slug: String) -> Bool {
        guard sequence.count < maxLength, !sequence.contains(slug) else { return false }
        sequence.append(slug)
        return true
    }

    func reset() {
        sequence = []
    }
}
