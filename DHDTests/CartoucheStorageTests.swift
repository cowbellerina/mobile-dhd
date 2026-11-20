import XCTest
@testable import DHD

final class CartoucheStorageTests: XCTestCase {
    private var directory: TemporaryDirectory!
    private var storage: CartoucheStorage!

    private let hammond = CartoucheEntry(id: "1", name: "George Hammond", phoneNumber: "555-0100",
                                         dialingSequence: ["earth", "taurus", "cetus", "virgo", "leo", "lynx", "libra"])
    private let carter = CartoucheEntry(id: "2", name: "Samantha Carter", phoneNumber: "555-0199",
                                        dialingSequence: ["orion", "hydra", "gemini", "aries", "norma", "cra", "mic"])

    override func setUp() {
        directory = TemporaryDirectory()
        // Nested path verifies the parent directory is created on first save.
        storage = CartoucheStorage(fileURL: directory.url.appending(path: "nested/cartouche.json"))
    }

    override func tearDown() {
        directory.remove()
    }

    func testLoadReturnsEmptyWhenNothingSaved() throws {
        XCTAssertFalse(storage.exists)
        XCTAssertEqual(try storage.load(), [])
    }

    func testAddPersistsEntriesInOrder() throws {
        try storage.add(hammond)
        try storage.add(carter)
        XCTAssertEqual(try storage.load(), [hammond, carter])
    }

    func testDeleteRemovesOnlyMatchingEntry() throws {
        try storage.save([hammond, carter])
        try storage.delete(id: "1")
        XCTAssertEqual(try storage.load(), [carter])
    }

    func testEmptySavedCartoucheStillExists() throws {
        try storage.save([hammond])
        try storage.delete(id: "1")
        XCTAssertTrue(storage.exists)
        XCTAssertEqual(try storage.load(), [])
    }

    func testCorruptFileIsNotOverwrittenByAdd() throws {
        try FileManager.default.createDirectory(at: storage.fileURL.deletingLastPathComponent(),
                                                withIntermediateDirectories: true)
        try Data("not json".utf8).write(to: storage.fileURL)

        XCTAssertThrowsError(try storage.add(hammond))
        XCTAssertEqual(try Data(contentsOf: storage.fileURL), Data("not json".utf8))
        XCTAssertEqual(storage.loadOrEmpty(), [])
    }
}
