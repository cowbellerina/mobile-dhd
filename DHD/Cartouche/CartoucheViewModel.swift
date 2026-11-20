import Observation

/// The saved addresses list. Replaces the state handling in the Expo app's `app/(tabs)/cartouche.tsx`.
@Observable
@MainActor
final class CartoucheViewModel {
    private(set) var entries: Cartouche = []
    private let storage: CartoucheStorage

    init(storage: CartoucheStorage) {
        self.storage = storage
    }

    /// Reloads from storage. An unreadable Cartouche shows as empty (and is logged).
    func load() {
        entries = storage.loadOrEmpty()
    }

    /// Entries whose name, phone number or any glyph name contains `query`, ignoring case and diacritics. All of them
    /// for a blank query.
    func entries(matching query: String) -> Cartouche {
        let query = query.trimmingCharacters(in: .whitespaces)
        guard !query.isEmpty else { return entries }
        return entries.filter { entry in
            entry.name.localizedStandardContains(query)
                || entry.phoneNumber.localizedStandardContains(query)
                || entry.dialingSequence.contains { Glyph.named($0)?.name.localizedStandardContains(query) == true }
        }
    }

    func delete(_ entry: CartoucheEntry) {
        do {
            try storage.delete(id: entry.id)
        } catch {
            Log.storage.error("Failed to delete entry: \(error.localizedDescription, privacy: .public)")
        }
        load()
    }
}
