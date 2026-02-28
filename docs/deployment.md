# Deployment

## Over-the-Air Update

Use this when the changes are **JS/UI only** — no new packages, no changes to `app.json` plugins or permissions.

No version bump required, though bumping the patch version (e.g. `1.1.0` → `1.1.1`) for tracking is fine.

```bash
eas update --branch production --message "Brief description of changes"
```

Users receive the update automatically within minutes. No App Store review.

---

## Full App Store Submission

Use this when you want to update App Store screenshots, release notes, or when the changes involve native code or new packages.

### 1. Bump the version in `app.json`

Update the marketing version (e.g. `1.1.0` → `1.2.0`). The build number is managed automatically by EAS.

### 2. Build

```bash
eas build --platform ios --profile production
```

Wait for the build to complete.

### 3. Submit

```bash
eas submit --platform ios --profile production
```

### 4. App Store Connect

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Open the app and create a new version matching the version in `app.json`
3. Upload new screenshots if the UI has changed
4. Fill in the **"What's New"** text
5. Attach the build once Apple has finished processing it
6. Click **Submit for Review**
