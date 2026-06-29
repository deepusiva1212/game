# 🎨 Tap Rush — Reflex Color Game

> A fast-paced reflex game where you tap the correct color before time runs out. Developed by **Deepu Siva Private Limited**.

[![Play Now](https://img.shields.io/badge/Play%20Now-Live%20Demo-3B82F6?style=for-the-badge)](https://YOUR_USERNAME.github.io/tap-rush/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)]()

---

## 🎮 Game Features

| Feature | Details |
|---|---|
| **4 Game Modes** | Classic, Zen, Blitz, Dark |
| **8 Colors** | Increases to 10 as levels go up |
| **Combo System** | ×2 at 3 streak, ×3 at 5 streak |
| **Sound Effects** | Web Audio API tones |
| **Haptic Feedback** | Vibration API on Android |
| **High Score Board** | Persistent via localStorage |
| **AdMob Ready** | Banner + interstitial placeholders |
| **Play Store Ready** | Capacitor.js APK wrapper |

---

## 🚀 Live Demo (GitHub Pages)

1. Go to your repo → **Settings → Pages**
2. Set source: `main` branch, `/ (root)` folder
3. Your game is live at: `https://YOUR_USERNAME.github.io/tap-rush/`

---

## 📱 Build Android APK (Capacitor)

### Prerequisites
- Node.js 18+
- Android Studio (with Android SDK)
- Java 17+

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/tap-rush.git
cd tap-rush

# 2. Install dependencies
npm install

# 3. Add Android platform
npm run android:init

# 4. Sync web files into Android
npm run android:sync

# 5. Open in Android Studio
npm run android:open
# Then: Build → Generate Signed Bundle/APK → APK
```

### Release APK for Play Store
```bash
# Generate keystore (do this once, KEEP IT SAFE!)
keytool -genkey -v -keystore android/tapRush.keystore \
  -alias tapRush -keyalg RSA -keysize 2048 -validity 10000

# Build release APK
cd android && ./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

---

## 💰 AdMob Integration

### Step 1 — Create AdMob Account
1. Go to [admob.google.com](https://admob.google.com)
2. Create app → "Tap Rush" → Android
3. Note your **App ID** and **Ad Unit IDs**

### Step 2 — Replace Placeholders in `index.html`

Find these comments and replace:

```html
<!-- Banner ad (bottom of screen) -->
<ins class="adsbygoogle"
     style="display:inline-block;width:320px;height:50px"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

<!-- Interstitial ad (after game over) -->
<!-- Trigger in JS: adBreak({type: 'reward', ...}) -->
```

### Step 3 — Add AdMob to Android
```bash
npm install @capacitor-community/admob
npx cap sync android
```

Then in `android/app/src/main/AndroidManifest.xml` add:
```xml
<meta-data
  android:name="com.google.android.gms.ads.APPLICATION_ID"
  android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
```

---

## 🏪 Google Play Store Submission

### Required Assets
| Asset | Size | Notes |
|---|---|---|
| App icon | 512×512 PNG | No alpha |
| Feature graphic | 1024×500 PNG | Store banner |
| Screenshots | Min 2, phone | 16:9 or 9:16 |
| Short description | Max 80 chars | |
| Full description | Max 4000 chars | |
| Privacy Policy URL | — | Use `/privacy-policy.html` hosted on GitHub Pages |
| Content rating | — | Fill IARC questionnaire |

### Play Console Steps
1. Go to [play.google.com/console](https://play.google.com/console) — pay **$25 one-time** fee
2. Create app → Android → Free → Casual game
3. Upload your `.aab` file (App Bundle, preferred over APK)
4. Fill store listing: title, description, screenshots
5. Set Privacy Policy URL: `https://YOUR_USERNAME.github.io/tap-rush/privacy-policy.html`
6. Complete content rating questionnaire
7. Set pricing to **Free** + Ads
8. Submit for review (usually 1–3 days)

### Recommended Play Store Description
```
🎨 TAP RUSH — Reflex Color Game

How fast are you? A color appears — tap the right one before the timer runs out!

⚡ CLASSIC — 3 lives, infinite rounds. Speed increases every 5 correct!
🌊 ZEN — No lives lost. Pure relaxation and score chasing.
🔥 BLITZ — 30 seconds. Everything moves at max speed.
🌑 DARK — No color names shown. Expert only!

★ FEATURES
• 8+ vibrant colors across 10+ difficulty levels
• Combo multiplier system (×2 streak, ×3 streak)
• Sound effects and haptic feedback
• Persistent high scores per mode
• Minimalist dark UI — easy on the eyes

Perfect for 30-second breaks. Can you beat your own best?

Developed by Deepu Siva Private Limited 🇮🇳
```

---

## 📁 Project Structure

```
tap-rush/
├── index.html           ← Main game (entire game in one file)
├── privacy-policy.html  ← Required for Play Store
├── capacitor.config.json← Android APK config
├── package.json         ← Dependencies + build scripts
└── README.md            ← This file
```

---

## 🗺️ Roadmap

- [ ] Firebase Analytics integration
- [ ] Global leaderboard (Firebase Realtime DB)
- [ ] Daily challenge mode
- [ ] Color-blind accessibility mode
- [ ] iOS App Store build

---

## 📞 Contact

**Deepu Siva Private Limited**
- Website: [deepusiva.com](https://deepusiva.com)
- Phone: +91 8098889088

---

*Built with HTML5 + Vanilla JS + Capacitor.js*
