import XCTest

final class CartoucheScreenUITests: DHDUITestCase {
    private var hammond: [String: Any] {
        entry(id: "hammond", name: "George Hammond", phoneNumber: "555-0100", sequence: address)
    }

    private var carter: [String: Any] {
        entry(id: "carter", name: "Samantha Carter", phoneNumber: "555-0199",
              sequence: ["orion", "hydra", "gemini", "aries", "norma", "cra", "mic"])
    }

    @MainActor
    private func openCartouche(_ app: XCUIApplication) {
        app.tabBars.buttons["Cartouche"].tap()
    }

    @MainActor
    private func row(_ id: String, in app: XCUIApplication) -> XCUIElement {
        app.descendants(matching: .any)["cartouche-item-\(id)"].firstMatch
    }

    @MainActor
    func testEmptyCartoucheShowsPlaceholder() throws {
        let app = try launch()
        openCartouche(app)

        XCTAssertTrue(app.staticTexts["No Saved Addresses"].waitForExistence(timeout: 3))
    }

    @MainActor
    func testListsSavedAddresses() throws {
        let app = try launch(cartouche: [hammond, carter])
        openCartouche(app)

        XCTAssertTrue(row("hammond", in: app).waitForExistence(timeout: 3))
        XCTAssertEqual(row("hammond", in: app).label, "George Hammond, 555-0100")
        XCTAssertEqual(row("carter", in: app).label, "Samantha Carter, 555-0199")
        XCTAssertFalse(app.staticTexts["No Saved Addresses"].exists)
    }

    @MainActor
    func testRedialSwitchesToDHDAndDialsAddress() throws {
        let app = try launch(cartouche: [hammond])
        openCartouche(app)

        row("hammond", in: app).swipeRight()
        app.buttons["Dial"].tap()

        XCTAssertTrue(app.tabBars.buttons["DHD"].isSelected)
        waitForLabel("Virgo", of: chevron(1, in: app))
        waitForLabel("Scorpius", of: chevron(7, in: app), timeout: 10) // One glyph per second.

        // Engaging the gate calls the saved contact instead of offering to save.
        app.buttons["dome"].tap()
        XCTAssertFalse(saveAddressButton(in: app).waitForExistence(timeout: 2))
        waitForLabel("Empty", of: chevron(1, in: app))
    }

    @MainActor
    func testAbortStopsRedial() throws {
        let app = try launch(cartouche: [hammond])
        openCartouche(app)
        row("hammond", in: app).swipeRight()
        app.buttons["Dial"].tap()
        waitForLabel("Triangulum", of: chevron(2, in: app))

        app.buttons["abort-button"].tap()

        waitForLabel("Empty", of: chevron(1, in: app))
        sleep(2)
        XCTAssertEqual(chevron(1, in: app).label, "Empty", "No further glyphs are dialed after aborting")
    }

    @MainActor
    func testDeleteRemovesAddress() throws {
        let app = try launch(cartouche: [hammond, carter])
        openCartouche(app)

        row("hammond", in: app).swipeLeft()
        app.buttons["Delete"].tap()

        XCTAssertTrue(row("carter", in: app).waitForExistence(timeout: 3))
        XCTAssertFalse(row("hammond", in: app).exists)
        XCTAssertEqual(try savedCartouche().compactMap { $0["id"] as? String }, ["carter"])
    }

    @MainActor
    func testAddressSavedOnDHDAppearsInCartouche() throws {
        let app = try launch()
        openCartouche(app)
        XCTAssertTrue(app.staticTexts["No Saved Addresses"].waitForExistence(timeout: 3))

        app.tabBars.buttons["DHD"].tap()
        dial(address, in: app)
        app.buttons["dome"].tap()
        XCTAssertTrue(saveAddressButton(in: app).waitForExistence(timeout: 3))
        saveAddressButton(in: app).tap()
        let contact = app.staticTexts["Anna Haro"]
        guard contact.waitForExistence(timeout: 15) else {
            throw XCTSkip("Simulator sample contact 'Anna Haro' not found")
        }
        contact.tap()
        XCTAssertTrue(savedBanner(in: app).waitForExistence(timeout: 5))

        openCartouche(app)
        XCTAssertTrue(app.staticTexts["Anna Haro"].waitForExistence(timeout: 3))
        XCTAssertFalse(app.staticTexts["No Saved Addresses"].exists)
    }
}
