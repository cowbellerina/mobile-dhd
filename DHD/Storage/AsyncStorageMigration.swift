import CryptoKit
import Foundation

/// One-time import of the Cartouche saved by the Expo app (React Native AsyncStorage 2.x) into `CartoucheStorage`.
///
/// AsyncStorage on iOS keeps `Application Support/<bundleID>/RCTAsyncLocalStorage_V1/manifest.json`, a JSON object of
/// key → value. Values over 1024 characters are stored as `null` in the manifest and written to a sibling file
/// named by the lowercase hex MD5 of the key.
///
/// Migration runs only while no native Cartouche file exists, so it never overwrites native data. Legacy files are
/// left in place.
struct AsyncStorageMigration {
    static let cartoucheKey = "@dhd_cartouche_v1"

    enum Outcome: Equatable {
        /// A native Cartouche already exists.
        case skipped
        /// No Expo-era Cartouche was found (fresh install).
        case noLegacyData
        case migrated(entryCount: Int)
    }

    let legacyDirectory: URL
    let storage: CartoucheStorage

    static let live = AsyncStorageMigration(
        legacyDirectory: URL.applicationSupportDirectory
            .appending(path: Bundle.main.bundleIdentifier ?? "")
            .appending(path: "RCTAsyncLocalStorage_V1"),
        storage: .live
    )

    /// - Throws: If legacy data exists but can't be read or decoded. Nothing is written, so it's retried next launch.
    @discardableResult
    func runIfNeeded() throws -> Outcome {
        guard !storage.exists else { return .skipped }
        guard let json = try legacyValue(forKey: Self.cartoucheKey) else { return .noLegacyData }

        let cartouche = try JSONDecoder().decode(Cartouche.self, from: Data(json.utf8))
        try storage.save(cartouche)
        return .migrated(entryCount: cartouche.count)
    }

    /// Reads a value the way AsyncStorage's `getItem` does.
    func legacyValue(forKey key: String) throws -> String? {
        let manifestURL = legacyDirectory.appending(path: "manifest.json")
        guard FileManager.default.fileExists(atPath: manifestURL.path(percentEncoded: false)) else { return nil }

        let manifest = try JSONSerialization.jsonObject(with: Data(contentsOf: manifestURL)) as? [String: Any]
        switch manifest?[key] {
        case let inline as String:
            return inline
        case is NSNull:
            let valueURL = legacyDirectory.appending(path: Self.fileName(forKey: key))
            guard FileManager.default.fileExists(atPath: valueURL.path(percentEncoded: false)) else { return nil }
            return try String(contentsOf: valueURL, encoding: .utf8)
        default:
            return nil
        }
    }

    /// AsyncStorage's `RCTMD5Hash`: lowercase hex MD5 of the key's UTF-8 bytes.
    static func fileName(forKey key: String) -> String {
        Insecure.MD5.hash(data: Data(key.utf8)).map { String(format: "%02x", $0) }.joined()
    }
}
