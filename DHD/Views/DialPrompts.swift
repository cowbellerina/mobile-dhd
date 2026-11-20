import SwiftUI

/// Offered when an address matches no saved contact: the address as lit chevrons, with saving it to a contact as the
/// main action. Swiping the sheet away keeps the address dialed, so tapping the dome brings it back; Discard clears it.
struct UnknownAddressSheet: View {
    let sequence: [String]
    let onSave: () -> Void
    let onDiscard: () -> Void

    var body: some View {
        VStack(spacing: Theme.Spacing.md) {
            VStack(spacing: Theme.Spacing.xs) {
                Text(DHDViewModel.Alert.unknownAddress.title)
                    .font(.title2.bold())
                Text(DHDViewModel.Alert.unknownAddress.message)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .fixedSize(horizontal: false, vertical: true)
            }

            ChevronDisplayView(sequence: sequence, tileSize: 36, verticalPadding: Theme.Spacing.xs)
                .accessibilityElement(children: .ignore)
                .accessibilityLabel("Address")
                .accessibilityValue(sequence.compactMap { Glyph.named($0)?.name }.joined(separator: ", "))

            VStack(spacing: Theme.Spacing.sm) {
                Button(action: onSave) {
                    Label("Save to Contact…", systemImage: "person.crop.circle.badge.plus")
                        .frame(maxWidth: .infinity)
                }
                .prominentButtonStyle()
                .accessibilityIdentifier("save-address-button")

                Button("Discard", role: .destructive, action: onDiscard)
                    .frame(maxWidth: .infinity, minHeight: 44)
                    .accessibilityIdentifier("discard-address-button")
            }
            .controlSize(.large)
        }
        .padding(.horizontal, Theme.Spacing.lg)
        .padding(.top, Theme.Spacing.xl)
        .padding(.bottom, Theme.Spacing.sm)
        .presentationDetents([.height(340)])
        .presentationDragIndicator(.visible)
    }
}

/// A brief confirmation that slides in after an address is saved, instead of an alert to dismiss.
struct SavedBanner: View {
    let message: String

    var body: some View {
        Label {
            Text(message)
                .font(.subheadline.weight(.semibold))
        } icon: {
            Image(systemName: "checkmark.circle.fill")
                .foregroundStyle(Theme.Colors.chevronAmber)
        }
        .padding(.horizontal, Theme.Spacing.md)
        .padding(.vertical, 12)
        .glassCapsule()
        .padding(.top, Theme.Spacing.sm)
        .accessibilityElement(children: .combine)
        .accessibilityIdentifier("saved-banner")
        .onAppear {
            AccessibilityNotification.Announcement(message).post()
        }
    }
}

private extension View {
    @ViewBuilder
    func prominentButtonStyle() -> some View {
        if #available(iOS 26, *) {
            buttonStyle(.glassProminent).tint(Theme.Colors.chevronAmber)
        } else {
            buttonStyle(.borderedProminent).tint(Theme.Colors.chevronAmber)
        }
    }

    @ViewBuilder
    func glassCapsule() -> some View {
        if #available(iOS 26, *) {
            glassEffect(.regular, in: .capsule)
        } else {
            background(.ultraThinMaterial, in: Capsule())
                .overlay(Capsule().strokeBorder(.white.opacity(0.12), lineWidth: 0.5))
        }
    }
}

#Preview("Unknown address") {
    Color.black.sheet(isPresented: .constant(true)) {
        UnknownAddressSheet(sequence: ["earth", "taurus", "leo", "virgo", "scorpius", "aries", "orion"],
                            onSave: {}, onDiscard: {})
    }
}

#Preview("Saved") {
    Color.black.overlay(alignment: .top) { SavedBanner(message: "Anna Haro added to Cartouche.") }
}
