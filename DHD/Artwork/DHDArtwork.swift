import SwiftUI

/// How a DHD path was filled in the Expo app (`DHDDefs.tsx`). The app now draws Blender renders; fills identify layer roles.
enum DHDFill: Hashable, Sendable {
    case color(UInt32)
    case brushedMetal
    case metallicHighlight
    case metallicKey
    case goldHighlight
    case goldSymbol
    case dome
}

/// One filled path of the DHD artwork, in the 900×900 artwork coordinate space.
struct DHDLayer: @unchecked Sendable { // Path is immutable value storage, but not marked Sendable in the iOS 17 SDK.
    let path: Path
    let fill: DHDFill
    /// Whether a copy offset by (2, 2) is drawn beneath in `metallicKey` (the Expo app's `ShadowPath`).
    let castsShadow: Bool

    init(d: String, fill: DHDFill, offset: CGPoint = .zero, castsShadow: Bool = false) {
        do {
            path = try SVGPath.parse(d).offsetBy(dx: offset.x, dy: offset.y)
        } catch {
            assertionFailure("Invalid DHD path data: \(error)")
            path = Path()
        }
        self.fill = fill
        self.castsShadow = castsShadow
    }
}

struct DHDKeyArtwork: Sendable {
    let slug: String
    let layers: [DHDLayer]

    /// Tap area: the key's base plate, which contains its other layers.
    var hitArea: Path { layers[0].path }
}

/// The DHD artwork. Path data lives in DHDArtwork+Paths.swift.
enum DHDArtwork {
    static let size = CGSize(width: 900, height: 900)

    enum Target: Equatable {
        case glyph(String)
        case dome
    }

    /// The tappable element at `point` (artwork coordinates), topmost first.
    static func target(at point: CGPoint) -> Target? {
        if dome.contains(where: { $0.path.contains(point) }) {
            return .dome
        }
        if let key = keys.first(where: { $0.hitArea.contains(point) }) {
            return .glyph(key.slug)
        }
        return nil
    }

    /// Maps the artwork into `size`, scaled to fit and centered (SVG's default `xMidYMid meet`).
    static func transform(fitting size: CGSize) -> CGAffineTransform {
        let scale = min(size.width / Self.size.width, size.height / Self.size.height)
        return CGAffineTransform(translationX: (size.width - Self.size.width * scale) / 2,
                                 y: (size.height - Self.size.height * scale) / 2)
            .scaledBy(x: scale, y: scale)
    }
}
