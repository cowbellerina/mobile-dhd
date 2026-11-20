import XCTest
@testable import DHD

final class SequenceValidationTests: XCTestCase {
    private let complete = ["a", "b", "c", "d", "e", "f", "g"]

    func testIsCompleteForSevenGlyphs() {
        XCTAssertTrue(SequenceValidation.isComplete(complete))
    }

    func testIsNotCompleteForShortOrLongSequences() {
        XCTAssertFalse(SequenceValidation.isComplete([]))
        XCTAssertFalse(SequenceValidation.isComplete(["a", "b", "c"]))
        XCTAssertFalse(SequenceValidation.isComplete(complete + ["h"]))
    }

    func testIsValidRejectsNilAndWrongLengths() {
        XCTAssertTrue(SequenceValidation.isValid(complete))
        XCTAssertFalse(SequenceValidation.isValid(nil))
        XCTAssertFalse(SequenceValidation.isValid(["a", "b"]))
    }

    func testMatchesRequiresSameOrder() {
        XCTAssertTrue(SequenceValidation.matches(complete, complete))
        XCTAssertTrue(SequenceValidation.matches([], []))
        XCTAssertFalse(SequenceValidation.matches(complete, complete.reversed()))
        XCTAssertFalse(SequenceValidation.matches(["a", "b", "c"], ["a", "b", "c", "d"]))
        XCTAssertFalse(SequenceValidation.matches(complete, ["a", "b", "c", "x", "y", "z", "g"]))
    }
}
