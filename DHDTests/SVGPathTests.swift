import SwiftUI
import XCTest
@testable import DHD

final class SVGPathTests: XCTestCase {
    private func bounds(_ d: String) throws -> CGRect {
        try SVGPath.parse(d).boundingRect
    }

    private func assertRect(_ rect: CGRect, _ expected: CGRect, accuracy: CGFloat = 0.01,
                            file: StaticString = #filePath, line: UInt = #line) {
        XCTAssertEqual(rect.minX, expected.minX, accuracy: accuracy, "minX", file: file, line: line)
        XCTAssertEqual(rect.minY, expected.minY, accuracy: accuracy, "minY", file: file, line: line)
        XCTAssertEqual(rect.width, expected.width, accuracy: accuracy, "width", file: file, line: line)
        XCTAssertEqual(rect.height, expected.height, accuracy: accuracy, "height", file: file, line: line)
    }

    func testAbsoluteLines() throws {
        assertRect(try bounds("M10 20 L30 20 L30 50 Z"), CGRect(x: 10, y: 20, width: 20, height: 30))
    }

    func testRelativeCommandsAndImplicitLineto() throws {
        // After `m`, extra pairs are relative linetos.
        assertRect(try bounds("m10 10 20 0 0 20z"), CGRect(x: 10, y: 10, width: 20, height: 20))
    }

    func testHorizontalAndVerticalLines() throws {
        assertRect(try bounds("M0 0H10V5h-20v10"), CGRect(x: -10, y: 0, width: 20, height: 15))
    }

    func testCompactNumberSyntax() throws {
        // `-5.275` follows `0.411` without a separator; `.5.5` is two numbers.
        let path = try SVGPath.parse("M1 1l0.411-5.275l.5.5")
        XCTAssertEqual(path.currentPoint!.x, 1.911, accuracy: 0.0001)
        XCTAssertEqual(path.currentPoint!.y, -3.775, accuracy: 0.0001)
    }

    func testExponentNumbers() throws {
        let path = try SVGPath.parse("M1e1 2E-1")
        XCTAssertEqual(path.currentPoint!.x, 10, accuracy: 0.0001)
        XCTAssertEqual(path.currentPoint!.y, 0.2, accuracy: 0.0001)
    }

    func testCubicAndSmoothCubic() throws {
        // Two mirrored cubic arches whose control points bound the curve at y = -75 (3/4 of the control height).
        let rect = try bounds("M0 0C0-100 100-100 100 0S200 100 200 0")
        XCTAssertEqual(rect.minY, -75, accuracy: 0.01)
        XCTAssertEqual(rect.maxY, 75, accuracy: 0.01)
    }

    func testQuadraticAndSmoothQuadratic() throws {
        let rect = try bounds("M0 0Q50-100 100 0T200 0")
        XCTAssertEqual(rect.minY, -50, accuracy: 0.01)
        XCTAssertEqual(rect.maxY, 50, accuracy: 0.01)
    }

    func testArcCircle() throws {
        // Two half-circle arcs: a circle of radius 50 centered at (50, 0).
        assertRect(try bounds("M0 0A50 50 0 0 1 100 0A50 50 0 0 1 0 0"), CGRect(x: 0, y: -50, width: 100, height: 100))
    }

    func testArcFlagsWithoutSeparators() throws {
        let packed = try SVGPath.parse("M0 0a50 50 0 01100 0")
        let spaced = try SVGPath.parse("M0 0a50 50 0 0 1 100 0")
        assertRect(packed.boundingRect, spaced.boundingRect)
        XCTAssertEqual(packed.currentPoint, CGPoint(x: 100, y: 0))
    }

    func testArcSweepFlagChoosesSide() throws {
        XCTAssertEqual(try bounds("M0 0A50 50 0 0 1 100 0").minY, -50, accuracy: 0.01)
        XCTAssertEqual(try bounds("M0 0A50 50 0 0 0 100 0").maxY, 50, accuracy: 0.01)
    }

    func testArcRadiiScaledUpWhenTooSmall() throws {
        // Radius 10 can't span 100 units, so it is scaled to 50: a half circle.
        XCTAssertEqual(try bounds("M0 0A10 10 0 0 1 100 0").minY, -50, accuracy: 0.01)
    }

    func testRejectsInvalidData() {
        XCTAssertThrowsError(try SVGPath.parse("10 10"))
        XCTAssertThrowsError(try SVGPath.parse("M10"))
        XCTAssertThrowsError(try SVGPath.parse("M0 0A5 5 0 2 1 10 10"))
    }

    func testAllArtworkPathsParse() throws {
        let allData = try String(contentsOf: generatedArtworkURL(), encoding: .utf8)
        let regex = try NSRegularExpression(pattern: #"d: "([^"]+)""#)
        let matches = regex.matches(in: allData, range: NSRange(allData.startIndex..., in: allData))
        XCTAssertGreaterThan(matches.count, 200)
        for match in matches {
            let d = String(allData[Range(match.range(at: 1), in: allData)!])
            XCTAssertNoThrow(try SVGPath.parse(d), d)
        }
    }

    private func generatedArtworkURL() -> URL {
        URL(filePath: #filePath)
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .appending(path: "DHD/Artwork/DHDArtwork+Paths.swift")
    }
}
