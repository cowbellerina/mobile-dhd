import SwiftUI
import UIKit
import XCTest
@testable import DHD

/// The Blender renders (scripts/render_dhd.sh) must line up with `DHDArtwork`'s vector paths, which the app clips
/// the lit layers to and hit-tests against. A render that drifts lights pixels outside the keys or leaves keys dark.
final class DHDRenderAlignmentTests: XCTestCase {
    private static let side = 512
    private static let changeThreshold = 0.08

    func testRenderedLayersExistAndAreSquare2048() throws {
        for name in ["DHDBase", "DHDKeysLit", "DHDDomeLit"] {
            let image = try XCTUnwrap(UIImage(named: name), name)
            XCTAssertEqual(image.size.width * image.scale, 2048, name)
            XCTAssertEqual(image.size.height * image.scale, 2048, name)
        }
    }

    func testLitKeysDifferOnlyInsideKeyPaths() throws {
        let changed = try changedPixels(lit: "DHDKeysLit")
        let keys = mask { context in
            for key in DHDArtwork.keys {
                fill(key.hitArea, dilatedBy: 4, in: context)
            }
        }
        assertMostlyInside(changed, keys, minimumFraction: 0.97)
    }

    /// A dialed key lights its outer rim (the base plate around the raised panel), as in the Expo app's gold plate.
    func testEveryKeyRimLightsUp() throws {
        let changed = try changedPixels(lit: "DHDKeysLit")
        for key in DHDArtwork.keys {
            let rim = and(mask { fill(key.hitArea, dilatedBy: 0, in: $0) },
                          not(mask { fill(panel(of: key), dilatedBy: 1, in: $0) }))
            assertFraction(of: rim, in: changed, atLeast: 0.5, key.slug)
        }
    }

    /// A dialed key's engraved glyph glows.
    func testEveryKeyGlyphLightsUp() throws {
        let changed = try changedPixels(lit: "DHDKeysLit")
        for key in DHDArtwork.keys {
            let glyph = mask { context in
                for symbol in symbols(of: key) {
                    fill(symbol, dilatedBy: 0, in: context)
                }
            }
            assertFraction(of: glyph, in: changed, atLeast: 0.5, key.slug)
        }
    }

    /// The raised panel between rim and glyph keeps its unlit metal (held out of `DHDKeysLit`, so the base shows
    /// through); only rim and glyph light up.
    func testKeyPanelsStayUnlit() throws {
        let changed = try changedPixels(lit: "DHDKeysLit")
        for key in DHDArtwork.keys {
            let interior = and(mask { fill(panel(of: key), dilatedBy: 0, in: $0) },
                               not(mask { context in
                                   stroke(panel(of: key), width: 8, in: context)
                                   for symbol in symbols(of: key) {
                                       fill(symbol, dilatedBy: 4, in: context)
                                   }
                               }))
            let total = interior.filter { $0 }.count
            let lit = zip(interior, changed).filter { $0 && $1 }.count
            XCTAssertGreaterThan(total, 0, key.slug)
            XCTAssertLessThanOrEqual(Double(lit) / Double(max(total, 1)), 0.25, key.slug)
        }
    }

    func testDomeLitDiffersOnlyInsideDome() throws {
        let changed = try changedPixels(lit: "DHDDomeLit")
        let dome = mask { fill(DHDArtwork.dome[0].path, dilatedBy: 6, in: $0) }
        XCTAssertGreaterThan(changed.filter { $0 }.count, 0, "dome doesn't light up")
        assertMostlyInside(changed, dome, minimumFraction: 0.97)
    }

    // MARK: - Helpers

    private func panel(of key: DHDKeyArtwork) -> Path {
        key.layers.first { $0.fill == .metallicHighlight }!.path
    }

    private func symbols(of key: DHDKeyArtwork) -> [Path] {
        key.layers.filter { $0.fill == .color(0x505050) }.map(\.path)
    }

    private func and(_ a: [Bool], _ b: [Bool]) -> [Bool] { zip(a, b).map { $0 && $1 } }
    private func not(_ a: [Bool]) -> [Bool] { a.map { !$0 } }

    private func assertFraction(of region: [Bool], in changed: [Bool], atLeast minimum: Double, _ message: String,
                                file: StaticString = #filePath, line: UInt = #line) {
        let total = region.filter { $0 }.count
        let lit = zip(region, changed).filter { $0 && $1 }.count
        XCTAssertGreaterThan(total, 0, message, file: file, line: line)
        XCTAssertGreaterThanOrEqual(Double(lit) / Double(max(total, 1)), minimum, message, file: file, line: line)
    }

    private func stroke(_ path: Path, width: CGFloat, in context: CGContext) {
        context.addPath(path.cgPath)
        context.setLineWidth(width)
        context.strokePath()
    }

    private func assertMostlyInside(_ changed: [Bool], _ mask: [Bool], minimumFraction: Double,
                                    file: StaticString = #filePath, line: UInt = #line) {
        let total = changed.filter { $0 }.count
        let inside = zip(changed, mask).filter { $0 && $1 }.count
        XCTAssertGreaterThan(total, 0, "lit layer doesn't differ from base", file: file, line: line)
        XCTAssertGreaterThanOrEqual(Double(inside) / Double(max(total, 1)), minimumFraction,
                                    "\(total - inside) of \(total) changed pixels are outside the paths",
                                    file: file, line: line)
    }

    /// Pixels where the lit layer, drawn over `DHDBase` as the app draws it, differs from `DHDBase` by more than
    /// `changeThreshold` (RGB distance, 0…1 per channel). Compositing matters: `DHDKeysLit` holds the key panels out
    /// (transparent) so the base's unlit panels show through. Color, not just luminance: a lit key turns from dark iron
    /// to warm copper with only a modest change in brightness.
    private func changedPixels(lit: String) throws -> [Bool] {
        let baseImage = try XCTUnwrap(UIImage(named: "DHDBase"))
        let litImage = try XCTUnwrap(UIImage(named: lit))
        let base = rgb(baseImage)
        let composite = rgb(baseImage, litImage)
        return zip(base, composite).map { a, b in
            let distance = sqrt(pow(a.0 - b.0, 2) + pow(a.1 - b.1, 2) + pow(a.2 - b.2, 2))
            return distance > Self.changeThreshold
        }
    }

    /// The images drawn bottom to top, as RGB.
    private func rgb(_ images: UIImage...) -> [(Double, Double, Double)] {
        let rgba = render { _ in
            for image in images {
                image.draw(in: CGRect(x: 0, y: 0, width: Self.side, height: Self.side))
            }
        }
        return stride(from: 0, to: rgba.count, by: 4).map { i in
            (Double(rgba[i]) / 255, Double(rgba[i + 1]) / 255, Double(rgba[i + 2]) / 255)
        }
    }

    private func mask(_ draw: (CGContext) -> Void) -> [Bool] {
        let rgba = render { context in
            context.concatenate(DHDArtwork.transform(fitting: CGSize(width: Self.side, height: Self.side)))
            context.setFillColor(UIColor.white.cgColor)
            context.setStrokeColor(UIColor.white.cgColor)
            draw(context)
        }
        return stride(from: 0, to: rgba.count, by: 4).map { rgba[$0 + 3] > 127 }
    }

    private func fill(_ path: Path, dilatedBy amount: CGFloat, in context: CGContext) {
        context.addPath(path.cgPath)
        context.fillPath()
        if amount > 0 {
            context.addPath(path.cgPath)
            context.setLineWidth(amount * 2)
            context.strokePath()
        }
    }

    /// Draws into a `side`×`side` RGBA buffer with a top-left origin (UIKit and artwork coordinates).
    private func render(_ draw: (CGContext) -> Void) -> [UInt8] {
        var pixels = [UInt8](repeating: 0, count: Self.side * Self.side * 4)
        pixels.withUnsafeMutableBytes { buffer in
            let context = CGContext(data: buffer.baseAddress, width: Self.side, height: Self.side, bitsPerComponent: 8,
                                    bytesPerRow: Self.side * 4, space: CGColorSpace(name: CGColorSpace.sRGB)!,
                                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
            context.translateBy(x: 0, y: CGFloat(Self.side))
            context.scaleBy(x: 1, y: -1)
            UIGraphicsPushContext(context)
            draw(context)
            UIGraphicsPopContext()
        }
        return pixels
    }
}
