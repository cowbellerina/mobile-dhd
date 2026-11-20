import SwiftUI
import XCTest
@testable import DHD

final class ChevronArtworkTests: XCTestCase {
    func testHasChevronForEveryGlyph() {
        XCTAssertEqual(Set(ChevronArtwork.glyphData.keys), Set(Glyph.all.map(\.slug)))
    }

    func testEveryChevronParsesAndHasASymbol() {
        for glyph in Glyph.all {
            let paths = ChevronArtwork.paths(for: glyph.slug)
            // The frame plus at least one symbol path.
            XCTAssertGreaterThanOrEqual(paths.count, 2, glyph.slug)
            XCTAssertFalse(paths.contains { $0.isEmpty }, glyph.slug)
        }
    }

    func testAtlasHasOneTilePerGlyphPlusPlaceholder() {
        XCTAssertEqual(ChevronArtwork.atlasOrder.first, "placeholder")
        XCTAssertEqual(Set(ChevronArtwork.atlasOrder.dropFirst()), Set(Glyph.all.map(\.slug)))
        XCTAssertEqual(ChevronArtwork.atlasOrder.count, Glyph.all.count + 1)
    }

    func testAtlasTilesAreDistinctAndInsideTheAtlas() {
        let bounds = CGRect(origin: .zero, size: ChevronArtwork.atlasSize)
        let tiles = ChevronArtwork.atlasOrder.map { ChevronArtwork.atlasTile(for: $0) }
        XCTAssertEqual(Set(tiles.map { "\($0.minX),\($0.minY)" }).count, tiles.count)
        for tile in tiles {
            XCTAssertTrue(bounds.contains(tile), "\(tile)")
            XCTAssertEqual(tile.size, CGSize(width: 72, height: 72))
        }
        XCTAssertEqual(ChevronArtwork.atlasTile(for: nil), ChevronArtwork.atlasTile(for: "placeholder"))
        XCTAssertEqual(ChevronArtwork.atlasTile(for: "abydos"), ChevronArtwork.atlasTile(for: nil))
    }

    func testEmptyOrUnknownSlugShowsPlaceholderFrame() {
        let frame = ChevronArtwork.placeholder.paths
        XCTAssertEqual(ChevronArtwork.paths(for: nil).count, frame.count)
        XCTAssertEqual(ChevronArtwork.paths(for: "abydos").count, frame.count)
        XCTAssertEqual(frame.first?.boundingRect, CGRect(x: 0, y: 0, width: 72, height: 72))
    }
}
