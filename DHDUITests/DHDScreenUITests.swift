import XCTest

final class DHDScreenUITests: DHDUITestCase {
    @MainActor
    func testDialedGlyphsFillChevronsAndAbortClearsThem() throws {
        let app = try launch()
        dial(Array(address.prefix(3)), in: app)

        XCTAssertEqual(chevron(1, in: app).label, "Virgo")
        XCTAssertEqual(chevron(3, in: app).label, "Taurus")
        XCTAssertEqual(chevron(4, in: app).label, "Empty")
        XCTAssertTrue(app.buttons["glyph-virgo"].isSelected)

        app.buttons["abort-button"].tap()

        XCTAssertEqual(chevron(1, in: app).label, "Empty")
        XCTAssertFalse(app.buttons["glyph-virgo"].isSelected)
    }

    @MainActor
    func testUnknownAddressOffersToSaveAndDiscardResets() throws {
        let app = try launch()
        dial(address, in: app)
        XCTAssertEqual(chevron(7, in: app).label, "Scorpius")

        app.buttons["dome"].tap()

        let discard = app.buttons["discard-address-button"]
        XCTAssertTrue(discard.waitForExistence(timeout: 3))
        discard.tap()

        waitForLabel("Empty", of: chevron(1, in: app))
    }

    @MainActor
    func testSaveOpensContactPicker() throws {
        let app = try launch()
        dial(address, in: app)
        app.buttons["dome"].tap()
        XCTAssertTrue(saveAddressButton(in: app).waitForExistence(timeout: 3))
        saveAddressButton(in: app).tap()

        // The picker is hosted out of process; its Cancel button is still exposed to the app's hierarchy.
        let cancel = app.buttons["Cancel"]
        XCTAssertTrue(cancel.waitForExistence(timeout: 15))
        cancel.tap()

        XCTAssertEqual(chevron(7, in: app).label, "Scorpius", "Cancelling the picker keeps the address for another try")
    }

    /// Saves `address` for `contact` via the picker. `number` is tapped when the contact has several numbers.
    @MainActor
    private func save(_ address: [String], for contact: String, number: String? = nil, in app: XCUIApplication) throws {
        dial(address, in: app)
        app.buttons["dome"].tap()
        XCTAssertTrue(saveAddressButton(in: app).waitForExistence(timeout: 3))
        saveAddressButton(in: app).tap()

        let row = app.staticTexts[contact]
        guard row.waitForExistence(timeout: 15) else {
            throw XCTSkip("Simulator sample contact '\(contact)' not found")
        }
        row.tap()
        if let number {
            let numberCell = app.staticTexts[number]
            XCTAssertTrue(numberCell.waitForExistence(timeout: 5))
            numberCell.tap()
        }

        let banner = savedBanner(in: app)
        XCTAssertTrue(banner.waitForExistence(timeout: 5))
        XCTAssertEqual(banner.label, "\(contact) added to Cartouche.")
        waitForLabel("Empty", of: chevron(1, in: app))
    }

    /// Uses the simulator's sample contacts (Anna Haro has one number).
    @MainActor
    func testSavedAddressDialsWithoutPrompt() throws {
        let app = try launch()
        try save(address, for: "Anna Haro", in: app)

        dial(address, in: app)
        app.buttons["dome"].tap()

        XCTAssertFalse(saveAddressButton(in: app).waitForExistence(timeout: 2))
        waitForLabel("Empty", of: chevron(1, in: app)) // Resets after dialing.
    }

    /// Kate Bell (simulator sample contact) has a mobile and a main number; the picker asks which one.
    @MainActor
    func testContactWithSeveralNumbersSavesChosenNumber() throws {
        let app = try launch()
        try save(address, for: "Kate Bell", number: "4155553695", in: app)

        let saved = try savedCartouche()
        XCTAssertEqual(saved.count, 1)
        XCTAssertEqual(saved.first?["name"] as? String, "Kate Bell")
        XCTAssertEqual(saved.first?["phoneNumber"] as? String, "(415) 555-3695", "The chosen (second) number, not the first")
        XCTAssertEqual(saved.first?["dialingSequence"] as? [String], address)
    }
}
