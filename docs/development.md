# Development

How the app is put together: tests, logging, source layout, sounds and haptics, and data storage.
For setup, see the [README](../README.md); for artwork, [Artwork](artwork.md); for releases, [Deployment](deployment.md).

## Testing

In Xcode press ⌘U, or from the command line:

```bash
scripts/test.sh
```

`scripts/test.sh` regenerates the project and runs `xcodebuild test` on a simulator picked by UDID: an iPhone on the
newest iOS runtime, or the one named in `SIMULATOR` (name or UDID). Extra arguments go to `xcodebuild`.

- `DHDTests`: unit tests (logic, storage, migration, artwork, `DHDViewModel` with fakes).
- `DHDUITests`: end-to-end UI tests (dialing, save sheet and banner, contact picker, Cartouche list, re-dial,
  delete). Each launch uses a fresh scratch Cartouche via the `DHD_CARTOUCHE_FILE` environment variable, which also
  skips the AsyncStorage migration. Tests can seed that file before launch (`DHDUITestCase.launch(cartouche:)`).
  Contact tests use the simulator's built-in sample contacts (Anna Haro, Kate Bell) and are skipped if they're missing.

Run only one suite with `scripts/test.sh -only-testing:DHDTests` or `-only-testing:DHDUITests`.

## Logs

Logging uses `os.Logger` with subsystem `com.cowbellerina.mobile-dhd`. Run from Xcode to see logs in the debug
console. Otherwise use Console.app (filter by subsystem), or for the booted simulator:

```bash
xcrun simctl spawn booted log stream --info --predicate 'subsystem == "com.cowbellerina.mobile-dhd"'
```

## Project layout

| Path | Contents |
|---|---|
| `DHD/App` | App entry point and tab layout |
| `DHD/Screens` | DHD tab screen |
| `DHD/Cartouche` | Cartouche tab: saved addresses list and its view model |
| `DHD/Views` | Reusable views (`DialHomeDeviceView`, `ChevronDisplayView`, `StageBackground`, dial prompts) |
| `DHD/Effects` | Kawoosh effect, device tilt |
| `DHD/Artwork` | SVG path parser, DHD and chevron artwork and their path data |
| `art/dhd` | Blender source of the rendered DHD (layout SVG, `.blend`) |
| `scripts` | Blender scene and render scripts |
| `DHD/Models` | `Glyph`, `CartoucheEntry` |
| `DHD/Dialing` | Sequence validation, dialing session, dialing service, `DHDViewModel`, sounds and haptics |
| `DHD/Storage` | Cartouche JSON storage, migration from the Expo app's AsyncStorage |
| `DHD/Contacts` | System contact picker, contact name / phone helpers |
| `DHD/Support` | Logging |
| `DHD/Resources` | Asset catalog, sounds |
| `DHD/Theme` | Spacing and timings (colours are named colours in the asset catalog) |
| `DHDTests` | XCTest unit tests |
| `DHDUITests` | XCUITest UI tests |

## Sounds and haptics

`DHD/Resources/Sounds` holds the Expo app's sound effects (glyph hit, kawoosh, dial abort), played with
`AVAudioPlayer` in the `.ambient` audio session: they mix with other audio and respect the silent switch.

Haptics are `.sensoryFeedback` on `DHDScreen`, driven by view model state: a rigid tap per chevron, a heavy one for the
seventh, success when a wormhole forms and an error when the address is unknown.

## Data storage and migration

Saved addresses live in `Library/Application Support/cartouche.json`, in the same JSON format the Expo app used.

On launch, if that file doesn't exist yet, `AsyncStorageMigration` imports the Expo app's data from
`Library/Application Support/com.cowbellerina.mobile-dhd/RCTAsyncLocalStorage_V1/` (key `@dhd_cartouche_v1`, either
inline in `manifest.json` or in a separate MD5-named file for values over 1024 characters). The legacy files are left
in place. The outcome is logged under the `storage` category.
