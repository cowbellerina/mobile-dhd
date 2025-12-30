import React, { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Alert, Linking, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Contacts from 'expo-contacts';
import * as Crypto from 'expo-crypto';
import * as Haptics from 'expo-haptics';
import ChevronDisplay from '@/components/ChevronDisplay';
import { DialHomeDevice } from '@/components/DialHomeDevice';
import { useDialing } from '@/hooks/useDialing';
import { useDHDSounds } from '@/hooks/useDHDSounds';
import { StorageService } from '@/services/StorageService';
import { CartoucheEntry } from '@/types';
import { logger } from '@/utils/logger';
import { Colors, Spacing, FontSize, Animation } from '@/constants/Theme';

export default function Index() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { sequence, dialGlyph, reset } = useDialing();
  const { playGlyphHit, playKawoosh, playDialAbort } = useDHDSounds();
  const isDomeActive = sequence.length === 7;
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoDialInProgressRef = useRef(false);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  // Auto-dial sequence from cartouche re-dial action
  useEffect(() => {
    if (!params.autoDialSequence || autoDialInProgressRef.current) return;

    const performAutoDial = async () => {
      try {
        autoDialInProgressRef.current = true;

        // Parse and validate sequence
        const sequenceToDial = JSON.parse(params.autoDialSequence as string);
        if (!Array.isArray(sequenceToDial) || sequenceToDial.length !== 7) {
          logger.error('Invalid auto-dial sequence format');
          return;
        }

        // Reset existing sequence if present
        if (sequence.length > 0) {
          reset();
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Dial glyphs sequentially with 1s delay
        for (let i = 0; i < sequenceToDial.length; i++) {
          dialGlyph(sequenceToDial[i]);
          playGlyphHit();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

          if (i < sequenceToDial.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        // Clear params after completion
        router.setParams({ autoDialSequence: undefined });

      } catch (error) {
        logger.error('Auto-dial error:', error);
        Alert.alert('Error', 'Failed to auto-dial sequence.');
      } finally {
        autoDialInProgressRef.current = false;
      }
    };

    performAutoDial();
  }, [params.autoDialSequence, sequence.length, reset, dialGlyph, playGlyphHit, router]);

  const handleGlyphPress = useCallback((slug: string) => {
    if (autoDialInProgressRef.current || isDomeActive || sequence.includes(slug)) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dialGlyph(slug);
    playGlyphHit();
  }, [isDomeActive, sequence, dialGlyph, playGlyphHit]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const handleSaveNewDestination = useCallback(async () => {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
            const contact = await Contacts.presentContactPickerAsync();
            if (contact && contact.phoneNumbers && contact.phoneNumbers.length > 0) {
                const phoneNumber = contact.phoneNumbers[0].number;
                if (!phoneNumber) return;

                const contactName = contact.name ||
                                    [contact.firstName, contact.middleName, contact.lastName]
                                      .filter(part => part)
                                      .join(' ')
                                      .trim() ||
                                    'Unknown';

                const newEntry: CartoucheEntry = {
                    id: Crypto.randomUUID(),
                    name: contactName,
                    phoneNumber: phoneNumber,
                    dialingSequence: sequence
                };

                await StorageService.saveCartoucheEntry(newEntry);
                Alert.alert("Saved", `${newEntry.name} added to Cartouche.`);
                reset();
            }
        } else {
            Alert.alert("Permission denied", "Contacts permission is required to save addresses.");
        }
      } catch (e) {
          logger.error("Contact picker error", e);
      }
  }, [sequence, reset]);

  const handleDomePress = useCallback(async () => {
    if (!isDomeActive) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      const cartouche = await StorageService.loadCartouche();

      const match = cartouche.find(entry =>
        entry.dialingSequence.length === sequence.length &&
        entry.dialingSequence.every((slug, index) => slug === sequence[index])
      );

      if (match) {
        playKawoosh();
        Linking.openURL(`tel:${match.phoneNumber}`);
        resetTimerRef.current = setTimeout(reset, Animation.timeout.resetAfterDial);
      } else {
        playDialAbort();
        Alert.alert(
            "Unknown Address",
            "No destination found for this sequence. Do you want to save it?",
            [
                { text: "Cancel", style: "cancel", onPress: reset },
                { text: "Save", onPress: handleSaveNewDestination }
            ]
        );
      }
    } catch (e) {
      logger.error("Dialing error", e);
      Alert.alert("Error", "Failed to engage gate.");
    }
  }, [isDomeActive, sequence, playKawoosh, playDialAbort, reset, handleSaveNewDestination]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ChevronDisplay glyphSlugs={sequence} />
        <TouchableOpacity onPress={handleReset} style={styles.abortButton} testID="abort-button">
             <Text style={styles.abortText}>✕</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.main}>
        <DialHomeDevice
          style={styles.dhd}
          onGlyphPress={handleGlyphPress}
          dialedSlugs={sequence}
          onDomePress={handleDomePress}
          isDomeActive={isDomeActive}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.sm,
  },
  main: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dhd: {
    width: '100%',
    height: '100%',
  },
  abortButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  abortText: {
    color: Colors.text.muted,
    fontSize: FontSize.xl,
    fontWeight: 'bold',
  }
});