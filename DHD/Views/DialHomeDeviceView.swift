import SwiftUI

/// The DHD: 38 glyph keys around the activation dome. Replaces the Expo app's `DialHomeDevice` SVG component.
///
/// Drawn from three pixel-aligned Blender renders (see README › Artwork): `DHDBase`, then `DHDKeysLit` clipped to each
/// dialed key's path, then `DHDDomeLit` clipped to the dome. Taps are hit-tested against the same `DHDArtwork` paths.
///
/// Around the renders: a contact shadow, a bloom over lit keys and the dome, keys that sink while pressed, a dome that
/// breathes once the address is complete, and the kawoosh each time `wormholes` changes.
struct DialHomeDeviceView: View {
    let dialedSlugs: [String]
    let isDomeActive: Bool
    var isEngaged = false
    var wormholes = 0
    var tilt: DeviceTilt?
    let onGlyphTap: (String) -> Void
    let onDomeTap: () -> Void

    @GestureState private var touch: Touch?
    /// Follows `isDomeActive`, but lights `Theme.Timing.domeLightDelay` late so the seventh key lights first.
    @State private var isDomeLit = false
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    /// A touch in progress: what it started on, and whether it's still over it (it activates on release).
    private struct Touch: Equatable {
        let target: DHDArtwork.Target
        var isInside = true
    }

    var body: some View {
        GeometryReader { geometry in
            let transform = DHDArtwork.transform(fitting: geometry.size)
            let artworkRect = CGRect(origin: .zero, size: DHDArtwork.size).applying(transform)
            let pedestal = Self.pedestal.applying(transform)
            let domePath = DHDArtwork.dome[0].path.applying(transform)
            ZStack {
                ContactShadow(pedestal: pedestal, tilt: tilt)

                ZStack {
                    layer("DHDBase", in: artworkRect)
                    if let slug = pressedGlyph, let key = DHDArtwork.keys.first(where: { $0.slug == slug }) {
                        pressed("DHDBase", path: key.hitArea.applying(transform), in: artworkRect, size: geometry.size,
                                depth: 0.96)
                    }
                    litKeys(in: artworkRect, transform: transform)
                    litKeys(in: artworkRect, transform: transform)
                        .compositingGroup()
                        .blur(radius: artworkRect.width * 0.012)
                        .blendMode(.plusLighter)
                        .opacity(0.55)
                        .allowsHitTesting(false)
                    layer("DHDDomeLit", in: artworkRect)
                        .clipShape(domePath)
                        .opacity(isDomeLit ? 1 : 0)
                    domeGlow(path: domePath, in: artworkRect)
                    if pressedDome {
                        pressed(isDomeLit ? "DHDDomeLit" : "DHDBase", path: domePath, in: artworkRect,
                                size: geometry.size, depth: 0.97)
                    }
                }
                .frame(width: geometry.size.width, height: geometry.size.height)
                .animation(.easeOut(duration: 0.08), value: touch)
                .wormholeEffect(origin: CGPoint(x: domePath.boundingRect.midX, y: domePath.boundingRect.midY),
                                in: geometry.size, radius: pedestal.width * 0.55, trigger: wormholes)
            }
            .frame(width: geometry.size.width, height: geometry.size.height)
            .contentShape(Rectangle())
            .gesture(pressGesture(transform: transform))
            .accessibilityHidden(true)
            .overlay(alignment: .topLeading) {
                accessibilityElements(transform: transform)
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel("Dial Home Device")
        .task(id: isDomeActive) {
            if isDomeActive {
                try? await Task.sleep(for: Theme.Timing.domeLightDelay)
                guard !Task.isCancelled else { return }
            }
            // Fades up like a light warming; goes out quickly on reset.
            withAnimation(isDomeActive ? .easeInOut(duration: Theme.Timing.domeLightFade) : .easeOut(duration: 0.15)) {
                isDomeLit = isDomeActive
            }
        }
    }

    // MARK: Layers

    /// A render placed over `rect`, in a view spanning the whole geometry so clip paths use the same coordinates.
    private func layer(_ name: String, in rect: CGRect) -> some View {
        Image(name)
            .resizable()
            .interpolation(.high)
            .frame(width: rect.width, height: rect.height)
            .position(x: rect.midX, y: rect.midY)
    }

    private func litKeys(in rect: CGRect, transform: CGAffineTransform) -> some View {
        ZStack {
            ForEach(DHDArtwork.keys, id: \.slug) { key in
                let dialed = dialedSlugs.contains(key.slug)
                layer("DHDKeysLit", in: rect)
                    .clipShape(key.hitArea.applying(transform))
                    .opacity(dialed ? 1 : 0)
                    .animation(.easeOut(duration: 0.15), value: dialed)
            }
        }
    }

    /// The part of `name` inside `path`, sunk into its seat: shrunk about its center over a dark gap, and darkened.
    private func pressed(_ name: String, path: Path, in rect: CGRect, size: CGSize, depth: CGFloat) -> some View {
        let bounds = path.boundingRect
        return ZStack {
            path.fill(Color.black.opacity(0.6))
            layer(name, in: rect)
                .clipShape(path)
                .brightness(-0.08)
                .scaleEffect(depth, anchor: UnitPoint(x: bounds.midX / size.width, y: bounds.midY / size.height))
        }
        .transition(.opacity)
        .allowsHitTesting(false)
    }

    /// Bloom over the lit dome. Breathes while it waits to be pressed, flares while the gate is engaged.
    @ViewBuilder
    private func domeGlow(path: Path, in rect: CGRect) -> some View {
        let glow = layer("DHDDomeLit", in: rect)
            .clipShape(path)
            .blur(radius: path.boundingRect.width * 0.12)
            .blendMode(.plusLighter)
            .allowsHitTesting(false)
        if isDomeLit {
            Group {
                if isEngaged || reduceMotion {
                    glow.opacity(isEngaged ? 1 : 0.7)
                } else {
                    glow.phaseAnimator([0.35, 0.9]) { view, opacity in
                        view.opacity(opacity)
                    } animation: { _ in
                        .easeInOut(duration: 1.1)
                    }
                }
            }
            .transition(.opacity)
        }
    }

    // MARK: Touch

    private var pressedGlyph: String? {
        guard let touch, touch.isInside, !isDomeActive, case .glyph(let slug) = touch.target,
              !dialedSlugs.contains(slug) else { return nil }
        return slug
    }

    private var pressedDome: Bool {
        touch?.isInside == true && touch?.target == .dome
    }

    private func pressGesture(transform: CGAffineTransform) -> some Gesture {
        let inverse = transform.inverted()
        // GestureState resets by itself when the gesture ends or is cancelled, so a press never sticks.
        return DragGesture(minimumDistance: 0, coordinateSpace: .local)
            .updating($touch) { value, touch, _ in
                guard let target = DHDArtwork.target(at: value.startLocation.applying(inverse)) else { return }
                touch = Touch(target: target,
                              isInside: DHDArtwork.target(at: value.location.applying(inverse)) == target)
            }
            .onEnded { value in
                guard let target = DHDArtwork.target(at: value.startLocation.applying(inverse)),
                      DHDArtwork.target(at: value.location.applying(inverse)) == target else { return }
                handleTap(on: target)
            }
    }

    private func handleTap(on target: DHDArtwork.Target) {
        switch target {
        case .glyph(let slug) where !isDomeActive:
            onGlyphTap(slug)
        case .dome:
            onDomeTap()
        default:
            break
        }
    }

    // MARK: Accessibility

    /// Invisible per-key and dome elements for VoiceOver and UI tests. Touches pass through to the renders.
    private func accessibilityElements(transform: CGAffineTransform) -> some View {
        ZStack(alignment: .topLeading) {
            ForEach(DHDArtwork.keys, id: \.slug) { key in
                let dialed = dialedSlugs.contains(key.slug)
                accessibilityFrame(key.hitArea.boundingRect.applying(transform))
                    .accessibilityLabel(Glyph.named(key.slug)?.name ?? key.slug)
                    .accessibilityIdentifier("glyph-\(key.slug)")
                    .accessibilityAddTraits(dialed ? [.isButton, .isSelected] : .isButton)
                    .accessibilityAction { handleTap(on: .glyph(key.slug)) }
            }
            accessibilityFrame(DHDArtwork.dome[0].path.boundingRect.applying(transform))
                .accessibilityLabel("Activation dome")
                .accessibilityHint("Engages the gate once seven glyphs are dialed.")
                .accessibilityIdentifier("dome")
                .accessibilityAddTraits(.isButton)
                .accessibilityAction { handleTap(on: .dome) }
        }
        .allowsHitTesting(false)
    }

    private func accessibilityFrame(_ rect: CGRect) -> some View {
        Color.clear
            .frame(width: rect.width, height: rect.height)
            .offset(x: rect.minX, y: rect.minY)
            .accessibilityElement()
    }

    // MARK: Geometry

    /// The rendered stone pedestal, in artwork units: centered on the dome, reaching 14 units past the outermost key
    /// (as `build_dhd_scene.py` builds it).
    private static let pedestal: CGRect = {
        let dome = DHDArtwork.dome[0].path.boundingRect
        let center = CGPoint(x: dome.midX, y: dome.midY)
        let radius = DHDArtwork.keys
            .flatMap { key -> [CGPoint] in
                let bounds = key.hitArea.boundingRect
                // The bounds' edge midpoints: on a key's curved outer edge, unlike the bounds' corners.
                return [CGPoint(x: bounds.minX, y: bounds.midY), CGPoint(x: bounds.maxX, y: bounds.midY),
                        CGPoint(x: bounds.midX, y: bounds.minY), CGPoint(x: bounds.midX, y: bounds.maxY)]
            }
            .map { hypot($0.x - center.x, $0.y - center.y) }
            .max() ?? DHDArtwork.size.width / 2
        let r = radius + 14
        return CGRect(x: center.x - r, y: center.y - r, width: 2 * r, height: 2 * r)
    }()
}

/// The DHD's shadow on the floor, thrown down and right by the upper-left key light. Drifts with the device tilt so
/// the light seems fixed in the room.
private struct ContactShadow: View {
    let pedestal: CGRect
    let tilt: DeviceTilt?

    var body: some View {
        let reach = pedestal.width * 0.035
        let dx = reach * (0.6 + (tilt?.x ?? 0))
        let dy = reach * (1 + (tilt?.y ?? 0))
        Circle()
            .fill(RadialGradient(colors: [.black, .black.opacity(0.75), .clear], center: .center,
                                 startRadius: pedestal.width * 0.4, endRadius: pedestal.width * 0.58))
            .frame(width: pedestal.width * 1.16, height: pedestal.height * 1.16)
            .position(x: pedestal.midX + dx, y: pedestal.midY + dy)
            .allowsHitTesting(false)
    }
}

#Preview {
    DialHomeDeviceView(dialedSlugs: ["earth", "taurus", "leo"], isDomeActive: false,
                       onGlyphTap: { _ in }, onDomeTap: {})
        .background { StageBackground() }
}
