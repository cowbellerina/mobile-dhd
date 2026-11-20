import ContactsUI
import UIKit

struct PickedContact: Equatable, Sendable {
    let name: String
    let phoneNumber: String
}

/// Presents the system contact picker. It runs out of process, so no Contacts permission is needed.
///
/// Contacts with one phone number are picked directly; for several, the user chooses which number.
@MainActor
final class ContactPicker: NSObject, CNContactPickerDelegate {
    /// Keeps the delegate alive while the picker is on screen.
    private static var active: ContactPicker?
    private var continuation: CheckedContinuation<PickedContact?, Never>?

    /// - Returns: The chosen contact, or `nil` if the user cancelled.
    static func pick() async -> PickedContact? {
        guard let presenter = await topViewController() else {
            Log.contacts.error("No view controller to present the contact picker from")
            return nil
        }
        let picker = ContactPicker()
        active = picker
        defer { active = nil }

        return await withCheckedContinuation { continuation in
            picker.continuation = continuation
            let controller = CNContactPickerViewController()
            controller.delegate = picker
            controller.displayedPropertyKeys = [CNContactPhoneNumbersKey]
            controller.predicateForEnablingContact = NSPredicate(format: "phoneNumbers.@count > 0")
            controller.predicateForSelectionOfContact = NSPredicate(format: "phoneNumbers.@count == 1")
            presenter.present(controller, animated: true)
        }
    }

    private func finish(_ contact: PickedContact?) {
        continuation?.resume(returning: contact)
        continuation = nil
    }

    nonisolated func contactPickerDidCancel(_ picker: CNContactPickerViewController) {
        MainActor.assumeIsolated { finish(nil) }
    }

    nonisolated func contactPicker(_ picker: CNContactPickerViewController, didSelect contact: CNContact) {
        let picked = ContactHelpers.primaryPhoneNumber(of: contact).map {
            PickedContact(name: ContactHelpers.name(of: contact), phoneNumber: $0)
        }
        MainActor.assumeIsolated { finish(picked) }
    }

    nonisolated func contactPicker(_ picker: CNContactPickerViewController, didSelect contactProperty: CNContactProperty) {
        let picked = (contactProperty.value as? CNPhoneNumber).map {
            PickedContact(name: ContactHelpers.name(of: contactProperty.contact), phoneNumber: $0.stringValue)
        }
        MainActor.assumeIsolated { finish(picked) }
    }

    /// The topmost view controller, waiting briefly for an in-flight transition (e.g. a dismissing alert) to end.
    private static func topViewController() async -> UIViewController? {
        for _ in 0..<20 {
            let window = UIApplication.shared.connectedScenes
                .compactMap { $0 as? UIWindowScene }
                .flatMap(\.windows)
                .first(where: \.isKeyWindow)
            guard var top = window?.rootViewController else { return nil }
            while let presented = top.presentedViewController {
                top = presented
            }
            if !top.isBeingDismissed, !top.isBeingPresented {
                return top
            }
            try? await Task.sleep(for: .milliseconds(50))
        }
        return nil
    }
}
