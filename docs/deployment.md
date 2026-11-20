# Deployment

Unlike the Expo app there are **no over-the-air updates**: every change, including UI-only fixes, goes through a
build, upload and App Store review.

---

## One-time setup

### Done

These are already set up in `project.yml` (September 2026):

- **Toolchain:** Xcode 27 on macOS 27. The Xcode 15 project-format workaround is removed. When Apple raises the
  minimum SDK (see [Upcoming requirements](https://developer.apple.com/news/upcoming-requirements/)), update Xcode
  and re-run the tests.
- **Signing:** automatic signing via `Config/Signing.xcconfig`. The Team ID is not committed: set `DEVELOPMENT_TEAM`
  in the gitignored `Config/Signing.local.xcconfig` (copy the `.example` next to it). Xcode creates the distribution certificate and
  App Store profile the first time you archive; sign in to your Apple ID in Xcode → *Settings* → *Accounts* first.
- **Distribution certificate:** use a local *Apple Distribution* certificate (Xcode → *Settings* → *Accounts* →
  *Manage Certificates…* → *+*), not the cloud-managed one Xcode creates by default. With the cloud-managed
  certificate, Xcode's export encodes the "å" in the certificate name differently from the certificate itself, and
  App Store Connect rejects the upload as *Invalid Signature* (ITMS-90035). `ExportOptions.plist` below selects the
  local certificate.
- **Build number:** `CURRENT_PROJECT_VERSION: "6"`. EAS managed the Expo app's build numbers remotely, and the
  highest it ever produced was 5 (1.1.0, 2026-03-10), even though its counter was later set back to 4. From now on,
  build numbers are bumped by hand in `project.yml` (see *Release* below).

### Privacy

The native app picks contacts with the system contact picker, which runs outside the app, so it **no longer asks for
Contacts permission**. Nothing else changed: no data leaves the device.

1. Update the privacy policy: set the *Last updated* date in [`PRIVACY.md`](../PRIVACY.md). The policy is served from
   `main`, so it only takes effect once this branch has replaced `main`. In App Store Connect → *App Information*,
   check that the *Privacy Policy URL* is `https://github.com/cowbellerina/mobile-dhd/blob/main/PRIVACY.md`.
2. In App Store Connect → *App Privacy*, confirm the answers still hold. With no data collected or sent off the
   device, *Data Not Collected* remains correct.

---

## Verify before every release

### Automated tests

```bash
scripts/test.sh
```

All unit and UI tests must pass. Contact UI tests are skipped if the simulator's sample contacts are missing.

### Upgrade from the Expo app (first native release only)

This is the release's main risk: existing users' saved addresses must carry over. Test the real upgrade path on a
device using TestFlight, which replaces the installed app and keeps its data like an App Store update does.

1. Install **DHD 1.1.0 from the App Store** on a test iPhone.
2. Save **at least 8 addresses**. Past about 7 entries AsyncStorage moves the data into a separate file, so this
   exercises both storage paths. Note the names.
3. Upload a native build and install it from **TestFlight** over the App Store version (see *Release*, steps 1–3).
4. Open the Cartouche tab: every address must be listed. Re-dial one and confirm the correct contact is called.
5. Optional: connect the iPhone to the Mac, open Console.app, select the device and filter by subsystem
   `com.cowbellerina.mobile-dhd`. On first launch you should see `Cartouche migration: migrated(entryCount: N)`.

The migration never deletes the Expo app's files, so if it fails, a fixed build can still import them. It only runs
while no native Cartouche exists. If a faulty build already created one, the fix has to handle that case.

### Manual checks on a device

The simulator can't cover these:

- [ ] Glyph, kawoosh and abort sounds play, and are muted by the silent switch
- [ ] Haptics on glyph taps, successful dial, redial and delete
- [ ] Dialing a saved address opens the call prompt with the right number
- [ ] Saving an address with the contact picker, including a contact with several numbers
- [ ] VoiceOver: glyph keys, dome, chevrons and Cartouche rows are announced and usable
- [ ] iPad: layout in portrait

---

## Release

### 1. Bump the version

In `project.yml`:

- `MARKETING_VERSION`: the user-facing version (e.g. `2.0.0` → `2.1.0`). The first native release is `2.0.0`, a
  major bump from the Expo app's `1.1.0` for the rewrite.
- `CURRENT_PROJECT_VERSION`: the build number, which must increase with **every** upload (including re-uploads of
  the same version).

Then regenerate the project:

```bash
xcodegen generate
```

### 2. Archive and upload

**In Xcode:** select the *Any iOS Device (arm64)* destination → *Product* → *Archive*. When the Organizer opens,
select the archive → *Distribute App* → *App Store Connect* → *Distribute*. If the upload fails with *Invalid
Signature*, use the command line below, which picks the local distribution certificate.

**Or from the command line:**

```bash
xcodebuild archive -project DHD.xcodeproj -scheme DHD -configuration Release -destination 'generic/platform=iOS' -archivePath build/DHD.xcarchive -allowProvisioningUpdates
```

```bash
xcodebuild -exportArchive -archivePath build/DHD.xcarchive -exportOptionsPlist ExportOptions.plist -exportPath build/export -allowProvisioningUpdates
```

`ExportOptions.plist` (not committed; create it once in the repo root):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store-connect</string>
    <key>destination</key>
    <string>upload</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>signingCertificate</key>
    <string>Apple Distribution</string>
</dict>
</plist>
```

Uploading from the command line uses the Apple ID signed in to Xcode (*Settings* → *Accounts*).

### 3. TestFlight

Wait for App Store Connect to finish processing the build (you'll get an email), then install it from TestFlight and
run the manual checks above.

### 4. App Store Connect

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com) and open *DHD*.
2. Create a new version matching `MARKETING_VERSION`.
3. Replace the screenshots: the Expo app's no longer match the photoreal DHD and the native controls. App Store
   Connect needs a set for the largest iPhone (6.9", e.g. *iPhone 18 Pro Max*: 1320 × 2868) and, because the app also
   runs on iPad, the largest iPad (13", e.g. *iPad Pro 13-inch (M4)*: 2064 × 2752); it scales those down for smaller
   devices. Take them in the simulator with sample data, e.g. idle DHD, a dialed address, the save sheet and the
   Cartouche. *Device → Trigger Screenshot* in Simulator, or `xcrun simctl io booted screenshot <file>.png`, saves
   them at full resolution. Set a clean status bar first:
   `xcrun simctl status_bar booted override --time 9:41 --batteryState charged --batteryLevel 100`.
4. Fill in **What's New**. For the first native release, for example: *"Rebuilt from the ground up for iOS: faster
   launch, VoiceOver support, choose which number to save for contacts with several, and no Contacts permission
   needed."*
5. Attach the build.
6. For the first native release, choose **Phased Release** under *Version Release*. The update then reaches users
   over 7 days, and you can pause it if migration problems are reported.
7. Click **Submit for Review**.

---

## After the first native release

- The Expo app's EAS project is no longer used for iOS builds. Don't publish `eas update` to the production branch:
  users still on the Expo version would get it, which may be confusing but is harmless.
- The Expo source stays in this repository's history, tagged `v1.1.0`.
