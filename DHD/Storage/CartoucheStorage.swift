import Foundation

/// Persists the Cartouche as a JSON file. Replaces the Expo app's AsyncStorage-based `StorageService`.
struct CartoucheStorage: Sendable {
    let fileURL: URL

    /// UI tests set this environment variable to a scratch file to start from a known state.
    static let overridePath = ProcessInfo.processInfo.environment["DHD_CARTOUCHE_FILE"]

    /// The app's Cartouche.
    static let live = CartoucheStorage(
        fileURL: overridePath.map { URL(filePath: $0) }
            ?? URL.applicationSupportDirectory.appending(path: "cartouche.json")
    )

    /// Whether the Cartouche has ever been saved (an empty saved Cartouche still exists).
    var exists: Bool {
        FileManager.default.fileExists(atPath: fileURL.path(percentEncoded: false))
    }

    /// - Throws: If the file exists but can't be read or decoded.
    func load() throws -> Cartouche {
        guard exists else { return [] }
        let data = try Data(contentsOf: fileURL)
        return try JSONDecoder().decode(Cartouche.self, from: data)
    }

    /// Loads the Cartouche for read-only use, logging and returning an empty list on failure.
    func loadOrEmpty() -> Cartouche {
        do {
            return try load()
        } catch {
            Log.storage.error("Failed to load cartouche: \(error.localizedDescription, privacy: .public)")
            return []
        }
    }

    func save(_ cartouche: Cartouche) throws {
        try FileManager.default.createDirectory(
            at: fileURL.deletingLastPathComponent(),
            withIntermediateDirectories: true
        )
        let data = try JSONEncoder().encode(cartouche)
        try data.write(to: fileURL, options: .atomic)
    }

    /// Appends an entry. Uses the throwing `load()` so an unreadable file is never overwritten.
    func add(_ entry: CartoucheEntry) throws {
        try save(load() + [entry])
    }

    func delete(id: String) throws {
        try save(load().filter { $0.id != id })
    }
}
