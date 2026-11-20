import AVFoundation

/// Sound feedback for DHD events. Replaces the Expo app's `useDHDSounds`. Haptics are `.sensoryFeedback` in the views
/// (`DHDScreen`), driven by the view model's state.
@MainActor
protocol DHDFeedback: AnyObject {
    func glyphEncoded()
    func wormholeEstablished()
    func dialFailed()
}

enum DHDSound: String, CaseIterable {
    case glyphHit = "SG-1-Glyph-Hit-1"
    case kawoosh = "Kawoosh-1"
    case dialAbort = "SG-1-Dial-Abort"
}

@MainActor
final class LiveDHDFeedback: DHDFeedback {
    private let sounds = SoundPlayer()

    init() {
        Task { [sounds] in await sounds.load() }
    }

    func glyphEncoded() {
        play(.glyphHit)
    }

    func wormholeEstablished() {
        play(.kawoosh)
    }

    func dialFailed() {
        play(.dialAbort)
    }

    private func play(_ sound: DHDSound) {
        Task { [sounds] in await sounds.play(sound) }
    }
}

/// Owns the audio session and players. An actor so their setup and playback, which can block (iOS flags it as a
/// hang risk on the main thread), run off the main thread.
private actor SoundPlayer {
    private var players: [DHDSound: AVAudioPlayer] = [:]

    func load() {
        do {
            // Ambient: mixes with other audio and respects the silent switch, like expo-audio's default.
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.ambient)
            try session.setActive(true)
        } catch {
            Log.audio.error("Failed to activate audio session: \(error.localizedDescription, privacy: .public)")
        }

        for sound in DHDSound.allCases {
            guard let url = Bundle.main.url(forResource: sound.rawValue, withExtension: "wav") else {
                Log.audio.error("Missing sound \(sound.rawValue, privacy: .public)")
                continue
            }
            do {
                let player = try AVAudioPlayer(contentsOf: url)
                player.prepareToPlay()
                players[sound] = player
            } catch {
                Log.audio.error("Failed to load \(sound.rawValue, privacy: .public): \(error.localizedDescription, privacy: .public)")
            }
        }
    }

    /// Restarts the sound if it's already playing, so rapid taps each get a hit.
    func play(_ sound: DHDSound) {
        guard let player = players[sound] else { return }
        player.currentTime = 0
        player.play()
    }
}
