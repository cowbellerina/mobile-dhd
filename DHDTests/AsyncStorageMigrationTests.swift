import XCTest
@testable import DHD

final class AsyncStorageMigrationTests: XCTestCase {
    private var directory: TemporaryDirectory!
    private var legacyDirectory: URL!
    private var storage: CartoucheStorage!
    private var migration: AsyncStorageMigration!

    override func setUp() {
        directory = TemporaryDirectory()
        legacyDirectory = directory.url.appending(path: "com.cowbellerina.mobile-dhd/RCTAsyncLocalStorage_V1")
        storage = CartoucheStorage(fileURL: directory.url.appending(path: "cartouche.json"))
        migration = AsyncStorageMigration(legacyDirectory: legacyDirectory, storage: storage)
    }

    override func tearDown() {
        directory.remove()
    }

    // MARK: - Fixtures

    /// A Cartouche as the Expo app's `JSON.stringify` wrote it.
    private func expoCartoucheJSON(entryCount: Int) -> String {
        let entries = (0..<entryCount).map { index in
            let sequence = Glyph.all[index..<index + 7].map { "\"\($0.slug)\"" }.joined(separator: ",")
            return #"{"id":"6f1c2b9e-4a7d-4c1e-9b0a-00000000000\#(index)","name":"Contact \#(index)","#
                + #""phoneNumber":"+358 40 123 456\#(index)","dialingSequence":[\#(sequence)]}"#
        }
        return "[\(entries.joined(separator: ","))]"
    }

    private func writeManifest(_ manifest: [String: Any]) throws {
        try FileManager.default.createDirectory(at: legacyDirectory, withIntermediateDirectories: true)
        let data = try JSONSerialization.data(withJSONObject: manifest)
        try data.write(to: legacyDirectory.appending(path: "manifest.json"))
    }

    /// Mirrors AsyncStorage's `_writeEntry`: inline up to 1024 characters, otherwise a separate MD5-named file.
    private func writeLegacyCartouche(_ json: String) throws {
        let key = AsyncStorageMigration.cartoucheKey
        if json.utf16.count <= 1024 {
            try writeManifest([key: json, "EXPO_CONSTANTS_INSTALLATION_ID": "abc"])
        } else {
            try writeManifest([key: NSNull(), "EXPO_CONSTANTS_INSTALLATION_ID": "abc"])
            try json.write(to: legacyDirectory.appending(path: AsyncStorageMigration.fileName(forKey: key)),
                           atomically: true, encoding: .utf8)
        }
    }

    // MARK: - Tests

    func testFileNameMatchesAsyncStorageMD5() {
        // `md5 -s '@dhd_cartouche_v1'`
        XCTAssertEqual(AsyncStorageMigration.fileName(forKey: "@dhd_cartouche_v1"), "a9b334ab96da3051b9437f3a0d074b3e")
    }

    func testMigratesInlineValue() throws {
        let json = expoCartoucheJSON(entryCount: 2)
        XCTAssertLessThanOrEqual(json.utf16.count, 1024)
        try writeLegacyCartouche(json)

        XCTAssertEqual(try migration.runIfNeeded(), .migrated(entryCount: 2))

        let migrated = try storage.load()
        XCTAssertEqual(migrated.map(\.name), ["Contact 0", "Contact 1"])
        XCTAssertEqual(migrated[1].phoneNumber, "+358 40 123 4561")
        XCTAssertEqual(migrated[1].dialingSequence, Glyph.all[1..<8].map(\.slug))
    }

    func testMigratesValueStoredInSeparateFile() throws {
        let json = expoCartoucheJSON(entryCount: 10)
        XCTAssertGreaterThan(json.utf16.count, 1024)
        try writeLegacyCartouche(json)

        XCTAssertEqual(try migration.runIfNeeded(), .migrated(entryCount: 10))
        XCTAssertEqual(try storage.load().count, 10)
    }

    func testMigratesEmptyCartouche() throws {
        try writeLegacyCartouche("[]")
        XCTAssertEqual(try migration.runIfNeeded(), .migrated(entryCount: 0))
        XCTAssertTrue(storage.exists)
    }

    func testNoLegacyDataOnFreshInstall() throws {
        XCTAssertEqual(try migration.runIfNeeded(), .noLegacyData)
        XCTAssertFalse(storage.exists)
    }

    func testNoLegacyDataWhenKeyMissing() throws {
        try writeManifest(["EXPO_CONSTANTS_INSTALLATION_ID": "abc"])
        XCTAssertEqual(try migration.runIfNeeded(), .noLegacyData)
    }

    func testNoLegacyDataWhenValueFileMissing() throws {
        try writeManifest([AsyncStorageMigration.cartoucheKey: NSNull()])
        XCTAssertEqual(try migration.runIfNeeded(), .noLegacyData)
    }

    func testSkipsWhenNativeCartoucheExists() throws {
        try writeLegacyCartouche(expoCartoucheJSON(entryCount: 2))
        try storage.save([])

        XCTAssertEqual(try migration.runIfNeeded(), .skipped)
        XCTAssertEqual(try storage.load(), [])
    }

    func testRunsOnlyOnce() throws {
        try writeLegacyCartouche(expoCartoucheJSON(entryCount: 2))
        try migration.runIfNeeded()
        try storage.delete(id: "6f1c2b9e-4a7d-4c1e-9b0a-000000000000")

        XCTAssertEqual(try migration.runIfNeeded(), .skipped)
        XCTAssertEqual(try storage.load().count, 1)
    }

    func testCorruptLegacyDataThrowsWithoutWriting() throws {
        try writeLegacyCartouche("{not json")
        XCTAssertThrowsError(try migration.runIfNeeded())
        XCTAssertFalse(storage.exists)
    }
}
