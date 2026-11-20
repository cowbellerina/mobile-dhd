import XCTest

/// Base class for UI tests: launches the app against a scratch Cartouche file and provides DHD helpers.
class DHDUITestCase: XCTestCase {
    /// An address not saved in the Cartouche unless a test seeds or saves it.
    let address = ["virgo", "triangulum", "taurus", "sextans", "scutum", "sculptor", "scorpio"]
    /// Scratch Cartouche file the app under test reads and writes (the runner and simulator share the filesystem).
    let cartoucheURL = FileManager.default.temporaryDirectory.appending(path: "\(UUID().uuidString).json")

    override func tearDown() {
        try? FileManager.default.removeItem(at: cartoucheURL)
        super.tearDown()
    }

    /// Launches the app with `entries` (in the app's JSON format) as its Cartouche.
    @MainActor
    func launch(cartouche entries: [[String: Any]] = []) throws -> XCUIApplication {
        continueAfterFailure = false
        if !entries.isEmpty {
            try JSONSerialization.data(withJSONObject: entries).write(to: cartoucheURL)
        }
        let app = XCUIApplication()
        app.launchEnvironment["DHD_CARTOUCHE_FILE"] = cartoucheURL.path(percentEncoded: false)
        app.launch()
        return app
    }

    func entry(id: String, name: String, phoneNumber: String, sequence: [String]) -> [String: Any] {
        ["id": id, "name": name, "phoneNumber": phoneNumber, "dialingSequence": sequence]
    }

    func savedCartouche() throws -> [[String: Any]] {
        try JSONSerialization.jsonObject(with: Data(contentsOf: cartoucheURL)) as? [[String: Any]] ?? []
    }

    @MainActor
    func dial(_ slugs: [String], in app: XCUIApplication) {
        for slug in slugs {
            app.buttons["glyph-\(slug)"].tap()
        }
    }

    @MainActor
    func chevron(_ number: Int, in app: XCUIApplication) -> XCUIElement {
        app.otherElements["chevron-\(number)"]
    }

    /// The unknown-address sheet's save button, once the sheet is up.
    @MainActor
    func saveAddressButton(in app: XCUIApplication) -> XCUIElement {
        app.buttons["save-address-button"]
    }

    /// The banner confirming a saved address.
    @MainActor
    func savedBanner(in app: XCUIApplication) -> XCUIElement {
        app.descendants(matching: .any)["saved-banner"].firstMatch
    }

    /// Waits for UI updates that happen after an animation (alert dismissal, auto-dial, reset after dialing).
    @MainActor
    func waitForLabel(_ label: String, of element: XCUIElement, timeout: TimeInterval = 3,
                      file: StaticString = #filePath, line: UInt = #line) {
        let predicate = NSPredicate(format: "label == %@", label)
        let result = XCTWaiter.wait(for: [expectation(for: predicate, evaluatedWith: element)], timeout: timeout)
        XCTAssertEqual(result, .completed, "Expected label '\(label)', got '\(element.label)'", file: file, line: line)
    }
}
