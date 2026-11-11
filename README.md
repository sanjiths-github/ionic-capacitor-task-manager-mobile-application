# TaskFlow Mobile

Android production releases use the existing release keystore. GitHub Actions checks the configured `ANDROID_SIGNING_CERT_SHA256` fingerprint before publishing. The app checks the published release version and, with the user's approval, opens a short-lived download link in the browser; Android's installer handles the user-approved APK installation. Builds installed before this update feature need a one-time manual upgrade. Google Play and iOS distribution require their respective store-supported update flows.

After the first stable tag release, the current Android APK is always available at `https://github.com/sanjuconnectrader/taskflow-mobile/releases/latest/download/TaskFlow.apk`.

Capacitor Android application packaging the **same local static UI** as TaskFlow web and desktop. Package ID: `com.taskflow.mobile`. No production `server.url` points to a website.

## Requirements

Node.js 22.14+, JDK 21, Android Studio, SDK Platform 36, Build Tools 36.0.0 and Platform Tools. Set `JAVA_HOME` and `ANDROID_HOME`. Capacitor's current requirements are linked in DEPLOYMENT.md. Android native code lives in `android/` and is tracked; generated public web assets, Gradle caches, credentials and local SDK paths are ignored.

## Build and run

1. Clone TaskFlow web beside this project as `../frontend`. Start/deploy the shared backend. Set `frontend/.env.local` `NEXT_PUBLIC_API_URL` to its HTTPS API origin.
2. In frontend: `npm ci` then `npm run build`.
3. Here: `npm ci`, `npm run assets`, `npm run sync`.
4. `npm run open`, select a device/emulator, and Run in Android Studio.
5. Or `npm run build:debug`; install `android/app/build/outputs/apk/debug/app-debug.apk` using `adb install -r <apk>`.

If frontend is elsewhere, set `FRONTEND_OUT` before copying. On Windows PowerShell use `npm.cmd`. A local HTTP API needs the explicit **debug-only** flow: `adb reverse tcp:4000 tcp:4000`; compile UI against `http://localhost:4000`; set `TASKFLOW_DEV_HTTP=1` for `npm run sync`; then build debug. Unset the variable and resync before releases. Main/release Android manifest disallows cleartext, and release Gradle rejects cleartext Capacitor config.

## Signed release

```text
node scripts/init-signing.mjs
node scripts/release-local.mjs
```

The init script creates a random local signing credential and key in ignored `.env.signing` and `.signing/taskflow-release.jks`; it refuses to overwrite them. Keep secure backups. Do not commit either file. The release helper loads them into process environment and invokes Gradle, which refuses unsigned release builds. Version comes from `package.json`; version code is `major*10000+minor*100+patch`.

Result: `android/app/build/outputs/apk/release/app-release.apk`. Verify using your SDK's `apksigner verify --verbose <apk>`, then install with `adb install -r <apk>`. Updates require the same signing key and a greater version code. Use a production HTTPS API and exact backend CORS origin `https://localhost`. Web/native clients access the same PostgreSQL data through that API.

## Native behavior

`SecureSessionPlugin.java` seals opaque session tokens using AES-GCM and an Android Keystore key. Android backup is disabled. `MainActivity` registers that narrow bridge. No camera, microphone, location or broad file permission is requested. Browser file selection is used only for user-chosen task attachments. The shared frontend handles status bar, safe areas, keyboard and hardware back navigation. Full offline editing and native push notifications are not implemented.

Run `npm test` for configuration checks. Device/emulator testing must additionally verify login persistence, task changes, comments, notifications, keyboard, back button, orientation, network loss and logout. Responsive browser tests do not establish these native checks.

## CI/CD and iOS

The GitHub tag workflow checks the immutable frontend SHA, tests/builds the UI, restores the Android key from Secrets, compiles on JDK 21/SDK 36, verifies signing, and uploads the APK to GitHub Releases after the production environment gate. See [DEPLOYMENT.md](DEPLOYMENT.md) for credentials and approvals.

For iOS, work on a Mac with Xcode, install `@capacitor/ios`, add/sync the iOS platform and implement the `SecureSession` bridge with iOS Keychain. This repository is structured for that extension; it does not claim to ship a working iOS client.

## Downloads

[Download Android APKs](https://github.com/sanjuconnectrader/taskflow-mobile/releases/tag/local-2026-11-11-ui-cleanup). The signed release APK requires a reachable HTTPS TaskFlow backend configured using `NEXT_PUBLIC_API_URL` before building. Production hosting is not yet provisioned. The additional Local-Debug APK uses the separate `com.taskflow.mobile.dev` ID and permits the USB-reversed local API for development.
