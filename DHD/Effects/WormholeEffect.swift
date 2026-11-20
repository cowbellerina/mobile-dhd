import SwiftUI

/// The kawoosh: each time `trigger` changes, the content jolts outward, a blue-white flash blooms from `origin` and a
/// ring of light runs out from it. Reduce Motion keeps only a short, still flash.
struct WormholeEffect: ViewModifier {
    /// Where the wormhole forms, in the content's coordinates, and the same point as a unit point of its size.
    let origin: CGPoint
    let anchor: UnitPoint
    /// Radius of the flash at full bloom; the ring travels to twice this.
    let radius: CGFloat
    let trigger: Int
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    func body(content: Content) -> some View {
        let reduceMotion = reduceMotion, anchor = anchor, origin = origin, radius = radius
        return content
            // The shockwave: the DHD jolts outward from the dome and settles.
            .keyframeAnimator(initialValue: 1.0, trigger: trigger) { view, scale in
                view.scaleEffect(reduceMotion ? 1 : scale, anchor: anchor)
            } keyframes: { _ in
                MoveKeyframe(1.0)
                CubicKeyframe(1.025, duration: 0.09)
                SpringKeyframe(1.0, duration: 0.6, spring: .bouncy(duration: 0.5, extraBounce: 0.2))
            }
            .overlay {
                Color.clear
                    .keyframeAnimator(initialValue: Burst(), trigger: trigger) { view, burst in
                        view.overlay { BurstView(burst: burst, origin: origin, radius: radius, reduceMotion: reduceMotion) }
                    } keyframes: { _ in
                        KeyframeTrack(\.flash) {
                            MoveKeyframe(0)
                            LinearKeyframe(0.7, duration: 0.08)
                            CubicKeyframe(0, duration: 1.1)
                        }
                        KeyframeTrack(\.flashScale) {
                            MoveKeyframe(0.15)
                            SpringKeyframe(1.0, duration: 0.5, spring: .bouncy)
                            CubicKeyframe(1.4, duration: 0.7)
                        }
                        KeyframeTrack(\.ring) {
                            MoveKeyframe(0)
                            CubicKeyframe(1, duration: 0.9)
                        }
                    }
                    .blendMode(.plusLighter)
                    .allowsHitTesting(false)
            }
    }

    fileprivate struct Burst {
        var flash: Double = 0
        var flashScale: CGFloat = 0.15
        var ring: CGFloat = 0
    }
}

/// The flash and ring at one moment of the burst.
private struct BurstView: View {
    let burst: WormholeEffect.Burst
    let origin: CGPoint
    let radius: CGFloat
    let reduceMotion: Bool

    var body: some View {
        let blue = Color(red: 0.25, green: 0.55, blue: 1)
        ZStack {
            RadialGradient(colors: [Color(red: 0.85, green: 0.95, blue: 1), blue, .clear],
                           center: .center, startRadius: 0, endRadius: radius)
                .frame(width: radius * 2, height: radius * 2)
                .scaleEffect(reduceMotion ? 1 : burst.flashScale)
                .opacity(burst.flash)
            if !reduceMotion, burst.ring > 0, burst.ring < 1 {
                Circle()
                    .strokeBorder(blue, lineWidth: radius * 0.08 * (1 - burst.ring))
                    .blur(radius: radius * 0.03)
                    .frame(width: radius * 4 * burst.ring, height: radius * 4 * burst.ring)
                    .opacity(0.9 * (1 - burst.ring))
            }
        }
        .position(origin)
    }
}

extension View {
    func wormholeEffect(origin: CGPoint, in size: CGSize, radius: CGFloat, trigger: Int) -> some View {
        let anchor = UnitPoint(x: size.width > 0 ? origin.x / size.width : 0.5,
                               y: size.height > 0 ? origin.y / size.height : 0.5)
        return modifier(WormholeEffect(origin: origin, anchor: anchor, radius: radius, trigger: trigger))
    }
}
