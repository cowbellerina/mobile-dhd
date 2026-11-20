import SwiftUI

/// The seven chevron slots showing the glyphs dialed so far. Replaces the Expo app's `ChevronDisplay`.
///
/// Each slot is a cast-metal tile from the rendered chevron atlases. With `lit`, a dialed glyph locks in: its lit tile
/// drops into the slot with a short spring and keeps a soft white glow. Without it (the Cartouche), tiles stay unlit.
struct ChevronDisplayView: View {
    let sequence: [String]
    var lit = true
    var tileSize: CGFloat = 38
    var verticalPadding: CGFloat = Theme.Spacing.lg

    var body: some View {
        HStack(spacing: tileSize * 0.16) {
            ForEach(0..<DialingConfig.maxSequenceLength, id: \.self) { index in
                ChevronSlot(slug: sequence.indices.contains(index) ? sequence[index] : nil, lit: lit, size: tileSize)
                    .accessibilityIdentifier("chevron-\(index + 1)")
            }
        }
        .padding(.vertical, verticalPadding)
        .accessibilityElement(children: .contain)
    }
}

private struct ChevronSlot: View {
    let slug: String?
    let lit: Bool
    let size: CGFloat
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        ZStack {
            ChevronTile(slug: lit ? nil : slug, lit: false, size: size)
            if lit, let slug {
                ZStack {
                    ChevronTile(slug: slug, lit: true, size: size)
                        .blur(radius: size * 0.14)
                        .opacity(0.75)
                        .blendMode(.plusLighter)
                    ChevronTile(slug: slug, lit: true, size: size)
                }
                .id(slug)
                .transition(reduceMotion ? .opacity : .scale(scale: 1.35).combined(with: .opacity))
            }
        }
        .animation(reduceMotion ? .easeOut(duration: 0.15) : .spring(response: 0.28, dampingFraction: 0.55),
                   value: slug)
        .accessibilityElement()
        .accessibilityLabel(slug.flatMap { Glyph.named($0)?.name } ?? "Empty")
    }
}

/// One tile cut from a chevron atlas.
struct ChevronTile: View {
    let slug: String?
    let lit: Bool
    let size: CGFloat

    var body: some View {
        let unit = size / ChevronArtwork.size
        let tile = ChevronArtwork.atlasTile(for: slug)
        let atlas = ChevronArtwork.atlasSize
        Image(lit ? "ChevronAtlasLit" : "ChevronAtlasBase")
            .resizable()
            .interpolation(.high)
            .frame(width: atlas.width * unit, height: atlas.height * unit)
            .offset(x: -tile.minX * unit, y: -tile.minY * unit)
            .frame(width: size, height: size, alignment: .topLeading)
            .clipped()
            .accessibilityHidden(true)
    }
}

#Preview {
    VStack {
        ChevronDisplayView(sequence: ["earth", "taurus", "leo"])
        ChevronDisplayView(sequence: ["earth", "taurus", "leo", "virgo", "scorpius", "aries", "orion"], lit: false,
                           tileSize: 30)
    }
    .background(.black)
}
