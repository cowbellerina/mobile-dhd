import XCTest
@testable import DHD

final class DialingSessionTests: XCTestCase {
    @MainActor func testStartsEmpty() {
        XCTAssertEqual(DialingSession().sequence, [])
    }

    @MainActor func testDialAddsGlyph() {
        let session = DialingSession()
        XCTAssertTrue(session.dial("earth"))
        XCTAssertEqual(session.sequence, ["earth"])
    }

    @MainActor func testDialIgnoresDuplicates() {
        let session = DialingSession()
        session.dial("earth")
        XCTAssertFalse(session.dial("earth"))
        XCTAssertEqual(session.sequence, ["earth"])
    }

    @MainActor func testDialStopsAtMaxLength() {
        let session = DialingSession(maxLength: 3)
        ["1", "2", "3", "4"].forEach { session.dial($0) }
        XCTAssertEqual(session.sequence, ["1", "2", "3"])
    }

    @MainActor func testIsCompleteAtSevenGlyphs() {
        let session = DialingSession()
        Glyph.all.prefix(6).forEach { session.dial($0.slug) }
        XCTAssertFalse(session.isComplete)
        session.dial(Glyph.all[6].slug)
        XCTAssertTrue(session.isComplete)
    }

    @MainActor func testReset() {
        let session = DialingSession()
        session.dial("earth")
        session.reset()
        XCTAssertEqual(session.sequence, [])
    }
}
