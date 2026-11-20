import SwiftUI

/// The dark room the app sits in: a warm spotlight from the upper left, falling off to black. With a `tilt`, the pool
/// of light drifts against the device tilt, so it reads as a lamp fixed above the DHD rather than a gradient painted
/// on the glass.
struct StageBackground: View {
    var tilt: DeviceTilt?

    var body: some View {
        GeometryReader { geometry in
            let center = UnitPoint(x: 0.44 - (tilt?.x ?? 0) * 0.06, y: 0.5 - (tilt?.y ?? 0) * 0.05)
            ZStack {
                Color.black
                RadialGradient(
                    colors: [Color(.stageLight), Color(.stageMid), Color(.stageDeep), .black],
                    center: center, startRadius: 0, endRadius: max(geometry.size.width, geometry.size.height) * 0.62
                )
            }
        }
        .allowsHitTesting(false)
    }
}
