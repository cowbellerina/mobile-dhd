import SwiftUI

@main
@MainActor
struct DHDApp: App {
    @State private var dhdModel = DHDViewModel.live()

    init() {
        Self.configureTabBarAppearance()
        guard CartoucheStorage.overridePath == nil else { return }
        do {
            let outcome = try AsyncStorageMigration.live.runIfNeeded()
            Log.storage.info("Cartouche migration: \(String(describing: outcome), privacy: .public)")
        } catch {
            Log.storage.error("Cartouche migration failed: \(error.localizedDescription, privacy: .public)")
        }
    }

    var body: some Scene {
        WindowGroup {
            RootView(dhdModel: dhdModel)
        }
    }

    /// Matches the Expo app's tab bar: near-black background, dark top border, grey inactive items.
    private static func configureTabBarAppearance() {
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor(resource: .barBackground)
        appearance.shadowColor = UIColor(resource: .barSeparator)
        let inactive = UIColor(resource: .barInactive)
        for layout in [appearance.stackedLayoutAppearance, appearance.inlineLayoutAppearance,
                       appearance.compactInlineLayoutAppearance] {
            layout.normal.iconColor = inactive
            layout.normal.titleTextAttributes = [.foregroundColor: inactive]
        }
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }
}
