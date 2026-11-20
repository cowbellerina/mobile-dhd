import SwiftUI

/// Two-tab layout mirroring the Expo app: the DHD and the Cartouche (saved addresses).
@MainActor
struct RootView: View {
    enum Tab {
        case dhd, cartouche
    }

    let dhdModel: DHDViewModel
    @State private var tab = Tab.dhd
    @State private var redials = 0

    var body: some View {
        TabView(selection: $tab) {
            DHDScreen(model: dhdModel)
                .tabItem { Label("DHD", systemImage: "circle.circle.fill") }
                .tag(Tab.dhd)

            CartoucheScreen(onRedial: redial)
                .tabItem { Label("Cartouche", systemImage: "bookmark.fill") }
                .tag(Tab.cartouche)
        }
        .sensoryFeedback(.impact(weight: .medium), trigger: redials)
        // The catalog's AccentColor is the app's global accent too, but the tab bar only follows an explicit tint.
        .tint(Theme.Colors.chevronAmber)
    }

    private func redial(_ entry: CartoucheEntry) {
        redials += 1
        tab = .dhd
        dhdModel.startAutoDial(entry.dialingSequence)
    }
}

#Preview {
    RootView(dhdModel: .live())
}
