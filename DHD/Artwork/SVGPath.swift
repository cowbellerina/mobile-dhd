import SwiftUI

/// Parses SVG path data (the `d` attribute) into a SwiftUI `Path`.
///
/// Supports all SVG 1.1 path commands in absolute and relative form: M L H V C S Q T A Z.
/// Arcs are converted to cubic Béziers.
enum SVGPath {
    struct ParseError: Error, Equatable {
        let offset: Int
        let reason: String
    }

    static func parse(_ data: String) throws -> Path {
        var parser = Parser(bytes: Array(data.utf8))
        return try parser.parse()
    }
}

private struct Parser {
    let bytes: [UInt8]
    var index = 0
    var path = Path()
    var current = CGPoint.zero
    var subpathStart = CGPoint.zero
    /// Reflected control point for S/s and T/t.
    var lastCubicControl: CGPoint?
    var lastQuadControl: CGPoint?

    init(bytes: [UInt8]) {
        self.bytes = bytes
    }

    mutating func parse() throws -> Path {
        skipSeparators()
        var command: UInt8?
        while index < bytes.count {
            if isCommand(bytes[index]) {
                command = bytes[index]
                index += 1
            } else if command == nil {
                throw error("Path must start with a command")
            }
            guard let active = command else { break }
            try apply(active)
            // After a moveto, further coordinate pairs are implicit linetos.
            if active == UInt8(ascii: "M") { command = UInt8(ascii: "L") }
            if active == UInt8(ascii: "m") { command = UInt8(ascii: "l") }
            if active == UInt8(ascii: "Z") || active == UInt8(ascii: "z") { command = nil }
            skipSeparators()
        }
        return path
    }

    mutating func apply(_ command: UInt8) throws {
        let relative = command >= UInt8(ascii: "a")
        let origin = relative ? current : .zero
        var cubicControl: CGPoint?
        var quadControl: CGPoint?

        switch command | 0x20 { // lowercase
        case UInt8(ascii: "m"):
            current = try point(from: origin)
            subpathStart = current
            path.move(to: current)
        case UInt8(ascii: "l"):
            current = try point(from: origin)
            path.addLine(to: current)
        case UInt8(ascii: "h"):
            current.x = try number() + (relative ? current.x : 0)
            path.addLine(to: current)
        case UInt8(ascii: "v"):
            current.y = try number() + (relative ? current.y : 0)
            path.addLine(to: current)
        case UInt8(ascii: "c"):
            let control1 = try point(from: origin)
            let control2 = try point(from: origin)
            current = try point(from: origin)
            path.addCurve(to: current, control1: control1, control2: control2)
            cubicControl = control2
        case UInt8(ascii: "s"):
            let control1 = reflect(lastCubicControl)
            let control2 = try point(from: origin)
            current = try point(from: origin)
            path.addCurve(to: current, control1: control1, control2: control2)
            cubicControl = control2
        case UInt8(ascii: "q"):
            let control = try point(from: origin)
            current = try point(from: origin)
            path.addQuadCurve(to: current, control: control)
            quadControl = control
        case UInt8(ascii: "t"):
            let control = reflect(lastQuadControl)
            current = try point(from: origin)
            path.addQuadCurve(to: current, control: control)
            quadControl = control
        case UInt8(ascii: "a"):
            let radiusX = try number()
            let radiusY = try number()
            let rotation = try number()
            let largeArc = try flag()
            let sweep = try flag()
            let end = try point(from: origin)
            path.addSVGArc(from: current, to: end, radiusX: radiusX, radiusY: radiusY,
                           rotationDegrees: rotation, largeArc: largeArc, sweep: sweep)
            current = end
        case UInt8(ascii: "z"):
            path.closeSubpath()
            current = subpathStart
        default:
            throw error("Unknown command '\(Character(UnicodeScalar(command)))'")
        }
        lastCubicControl = cubicControl
        lastQuadControl = quadControl
    }

    func reflect(_ control: CGPoint?) -> CGPoint {
        guard let control else { return current }
        return CGPoint(x: 2 * current.x - control.x, y: 2 * current.y - control.y)
    }

    mutating func point(from origin: CGPoint) throws -> CGPoint {
        let x = try number()
        let y = try number()
        return CGPoint(x: origin.x + x, y: origin.y + y)
    }

    /// Arc flags may be written without separators, e.g. `a5 5 0 011 1`.
    mutating func flag() throws -> Bool {
        skipSeparators()
        guard index < bytes.count, bytes[index] == UInt8(ascii: "0") || bytes[index] == UInt8(ascii: "1") else {
            throw error("Expected arc flag")
        }
        defer { index += 1 }
        return bytes[index] == UInt8(ascii: "1")
    }

    /// Scans an SVG number. Handles implicit separators such as `0.411-5.275` and `.5.5` (two numbers).
    mutating func number() throws -> CGFloat {
        skipSeparators()
        let start = index
        if index < bytes.count, bytes[index] == UInt8(ascii: "-") || bytes[index] == UInt8(ascii: "+") { index += 1 }
        var digits = skipDigits()
        if index < bytes.count, bytes[index] == UInt8(ascii: ".") {
            index += 1
            digits += skipDigits()
        }
        guard digits > 0 else { throw error("Expected number") }
        if index < bytes.count, bytes[index] == UInt8(ascii: "e") || bytes[index] == UInt8(ascii: "E") {
            index += 1
            if index < bytes.count, bytes[index] == UInt8(ascii: "-") || bytes[index] == UInt8(ascii: "+") {
                index += 1
            }
            guard skipDigits() > 0 else { throw error("Expected exponent") }
        }
        guard let value = Double(String(decoding: bytes[start..<index], as: UTF8.self)) else {
            throw error("Invalid number")
        }
        return CGFloat(value)
    }

    mutating func skipDigits() -> Int {
        let start = index
        while index < bytes.count, (UInt8(ascii: "0")...UInt8(ascii: "9")).contains(bytes[index]) { index += 1 }
        return index - start
    }

    mutating func skipSeparators() {
        while index < bytes.count, [0x20, 0x09, 0x0A, 0x0D, UInt8(ascii: ",")].contains(bytes[index]) { index += 1 }
    }

    func isCommand(_ byte: UInt8) -> Bool {
        "MmLlHhVvCcSsQqTtAaZz".utf8.contains(byte)
    }

    func error(_ reason: String) -> SVGPath.ParseError {
        SVGPath.ParseError(offset: index, reason: reason)
    }
}

extension Path {
    /// Appends an SVG elliptical arc (endpoint parameterization, SVG 1.1 appendix F.6) as cubic Béziers.
    mutating func addSVGArc(from start: CGPoint, to end: CGPoint, radiusX: CGFloat, radiusY: CGFloat,
                            rotationDegrees: CGFloat, largeArc: Bool, sweep: Bool) {
        guard start != end else { return }
        var rx = abs(radiusX)
        var ry = abs(radiusY)
        guard rx > 0, ry > 0 else {
            addLine(to: end)
            return
        }

        let phi = rotationDegrees * .pi / 180
        let cosPhi = cos(phi)
        let sinPhi = sin(phi)

        // Step 1: start point in the ellipse's rotated frame.
        let dx = (start.x - end.x) / 2
        let dy = (start.y - end.y) / 2
        let x1 = cosPhi * dx + sinPhi * dy
        let y1 = -sinPhi * dx + cosPhi * dy

        // Scale up radii that are too small to reach the end point.
        let lambda = (x1 * x1) / (rx * rx) + (y1 * y1) / (ry * ry)
        if lambda > 1 {
            rx *= lambda.squareRoot()
            ry *= lambda.squareRoot()
        }

        // Step 2: center in the rotated frame.
        let numerator = rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1
        let denominator = rx * rx * y1 * y1 + ry * ry * x1 * x1
        var coefficient = (max(0, numerator / denominator)).squareRoot()
        if largeArc == sweep { coefficient = -coefficient }
        let cxPrime = coefficient * rx * y1 / ry
        let cyPrime = -coefficient * ry * x1 / rx

        // Step 3: center in user space.
        let center = CGPoint(
            x: cosPhi * cxPrime - sinPhi * cyPrime + (start.x + end.x) / 2,
            y: sinPhi * cxPrime + cosPhi * cyPrime + (start.y + end.y) / 2
        )

        // Step 4: start angle and sweep.
        func angle(_ ux: CGFloat, _ uy: CGFloat, _ vx: CGFloat, _ vy: CGFloat) -> CGFloat {
            atan2(ux * vy - uy * vx, ux * vx + uy * vy)
        }
        let ux = (x1 - cxPrime) / rx
        let uy = (y1 - cyPrime) / ry
        let vx = (-x1 - cxPrime) / rx
        let vy = (-y1 - cyPrime) / ry
        let startAngle = angle(1, 0, ux, uy)
        var delta = angle(ux, uy, vx, vy)
        if !sweep, delta > 0 { delta -= 2 * .pi }
        if sweep, delta < 0 { delta += 2 * .pi }

        // Approximate with ≤ 90° cubic segments.
        let segments = max(1, Int((abs(delta) / (.pi / 2)).rounded(.up)))
        let step = delta / CGFloat(segments)
        let handle = 4 / 3 * tan(step / 4)

        func map(_ x: CGFloat, _ y: CGFloat) -> CGPoint {
            CGPoint(x: center.x + rx * x * cosPhi - ry * y * sinPhi,
                    y: center.y + rx * x * sinPhi + ry * y * cosPhi)
        }

        for segment in 0..<segments {
            let a = startAngle + CGFloat(segment) * step
            let b = a + step
            let control1 = map(cos(a) - handle * sin(a), sin(a) + handle * cos(a))
            let control2 = map(cos(b) + handle * sin(b), sin(b) - handle * cos(b))
            let point = segment == segments - 1 ? end : map(cos(b), sin(b))
            addCurve(to: point, control1: control1, control2: control2)
        }
    }
}
