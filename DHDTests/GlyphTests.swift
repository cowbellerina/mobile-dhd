import XCTest
@testable import DHD

final class GlyphTests: XCTestCase {
    func testContainsThirtyEightGlyphs() {
        XCTAssertEqual(Glyph.all.count, 38)
    }

    func testSlugsAreUnique() {
        XCTAssertEqual(Set(Glyph.all.map(\.slug)).count, Glyph.all.count)
    }

    func testLookupBySlug() {
        XCTAssertEqual(Glyph.named("cra")?.name, "Corona Australis")
        XCTAssertNil(Glyph.named("abydos"))
    }
}
