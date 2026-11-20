import SwiftUI

/// Chevron glyph artwork (72×72). Path data and the rendered atlas layout live in ChevronArtwork+Paths.swift.
///
/// The app draws chevrons from two Blender-rendered atlases (`ChevronAtlasBase`, `ChevronAtlasLit`; see README ›
/// Artwork). The paths remain the source geometry for those renders.
enum ChevronArtwork {
    static let size: CGFloat = 72

    struct Paths: @unchecked Sendable { // Path is immutable value storage, but not marked Sendable in the iOS 17 SDK.
        let paths: [Path]

        init(_ data: [String]) {
            paths = data.map { d in
                do {
                    return try SVGPath.parse(d)
                } catch {
                    assertionFailure("Invalid chevron path data: \(error)")
                    return Path()
                }
            }
        }
    }

    static let placeholder = Paths(placeholderData)
    private static let glyphs = glyphData.mapValues(Paths.init)

    /// The glyph's paths, or the empty frame for `nil` or an unknown slug.
    static func paths(for slug: String?) -> [Path] {
        slug.flatMap { glyphs[$0]?.paths } ?? placeholder.paths
    }

    private static let atlasIndices = Dictionary(uniqueKeysWithValues: atlasOrder.enumerated().map { ($1, $0) })

    /// The glyph's tile in the rendered atlases, in chevron units (72×72), or the empty tile for `nil` or an unknown
    /// slug.
    static func atlasTile(for slug: String?) -> CGRect {
        let index = slug.flatMap { atlasIndices[$0] } ?? 0
        let cell = CGFloat(atlasCell)
        let inset = (cell - size) / 2
        return CGRect(x: CGFloat(index % atlasColumns) * cell + inset,
                      y: CGFloat(index / atlasColumns) * cell + inset,
                      width: size, height: size)
    }

    /// The atlas size in chevron units.
    static var atlasSize: CGSize {
        let rows = (atlasOrder.count + atlasColumns - 1) / atlasColumns
        return CGSize(width: CGFloat(atlasColumns * atlasCell), height: CGFloat(rows * atlasCell))
    }
}
