import XCTest
@testable import DHD

final class CartoucheViewModelTests: XCTestCase {
    private var directory: TemporaryDirectory!
    private var storage: CartoucheStorage!

    private let hammond = CartoucheEntry(id: "1", name: "George Hammond", phoneNumber: "555-0100",
                                         dialingSequence: ["earth", "taurus", "cetus", "virgo", "leo", "lynx", "libra"])
    private let carter = CartoucheEntry(id: "2", name: "Samantha Carter", phoneNumber: "555-0199",
                                        dialingSequence: ["orion", "hydra", "gemini", "aries", "norma", "cra", "mic"])

    override func setUp() {
        directory = TemporaryDirectory()
        storage = CartoucheStorage(fileURL: directory.url.appending(path: "cartouche.json"))
    }

    override func tearDown() {
        directory.remove()
    }

    @MainActor func testLoadShowsSavedEntriesInOrder() throws {
        try storage.save([hammond, carter])
        let model = CartoucheViewModel(storage: storage)

        model.load()

        XCTAssertEqual(model.entries, [hammond, carter])
    }

    @MainActor func testLoadIsEmptyWithoutSavedAddresses() {
        let model = CartoucheViewModel(storage: storage)
        model.load()
        XCTAssertEqual(model.entries, [])
    }

    @MainActor func testLoadIsEmptyWhenStorageUnreadable() throws {
        try FileManager.default.createDirectory(at: directory.url, withIntermediateDirectories: true)
        try Data("corrupt".utf8).write(to: storage.fileURL)
        let model = CartoucheViewModel(storage: storage)

        model.load()

        XCTAssertEqual(model.entries, [])
    }

    @MainActor func testLoadPicksUpAddressesSavedElsewhere() throws {
        let model = CartoucheViewModel(storage: storage)
        model.load()

        try storage.add(hammond)
        model.load()

        XCTAssertEqual(model.entries, [hammond])
    }

    @MainActor func testDeleteRemovesEntryAndPersists() throws {
        try storage.save([hammond, carter])
        let model = CartoucheViewModel(storage: storage)
        model.load()

        model.delete(hammond)

        XCTAssertEqual(model.entries, [carter])
        XCTAssertEqual(try storage.load(), [carter])
    }

    @MainActor func testSearchMatchesNamePhoneNumberAndGlyphName() throws {
        try storage.save([hammond, carter])
        let model = CartoucheViewModel(storage: storage)
        model.load()

        XCTAssertEqual(model.entries(matching: ""), [hammond, carter])
        XCTAssertEqual(model.entries(matching: "  "), [hammond, carter])
        XCTAssertEqual(model.entries(matching: "samantha"), [carter])
        XCTAssertEqual(model.entries(matching: "0100"), [hammond])
        XCTAssertEqual(model.entries(matching: "Taurus"), [hammond])
        XCTAssertEqual(model.entries(matching: "ORI"), [carter])
        XCTAssertEqual(model.entries(matching: "555"), [hammond, carter])
        XCTAssertEqual(model.entries(matching: "abydos"), [])
    }
}
