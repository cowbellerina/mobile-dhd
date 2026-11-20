enum DialingConfig {
    /// Standard Milky Way gate addresses use 7 glyphs.
    static let maxSequenceLength = 7
}

enum SequenceValidation {
    /// Whether the sequence is complete and the dome should be active.
    static func isComplete(_ sequence: DialingSequence) -> Bool {
        sequence.count == DialingConfig.maxSequenceLength
    }

    /// Whether a sequence is a valid complete address (e.g. one passed in for re-dialing).
    static func isValid(_ sequence: DialingSequence?) -> Bool {
        guard let sequence else { return false }
        return isComplete(sequence)
    }

    /// Whether two sequences are identical, including order.
    static func matches(_ lhs: DialingSequence, _ rhs: DialingSequence) -> Bool {
        lhs == rhs
    }
}
