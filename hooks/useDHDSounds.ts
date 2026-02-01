import { useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';

export function useDHDSounds() {
    const glyphHitPlayer = useAudioPlayer(require('@/assets/sounds/SG-1-Glyph-Hit-1.wav'));
    const kawooshPlayer = useAudioPlayer(require('@/assets/sounds/Kawoosh-1.wav'));
    const abortPlayer = useAudioPlayer(require('@/assets/sounds/SG-1-Dial-Abort.wav'));

    // Cleanup audio players on unmount
    useEffect(() => {
        return () => {
            try {
                if (glyphHitPlayer.playing) glyphHitPlayer.pause();
                if (kawooshPlayer.playing) kawooshPlayer.pause();
                if (abortPlayer.playing) abortPlayer.pause();
            } catch (e) {
                // Player already cleaned up, ignore
            }
        };
    }, [glyphHitPlayer, kawooshPlayer, abortPlayer]);

    return {
        playGlyphHit: () => {
            try {
                glyphHitPlayer.seekTo(0);
                glyphHitPlayer.play();
            } catch (e) {
                // Audio player may be deallocated, ignore
            }
        },
        playKawoosh: () => {
            try {
                kawooshPlayer.seekTo(0);
                kawooshPlayer.play();
            } catch (e) {
                // Audio player may be deallocated, ignore
            }
        },
        playDialAbort: () => {
            try {
                abortPlayer.seekTo(0)
                abortPlayer.play();
            } catch (e) {
                // Audio player may be deallocated, ignore
            }
        },
    };
}
