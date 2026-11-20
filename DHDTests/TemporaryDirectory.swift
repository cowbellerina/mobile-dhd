import Foundation

/// A unique scratch directory for a single test, removed with `remove()`.
struct TemporaryDirectory {
    let url = FileManager.default.temporaryDirectory.appending(path: UUID().uuidString)

    func remove() {
        try? FileManager.default.removeItem(at: url)
    }
}
