# 🎮 GameVerse — 12 Games, 1 App

> Multi-game hub by **Deepu Siva Private Limited**. Local accounts, per-game save states, modular architecture — each game is a single isolated file.

---

## 🗂️ Architecture (READ THIS FIRST)

**Every game lives in its own file under `/games/`.** If one game breaks, fix or replace that single file — nothing else is affected.

```
GameVerse/
├── index.html              ← Hub: auth, profile, game grid, "continue playing"
├── privacy-policy.html     ← Required for Play Store
├── capacitor.config.json   ← Android wrapper config
├── package.json
├── css/
│   └── global.css          ← Shared dark theme styles
├── js/
│   └── core.js             ← Auth + Save engine (GV object) — used by ALL games
└── games/
    ├── tap-rush.html        🎨 Reflex color tapping
    ├── runner.html           🏃 Endless runner (Subway Surfers style)
    ├── candy-match.html      🍬 Match-3 puzzle (Candy Crush style)
    ├── coin-kingdom.html     🪙 Spin wheel + village builder (Coin Master style)
    ├── brain-blocks.html     🧩 Sliding number puzzle
    ├── happy-farm.html       🌾 Plant/grow/harvest farming sim
    ├── sling-shot.html       🐦 Physics launcher (Angry Birds style)
    ├── card-flip.html        🃏 Memory matching
    ├── snake.html            🐍 Classic snake
    ├── word-quest.html       📝 Word search puzzle
    ├── tower-stack.html      🏗️ Block stacking skill game
    └── bubble-pop.html       🫧 Bubble shooter match
```

**To add a 13th game:** create `games/your-game.html`, copy the save/exit pattern from any existing game, then add one line to the `GV.GAMES` array in `js/core.js`. The hub automatically picks it up — no other changes needed.

---

## 🔐 How Accounts Work

- **Local-only accounts** — stored in the browser's `localStorage`, no server, no internet required.
- Users tap **Create Account** → choose avatar, username, password → account is saved on-device.
- **Returning users** tap **Sign In** — if "Keep me signed in" was checked, they skip login on next launch entirely.
- **Guest mode** available — plays without saving progress permanently (session-only).
- 🔜 **Next update**: Google Sign-In / cloud sync, so progress follows the user across devices. The architecture already separates `GV.Auth` from `GV.Save`, so this is a drop-in upgrade — only `core.js` will need changes, no game files.

---

## 💾 How Save States Work (Resume Exactly Where You Left Off)

Every game calls two functions from `core.js`:

```js
GV.Save.set('gameId', { score, level, ...anyData });  // called after every meaningful action
GV.Save.get('gameId');                                  // called on game load to resume
```

Save data is keyed by **user ID + game ID**, so:
- Each user has independent progress per game.
- Closing the app, leaving for hours/days, and reopening resumes the exact level, score, board state, or kingdom — whatever that specific game saved.
- The home screen's **"Continue Playing"** row reads all saves and shows quick-resume cards automatically.

### Example: adding save/resume to a new game
```js
// On load:
let save = GV.Save.get('myGame');
if (save) { level = save.level; score = save.score; }

// After level complete / important event:
GV.Save.set('myGame', { level, score, savedAt: new Date().toISOString() });
```

---

## 🚀 Host on GitHub Pages

1. Push all files to your repo (you've already done this ✅)
2. **Settings → Pages → Source: main / root**
3. Live at: `https://YOUR_USERNAME.github.io/REPO_NAME/`
4. Test the full account flow: register → play a game → leave → come back → confirm it resumes.

---

## 📱 Build Android APK (Capacitor)

```bash
npm install
npm run android:init
npm run android:sync
npm run android:open
# In Android Studio: Build → Generate Signed Bundle/APK
```

### Release build
```bash
keytool -genkey -v -keystore android/gameverse.keystore -alias gameverse -keyalg RSA -keysize 2048 -validity 10000
cd android && ./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

---

## 💰 AdMob Setup

Each game file has space reserved for banner/interstitial ads (see comments in HTML). Steps:

1. Create app at [admob.google.com](https://admob.google.com) → Android
2. Get App ID + per-game-or-shared Ad Unit IDs
3. Add to `AndroidManifest.xml`:
```xml
<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID"
  android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
```
4. Install plugin: `npm install @capacitor-community/admob && npx cap sync android`

**Recommended placement**: interstitial after every "Game Over" / "Level Complete" screen (already has placeholder divs), rewarded ad for "extra life" or "double coins" prompts.

---

## 🏪 Google Play Store Submission

| Asset | Spec |
|---|---|
| Icon | 512×512 PNG |
| Feature graphic | 1024×500 PNG |
| Screenshots | 2+ phone screenshots per orientation |
| Privacy Policy URL | `https://YOUR_USERNAME.github.io/REPO/privacy-policy.html` |
| Category | Games → Casual |
| Content rating | Fill IARC questionnaire (all ages — no violence/gambling real money) |

### Suggested Store Listing
```
🎮 GAMEVERSE — 12 Games in One App!

Why download 12 apps when you can have them all in one place?

🎨 Tap Rush — lightning-fast color reflex challenge
🏃 Sky Runner — endless runner with jumps & obstacles
🍬 Candy Match — sweet match-3 puzzle action
🪙 Coin Kingdom — spin, win, and build your village
🧩 Brain Blocks — classic sliding number puzzle
🌾 Happy Farm — plant, grow, and harvest crops
🐦 Sling Shot — launch birds at targets, physics-based fun
🃏 Card Flip — test your memory
🐍 Snake Legends — the classic reborn
📝 Word Quest — find hidden words
🏗️ Tower Stack — stack blocks as high as you can
🫧 Bubble Pop — match and pop colorful bubbles

✅ ONE local account for all games
✅ Resume exactly where you left off — anytime
✅ No internet required to play
✅ New games added in future updates

Developed by Deepu Siva Private Limited 🇮🇳
```

---

## 🛠️ Troubleshooting / Maintenance

| Problem | Fix |
|---|---|
| One game crashes | Open only that file in `/games/`, fix or replace it — zero impact on others |
| Hub doesn't show a game | Check it's listed correctly in `GV.GAMES` array, `js/core.js` |
| Save not resuming | Confirm the game calls `GV.Save.set()` after every important action, and `GV.Save.get()` on load |
| Want to remove a game | Delete its entry from `GV.GAMES` in `core.js` — file can stay on disk unused |
| Want to reorder games on home screen | Reorder entries in the `GV.GAMES` array |

---

## 🗺️ Roadmap

- [ ] Google Sign-In + Firebase cloud sync (cross-device progress)
- [ ] Global leaderboards per game
- [ ] Daily login rewards / streaks
- [ ] Push notifications ("come back and claim your spin!")
- [ ] More games: Tic-Tac-Toe, 2048, Trivia Quiz, Racing

---

## 📞 Contact

**Deepu Siva Private Limited**
Website: [deepusiva.com](https://deepusiva.com) · Phone: +91 8098889088
