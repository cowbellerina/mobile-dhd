/// A single Stargate glyph on the DHD.
struct Glyph: Identifiable, Hashable, Sendable {
    /// Unique identifier used for logic, comparison and storage (e.g. "taurus").
    /// Must stay identical to the Expo app's slugs so migrated data still matches.
    let slug: String
    /// Human-readable name (e.g. "Taurus").
    let name: String

    var id: String { slug }
}

extension Glyph {
    static let all: [Glyph] = [
        Glyph(slug: "earth", name: "Earth"),
        Glyph(slug: "andromeda", name: "Andromeda"),
        Glyph(slug: "aquarius", name: "Aquarius"),
        Glyph(slug: "aries", name: "Aries"),
        Glyph(slug: "auriga", name: "Auriga"),
        Glyph(slug: "bootes", name: "Bootes"),
        Glyph(slug: "cancer", name: "Cancer"),
        Glyph(slug: "canis-minor", name: "Canis Minor"),
        Glyph(slug: "capricorn", name: "Capricorn"),
        Glyph(slug: "centaurus", name: "Centaurus"),
        Glyph(slug: "cetus", name: "Cetus"),
        Glyph(slug: "cra", name: "Corona Australis"),
        Glyph(slug: "crater", name: "Crater"),
        Glyph(slug: "equuleus", name: "Equuleus"),
        Glyph(slug: "eridanus", name: "Eridanus"),
        Glyph(slug: "gemini", name: "Gemini"),
        Glyph(slug: "hydra", name: "Hydra"),
        Glyph(slug: "leo", name: "Leo"),
        Glyph(slug: "leo-minor", name: "Leo Minor"),
        Glyph(slug: "libra", name: "Libra"),
        Glyph(slug: "lynx", name: "Lynx"),
        Glyph(slug: "mic", name: "Microscopium"),
        Glyph(slug: "monoceros", name: "Monoceros"),
        Glyph(slug: "norma", name: "Norma"),
        Glyph(slug: "orion", name: "Orion"),
        Glyph(slug: "pegasus", name: "Pegasus"),
        Glyph(slug: "perseus", name: "Perseus"),
        Glyph(slug: "pisces", name: "Pisces"),
        Glyph(slug: "pisces-austrinius", name: "Piscis Austrinus"),
        Glyph(slug: "sagittarius", name: "Sagittarius"),
        Glyph(slug: "scorpio", name: "Scorpius"),
        Glyph(slug: "sculptor", name: "Sculptor"),
        Glyph(slug: "scutum", name: "Scutum"),
        Glyph(slug: "serpens-caput", name: "Serpens Caput"),
        Glyph(slug: "sextans", name: "Sextans"),
        Glyph(slug: "taurus", name: "Taurus"),
        Glyph(slug: "triangulum", name: "Triangulum"),
        Glyph(slug: "virgo", name: "Virgo"),
    ]

    private static let bySlug = Dictionary(uniqueKeysWithValues: all.map { ($0.slug, $0) })

    static func named(_ slug: String) -> Glyph? {
        bySlug[slug]
    }
}
