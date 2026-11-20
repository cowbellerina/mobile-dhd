import CoreMotion
import Observation
import SwiftUI

/// How far the device is tilted from flat, from -1 to 1 on each axis (x right, y toward the bottom of the screen).
///
/// The DHD stage uses it to keep its light fixed in the world: as the phone tilts, the spotlight and the DHD's shadow
/// drift a few points, as if the DHD sat under a lamp. Stays at zero without motion hardware (the simulator) and is
/// never started when Reduce Motion is on.
@Observable
@MainActor
final class DeviceTilt {
    private(set) var x: Double = 0
    private(set) var y: Double = 0

    @ObservationIgnored private let manager = CMMotionManager()
    @ObservationIgnored private var users = 0

    func start() {
        users += 1
        guard users == 1, manager.isDeviceMotionAvailable else { return }
        manager.deviceMotionUpdateInterval = 1 / 30
        manager.startDeviceMotionUpdates(to: .main) { [weak self] motion, _ in
            guard let gravity = motion?.gravity else { return }
            MainActor.assumeIsolated { self?.update(x: gravity.x, y: gravity.y) }
        }
    }

    private func update(x newX: Double, y newY: Double) {
        // Ease toward the new reading so hand tremor doesn't jitter the light. Held at ~35°, not flat, is neutral.
        withAnimation(.linear(duration: 1 / 30)) {
            x += (max(-1, min(1, newX)) - x) * 0.2
            y += (max(-1, min(1, newY + 0.6)) - y) * 0.2
        }
    }

    func stop() {
        users = max(0, users - 1)
        guard users == 0 else { return }
        manager.stopDeviceMotionUpdates()
        x = 0
        y = 0
    }
}

extension View {
    /// Runs `tilt` while the view is on screen, unless Reduce Motion is on.
    func trackingTilt(_ tilt: DeviceTilt) -> some View {
        modifier(TrackingTilt(tilt: tilt))
    }
}

private struct TrackingTilt: ViewModifier {
    let tilt: DeviceTilt
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var isTracking = false

    func body(content: Content) -> some View {
        content
            .onAppear { setTracking(!reduceMotion) }
            .onDisappear { setTracking(false) }
            .onChange(of: reduceMotion) { _, reduce in setTracking(!reduce) }
    }

    private func setTracking(_ track: Bool) {
        guard track != isTracking else { return }
        isTracking = track
        track ? tilt.start() : tilt.stop()
    }
}
