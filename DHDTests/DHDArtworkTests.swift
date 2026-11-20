import SwiftUI
import XCTest
@testable import DHD

final class DHDArtworkTests: XCTestCase {
    func testHasAKeyForEveryGlyph() {
        XCTAssertEqual(Set(DHDArtwork.keys.map(\.slug)), Set(Glyph.all.map(\.slug)))
        XCTAssertEqual(DHDArtwork.keys.count, Glyph.all.count)
    }

    func testEveryKeyHasBasePlateAndSymbol() {
        for key in DHDArtwork.keys {
            XCTAssertEqual(key.layers.first?.fill, .brushedMetal, key.slug)
            XCTAssertTrue(key.layers.contains { $0.fill == .color(0x505050) }, key.slug)
            XCTAssertFalse(key.layers.contains { $0.path.isEmpty }, key.slug)
        }
    }

    func testTappingEachKeySymbolHitsThatKey() {
        for key in DHDArtwork.keys {
            let symbol = key.layers.last { $0.fill == .color(0x505050) }!.path.boundingRect
            let center = CGPoint(x: symbol.midX, y: symbol.midY)
            XCTAssertEqual(DHDArtwork.target(at: center), .glyph(key.slug), key.slug)
        }
    }

    /// Accessibility elements (and UI tests) tap the center of each key's bounds.
    func testTappingEachKeyBoundsCenterHitsThatKey() {
        for key in DHDArtwork.keys {
            let bounds = key.hitArea.boundingRect
            XCTAssertEqual(DHDArtwork.target(at: CGPoint(x: bounds.midX, y: bounds.midY)), .glyph(key.slug), key.slug)
        }
    }

    func testTappingDomeCenterHitsDome() {
        let dome = DHDArtwork.dome[0].path.boundingRect
        XCTAssertEqual(DHDArtwork.target(at: CGPoint(x: dome.midX, y: dome.midY)), .dome)
    }

    func testTappingOutsideHitsNothing() {
        XCTAssertNil(DHDArtwork.target(at: .zero))
        XCTAssertNil(DHDArtwork.target(at: CGPoint(x: 899, y: 5)))
    }

    func testTransformFitsAndCentersArtwork() {
        let transform = DHDArtwork.transform(fitting: CGSize(width: 450, height: 900))
        let rect = CGRect(origin: .zero, size: DHDArtwork.size).applying(transform)
        XCTAssertEqual(rect, CGRect(x: 0, y: 225, width: 450, height: 450))
    }
}
