import XCTest
@testable import DHD

@MainActor
private final class FeedbackSpy: DHDFeedback {
    enum Event: Equatable { case glyph, wormhole, failed }
    private(set) var events: [Event] = []

    func glyphEncoded() { events.append(.glyph) }
    func wormholeEstablished() { events.append(.wormhole) }
    func dialFailed() { events.append(.failed) }
}

private actor DelayRecorder {
    private(set) var delays: [Duration] = []
    func record(_ delay: Duration) { delays.append(delay) }
}

private actor PhoneSpy {
    private(set) var dialed: [String] = []
    func record(_ number: String) { dialed.append(number) }
}

final class DHDViewModelTests: XCTestCase {
    private let address = Array(Glyph.all.prefix(7).map(\.slug))
    private var directory: TemporaryDirectory!
    private var storage: CartoucheStorage!

    override func setUp() {
        directory = TemporaryDirectory()
        storage = CartoucheStorage(fileURL: directory.url.appending(path: "cartouche.json"))
    }

    override func tearDown() {
        directory.remove()
    }

    @MainActor
    private func makeModel(feedback: FeedbackSpy = FeedbackSpy(), phone: PhoneSpy = PhoneSpy(),
                           picked: PickedContact? = nil) -> DHDViewModel {
        let storage = storage!
        return DHDViewModel(
            dialingService: DialingService(loadCartouche: { storage.loadOrEmpty() },
                                           openPhone: { await phone.record($0) }),
            storage: storage,
            feedback: feedback,
            pickContact: { picked },
            sleep: { _ in }
        )
    }

    @MainActor
    private func dial(_ sequence: [String], on model: DHDViewModel) {
        sequence.forEach(model.glyphTapped)
    }

    // MARK: - Glyphs

    @MainActor func testGlyphTapDialsAndGivesFeedback() {
        let feedback = FeedbackSpy()
        let model = makeModel(feedback: feedback)

        model.glyphTapped("earth")

        XCTAssertEqual(model.sequence, ["earth"])
        XCTAssertEqual(feedback.events, [.glyph])
    }

    @MainActor func testRepeatedOrExtraGlyphsAreSilent() {
        let feedback = FeedbackSpy()
        let model = makeModel(feedback: feedback)

        dial(address, on: model)
        model.glyphTapped("earth")
        model.glyphTapped(Glyph.all[8].slug)

        XCTAssertEqual(model.sequence, address)
        XCTAssertTrue(model.isDomeActive)
        XCTAssertEqual(feedback.events, Array(repeating: .glyph, count: 7))
    }

    // MARK: - Dome

    @MainActor func testDomeIgnoredUntilSequenceComplete() async {
        let feedback = FeedbackSpy()
        let model = makeModel(feedback: feedback)
        model.glyphTapped("earth")

        await model.domeTapped()

        XCTAssertEqual(feedback.events, [.glyph])
        XCTAssertNil(model.alert)
    }

    @MainActor func testKnownAddressCallsContactThenResets() async throws {
        try storage.save([CartoucheEntry(id: "1", name: "Hammond", phoneNumber: "555-0100", dialingSequence: address)])
        let feedback = FeedbackSpy()
        let phone = PhoneSpy()
        let model = makeModel(feedback: feedback, phone: phone)
        dial(address, on: model)

        await model.domeTapped()

        let dialed = await phone.dialed
        XCTAssertEqual(dialed, ["555-0100"])
        XCTAssertEqual(feedback.events.last, .wormhole)
        XCTAssertNil(model.alert)
        XCTAssertEqual(model.wormholes, 1)
        XCTAssertEqual(model.failedDials, 0)
        XCTAssertTrue(model.isEngaged, "The gate stays engaged until the reset")

        await model.pendingReset?.value
        XCTAssertEqual(model.sequence, [])
        XCTAssertFalse(model.isEngaged)
    }

    @MainActor func testDomeCannotBeEngagedTwice() async throws {
        try storage.save([CartoucheEntry(id: "1", name: "Hammond", phoneNumber: "555-0100", dialingSequence: address)])
        let phone = PhoneSpy()
        let model = DHDViewModel(
            dialingService: DialingService(loadCartouche: { [storage] in storage!.loadOrEmpty() },
                                           openPhone: { await phone.record($0) }),
            storage: storage, feedback: FeedbackSpy(), pickContact: { nil },
            sleep: { _ in try await Task.sleep(for: .seconds(60)) }
        )
        dial(address, on: model)

        await model.domeTapped()
        await model.domeTapped()

        let dialed = await phone.dialed
        XCTAssertEqual(dialed.count, 1)
        model.reset()
    }

    @MainActor func testUnknownAddressOffersToSave() async {
        let feedback = FeedbackSpy()
        let phone = PhoneSpy()
        let model = makeModel(feedback: feedback, phone: phone)
        dial(address, on: model)

        await model.domeTapped()

        XCTAssertEqual(model.alert, .unknownAddress)
        XCTAssertEqual(feedback.events.last, .failed)
        XCTAssertEqual(model.failedDials, 1)
        XCTAssertEqual(model.wormholes, 0)
        XCTAssertFalse(model.isEngaged)
        XCTAssertEqual(model.sequence, address, "Sequence is kept so it can be saved")
        let dialed = await phone.dialed
        XCTAssertEqual(dialed, [])
    }

    // MARK: - Saving

    @MainActor func testSaveStoresPickedContactForSequence() async throws {
        let model = makeModel(picked: PickedContact(name: "Samantha Carter", phoneNumber: "555-0199"))
        dial(address, on: model)
        await model.domeTapped()

        await model.saveAddress()

        let saved = try storage.load()
        XCTAssertEqual(saved.count, 1)
        XCTAssertEqual(saved[0].name, "Samantha Carter")
        XCTAssertEqual(saved[0].phoneNumber, "555-0199")
        XCTAssertEqual(saved[0].dialingSequence, address)
        XCTAssertNotNil(UUID(uuidString: saved[0].id))
        XCTAssertEqual(model.alert, .saved(name: "Samantha Carter"))
        XCTAssertEqual(model.sequence, [])
    }

    @MainActor func testSavedAddressDialsNextTime() async {
        let phone = PhoneSpy()
        let model = makeModel(phone: phone, picked: PickedContact(name: "Carter", phoneNumber: "555-0199"))
        dial(address, on: model)
        await model.domeTapped()
        await model.saveAddress()

        dial(address, on: model)
        await model.domeTapped()

        let dialed = await phone.dialed
        XCTAssertEqual(dialed, ["555-0199"])
    }

    @MainActor func testCancellingPickerKeepsSequence() async throws {
        let model = makeModel(picked: nil)
        dial(address, on: model)
        await model.domeTapped()
        model.alert = nil

        await model.saveAddress()

        XCTAssertEqual(try storage.load(), [])
        XCTAssertEqual(model.sequence, address)
        XCTAssertNil(model.alert)
    }

    @MainActor func testSaveFailureShowsError() async throws {
        try FileManager.default.createDirectory(at: directory.url, withIntermediateDirectories: true)
        try Data("corrupt".utf8).write(to: storage.fileURL)
        let model = makeModel(picked: PickedContact(name: "Carter", phoneNumber: "555-0199"))
        dial(address, on: model)

        await model.saveAddress()

        XCTAssertEqual(model.alert, .error("Failed to save address."))
        XCTAssertEqual(model.sequence, address)
    }

    // MARK: - Auto-dial (re-dial from the Cartouche)

    @MainActor func testAutoDialDialsEachGlyphWithFeedback() async {
        let feedback = FeedbackSpy()
        let model = makeModel(feedback: feedback)
        model.glyphTapped("virgo")

        model.startAutoDial(address)
        await model.pendingAutoDial?.value

        XCTAssertEqual(model.sequence, address, "Replaces the partially dialed sequence")
        XCTAssertTrue(model.isDomeActive)
        XCTAssertNil(model.pendingAutoDial)
        XCTAssertEqual(feedback.events, Array(repeating: .glyph, count: 8))
    }

    @MainActor func testAutoDialWaitsBetweenGlyphs() async {
        let delays = DelayRecorder()
        let model = DHDViewModel(
            dialingService: DialingService(loadCartouche: { [] }, openPhone: { _ in }),
            storage: storage, feedback: FeedbackSpy(), pickContact: { nil },
            sleep: { await delays.record($0) }
        )

        model.startAutoDial(address)
        await model.pendingAutoDial?.value

        let recorded = await delays.delays
        XCTAssertEqual(recorded, [.milliseconds(200)] + Array(repeating: .seconds(1), count: 6))
    }

    @MainActor func testGlyphTapsAndDomeIgnoredDuringAutoDial() async {
        var model: DHDViewModel!
        var tapped = false
        model = DHDViewModel(
            dialingService: DialingService(loadCartouche: { [] }, openPhone: { _ in }),
            storage: storage, feedback: FeedbackSpy(), pickContact: { nil },
            sleep: { _ in
                await MainActor.run {
                    guard !tapped else { return }
                    tapped = true
                    model.glyphTapped("virgo")
                }
            }
        )

        model.startAutoDial(address)
        await model.pendingAutoDial?.value

        XCTAssertTrue(tapped)
        XCTAssertEqual(model.sequence, address)
    }

    @MainActor func testResetCancelsAutoDial() async {
        var model: DHDViewModel!
        var calls = 0
        model = DHDViewModel(
            dialingService: DialingService(loadCartouche: { [] }, openPhone: { _ in }),
            storage: storage, feedback: FeedbackSpy(), pickContact: { nil },
            sleep: { _ in
                // Abort after the third glyph.
                let shouldReset = await MainActor.run { calls += 1; return calls == 4 }
                if shouldReset { await MainActor.run { model.reset() } }
            }
        )

        model.startAutoDial(address)
        let task = model.pendingAutoDial
        await task?.value

        XCTAssertEqual(model.sequence, [])
        XCTAssertNil(model.pendingAutoDial)
        model.glyphTapped("virgo")
        XCTAssertEqual(model.sequence, ["virgo"], "Manual dialing works again after aborting")
    }

    @MainActor func testAutoDialIgnoresInvalidSequence() {
        let model = makeModel()
        model.glyphTapped("virgo")

        model.startAutoDial(["earth", "orion"])

        XCTAssertNil(model.pendingAutoDial)
        XCTAssertEqual(model.sequence, ["virgo"])
    }

    // MARK: - Reset

    @MainActor func testResetClearsSequenceAndAllowsDialingAgain() {
        let feedback = FeedbackSpy()
        let model = makeModel(feedback: feedback)
        dial(address, on: model)

        model.reset()
        model.glyphTapped("virgo")

        XCTAssertEqual(model.sequence, ["virgo"])
    }
}
