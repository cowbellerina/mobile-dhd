import Contacts
import XCTest
@testable import DHD

final class ContactHelpersTests: XCTestCase {
    func testNameJoinsGivenMiddleAndFamily() {
        let contact = CNMutableContact()
        contact.givenName = "George"
        contact.middleName = "S."
        contact.familyName = "Hammond"
        XCTAssertEqual(ContactHelpers.name(of: contact), "George S. Hammond")
    }

    func testNameFallsBackToOrganization() {
        let contact = CNMutableContact()
        contact.organizationName = "SGC"
        XCTAssertEqual(ContactHelpers.name(of: contact), "SGC")
    }

    func testNameIsUnknownWhenEmpty() {
        XCTAssertEqual(ContactHelpers.name(of: CNMutableContact()), "Unknown")
    }

    func testPrimaryPhoneNumberReturnsFirst() {
        let contact = CNMutableContact()
        contact.phoneNumbers = [
            CNLabeledValue(label: CNLabelPhoneNumberMobile, value: CNPhoneNumber(stringValue: "555-1234")),
            CNLabeledValue(label: CNLabelHome, value: CNPhoneNumber(stringValue: "555-9999")),
        ]
        XCTAssertEqual(ContactHelpers.primaryPhoneNumber(of: contact), "555-1234")
    }

    func testPrimaryPhoneNumberIsNilWithoutNumbers() {
        XCTAssertNil(ContactHelpers.primaryPhoneNumber(of: CNMutableContact()))
    }
}
