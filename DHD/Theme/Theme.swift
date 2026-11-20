import SwiftUI

/// Spacing and timing tokens. Colours are named colours in the asset catalog, used through the generated symbols
/// (`Color(.stageLight)`); the app's tint is the catalog's AccentColor, the amber of a lit chevron in the renders.
enum Theme {
    enum Colors {
        /// The amber of a lit chevron in the renders, for places that set it explicitly, such as swipe actions.
        static let chevronAmber = Color(.accent)
    }

    enum Spacing {
        static let xs: CGFloat = 4
        static let sm: CGFloat = 8
        static let md: CGFloat = 16
        static let lg: CGFloat = 20
        static let xl: CGFloat = 32
    }

    enum Timing {
        /// Delay before the DHD resets after a successful dial.
        static let resetAfterDial: Duration = .seconds(2)
        /// Delay between the seventh key lighting and the dome lighting, so the key settles first.
        static let domeLightDelay: Duration = .milliseconds(500)
        /// How long the dome takes to fade up once lit.
        static let domeLightFade: TimeInterval = 0.8
        /// Delay before re-dialing from the Cartouche starts.
        static let autoDialStartDelay: Duration = .milliseconds(200)
        /// Delay between glyphs when re-dialing from the Cartouche.
        static let autoDialInterval: Duration = .seconds(1)
        /// How long the "added to Cartouche" banner stays up.
        static let savedBannerDuration: Duration = .seconds(2.5)
    }
}
