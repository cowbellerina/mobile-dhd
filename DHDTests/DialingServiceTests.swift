import XCTest
@testable import DHD

final class DialingServiceTests: XCTestCase {
    private let address = ["a", "b", "c", "d", "e", "f", "g"]

    /// Records phone numbers passed to `openPhone`.
    private actor PhoneSpy {
        private(set) var dialed: [String] = []
        func record(_ number: String) { dialed.append(number) }
    }

    private func makeService(cartouche: Cartouche, spy: PhoneSpy) -> DialingService {
        DialingService(
            loadCartouche: { cartouche },
            openPhone: { await spy.record($0) }
        )
    }

    func testDialsPhoneWhenMatchFound() async {
        let entry = CartoucheEntry(id: "1", name: "Earth", phoneNumber: "555-1234", dialingSequence: address)
        let spy = PhoneSpy()

        let match = await makeService(cartouche: [entry], spy: spy).dial(address)

        XCTAssertEqual(match, entry)
        let dialed = await spy.dialed
        XCTAssertEqual(dialed, ["555-1234"])
    }

    func testDoesNotDialWhenNoMatch() async {
        let entry = CartoucheEntry(id: "1", name: "Earth", phoneNumber: "555-1234",
                                   dialingSequence: ["x", "y", "z", "a", "b", "c", "d"])
        let spy = PhoneSpy()

        let match = await makeService(cartouche: [entry], spy: spy).dial(address)

        XCTAssertNil(match)
        let dialed = await spy.dialed
        XCTAssertEqual(dialed, [])
    }

    func testHandlesEmptyCartouche() async {
        let spy = PhoneSpy()

        let match = await makeService(cartouche: [], spy: spy).dial(address)

        XCTAssertNil(match)
        let dialed = await spy.dialed
        XCTAssertEqual(dialed, [])
    }
}
