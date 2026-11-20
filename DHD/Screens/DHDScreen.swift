import SwiftUI

/// The DHD tab: chevron display, abort button, and the DHD itself, on a dim stage lit from the upper left.
@MainActor
struct DHDScreen: View {
    let model: DHDViewModel
    @State private var tilt = DeviceTilt()

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: Theme.Spacing.sm) {
                ChevronDisplayView(sequence: model.sequence)
                AbortButton(action: model.reset)
            }
            .padding(.top, Theme.Spacing.sm)

            DialHomeDeviceView(
                dialedSlugs: model.sequence,
                isDomeActive: model.isDomeActive,
                isEngaged: model.isEngaged,
                wormholes: model.wormholes,
                tilt: tilt,
                onGlyphTap: model.glyphTapped,
                onDomeTap: { Task { await model.domeTapped() } }
            )
            .padding(.horizontal, Theme.Spacing.sm)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            // The saved banner sits in the open space above the DHD, clear of the chevrons and the abort button.
            .overlay(alignment: .top) {
                if case .saved = model.alert, let alert = model.alert {
                    SavedBanner(message: alert.message)
                        .transition(.offset(y: -12).combined(with: .opacity))
                }
            }
        }
        .background { StageBackground(tilt: tilt).ignoresSafeArea() }
        .trackingTilt(tilt)
        .sensoryFeedback(trigger: model.sequence.count) { old, new in
            guard new > old else { return nil }
            // The seventh chevron locks harder: the address is complete.
            return new == DialingConfig.maxSequenceLength
                ? .impact(weight: .heavy, intensity: 1)
                : .impact(flexibility: .rigid, intensity: 0.8)
        }
        .sensoryFeedback(.success, trigger: model.wormholes)
        .sensoryFeedback(.error, trigger: model.failedDials)
        .sheet(isPresented: isPresented(.unknownAddress)) {
            UnknownAddressSheet(
                sequence: model.sequence,
                onSave: {
                    model.alert = nil
                    Task { await model.saveAddress() }
                },
                onDiscard: {
                    model.alert = nil
                    model.reset()
                }
            )
        }
        .animation(.spring(duration: 0.35), value: model.alert)
        .task(id: model.alert) {
            // The saved banner confirms and gets out of the way.
            guard case .saved = model.alert else { return }
            try? await Task.sleep(for: Theme.Timing.savedBannerDuration)
            if case .saved = model.alert { model.alert = nil }
        }
        .alert(model.alert?.title ?? "", isPresented: isPresented(.error("")), presenting: model.alert) { _ in
            Button("OK") {}
        } message: { alert in
            Text(alert.message)
        }
    }

    /// Whether `model.alert` is of the same kind as `kind` (ignoring associated values); setting false clears it.
    private func isPresented(_ kind: DHDViewModel.Alert) -> Binding<Bool> {
        Binding(
            get: { model.alert?.kind == kind.kind },
            set: { if !$0, model.alert?.kind == kind.kind { model.alert = nil } }
        )
    }
}

/// Clears the dialed address. A round glass button on iOS 26+, material before.
private struct AbortButton: View {
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: "xmark")
                .font(.system(size: 17, weight: .semibold))
                .foregroundStyle(.secondary)
                .frame(width: 44, height: 44)
                .contentShape(Circle())
        }
        .buttonStyle(.plain)
        .glassCircle()
        .accessibilityLabel("Abort")
        .accessibilityIdentifier("abort-button")
    }
}

private extension View {
    @ViewBuilder
    func glassCircle() -> some View {
        if #available(iOS 26, *) {
            glassEffect(.regular.interactive(), in: .circle)
        } else {
            background(.ultraThinMaterial, in: Circle())
                .overlay(Circle().strokeBorder(.white.opacity(0.12), lineWidth: 0.5))
        }
    }
}

#Preview {
    DHDScreen(model: .live())
}
