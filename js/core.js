/* ═══════════════════════════════════════════════
   GAMEVERSE CORE ENGINE v1.0
   Auth · SaveState · Navigation · Registry
   Deepu Siva Private Limited
   ═══════════════════════════════════════════════ */

const GV = {

  /* ── STORAGE KEYS ── */
  KEYS: {
    USERS:   'gv_users',
    SESSION: 'gv_session',
    SAVES:   'gv_saves',
    PREFS:   'gv_prefs',
  },

  /* ── GAME REGISTRY ── */
  GAMES: [
    { id:'tapRush',   title:'Tap Rush',      icon:'🎨', desc:'Reflex color tapping',   file:'games/tap-rush.html',     genre:'Casual',   color:'#3B82F6' },
    { id:'runner',    title:'Sky Runner',     icon:'🏃', desc:'Endless runner parkour', file:'games/runner.html',       genre:'Action',   color:'#EF4444' },
    { id:'candyMatch',title:'Candy Match',    icon:'🍬', desc:'Sweet match-3 puzzle',   file:'games/candy-match.html',  genre:'Puzzle',   color:'#EC4899' },
    { id:'coinFarm',  title:'Coin Kingdom',   icon:'🪙', desc:'Spin & collect coins',   file:'games/coin-kingdom.html', genre:'Casual',   color:'#EAB308' },
    { id:'puzzle',    title:'Brain Blocks',   icon:'🧩', desc:'Slide block puzzles',    file:'games/brain-blocks.html', genre:'Puzzle',   color:'#8B5CF6' },
    { id:'farm',      title:'Happy Farm',     icon:'🌾', desc:'Plant & harvest crops',  file:'games/happy-farm.html',   genre:'Strategy', color:'#22C55E' },
    { id:'slingshot', title:'Sling Shot',     icon:'🐦', desc:'Launch birds at targets',file:'games/sling-shot.html',   genre:'Physics',  color:'#F97316' },
    { id:'cardMatch', title:'Card Flip',      icon:'🃏', desc:'Memory matching cards',  file:'games/card-flip.html',    genre:'Memory',   color:'#14B8A6' },
    { id:'snake',     title:'Snake Legends',  icon:'🐍', desc:'Classic snake reborn',   file:'games/snake.html',        genre:'Classic',  color:'#84CC16' },
    { id:'wordPuzzle',title:'Word Quest',     icon:'📝', desc:'Find hidden words',      file:'games/word-quest.html',   genre:'Word',     color:'#A855F7' },
    { id:'tower',     title:'Tower Stack',    icon:'🏗️', desc:'Stack blocks perfectly', file:'games/tower-stack.html',  genre:'Skill',    color:'#06B6D4' },
    { id:'bubblePop', title:'Bubble Pop',     icon:'🫧', desc:'Pop matching bubbles',   file:'games/bubble-pop.html',   genre:'Puzzle',   color:'#F59E0B' },
  ],

  /* ── THEME ── */
  Theme: {
    KEY_THEME: 'gv_theme',
    KEY_MODE: 'gv_mode',
    THEMES: [
      { id:'candy', name:'Candy Pop', emoji:'🍭', colors:['#FF6FA5','#C04CFF','#FFD23F'] },
      { id:'jungle', name:'Jungle', emoji:'🦜', colors:['#34D399','#2DD4BF','#FBBF24'] },
      { id:'space', name:'Space Buddy', emoji:'🚀', colors:['#6366F1','#22D3EE','#C084FC'] },
    ],
    getTheme() { return localStorage.getItem(this.KEY_THEME) || 'candy'; },
    getMode() { return localStorage.getItem(this.KEY_MODE) || 'light'; },
    setTheme(id) { localStorage.setItem(this.KEY_THEME, id); this.apply(); },
    setMode(mode) { localStorage.setItem(this.KEY_MODE, mode); this.apply(); },
    apply() {
      document.documentElement.setAttribute('data-theme', this.getTheme());
      document.documentElement.setAttribute('data-mode', this.getMode());
    }
  },

  /* ── AUTH ── */
  Auth: {
    getUsers() { try { return JSON.parse(localStorage.getItem(GV.KEYS.USERS)||'[]'); } catch(e){return[];} },
    saveUsers(u) { localStorage.setItem(GV.KEYS.USERS, JSON.stringify(u)); },
    getSession() { try { return JSON.parse(sessionStorage.getItem(GV.KEYS.SESSION)||localStorage.getItem(GV.KEYS.SESSION)||'null'); } catch(e){return null;} },
    saveSession(u, remember) {
      let s = JSON.stringify(u);
      sessionStorage.setItem(GV.KEYS.SESSION, s);
      if (remember) localStorage.setItem(GV.KEYS.SESSION, s);
    },
    clearSession() { sessionStorage.removeItem(GV.KEYS.SESSION); localStorage.removeItem(GV.KEYS.SESSION); },

    register(username, password, avatar) {
      let users = this.getUsers();
      if (users.find(u=>u.username.toLowerCase()===username.toLowerCase())) return { ok:false, msg:'Username already taken' };
      if (username.length<3) return { ok:false, msg:'Username must be 3+ characters' };
      if (password.length<4) return { ok:false, msg:'Password must be 4+ characters' };
      let user = { id: Date.now().toString(), username, password: btoa(password), avatar: avatar||'😀', createdAt: new Date().toISOString(), coins:100 };
      users.push(user);
      this.saveUsers(users);
      return { ok:true, user };
    },

    login(username, password, remember) {
      let users = this.getUsers();
      let user = users.find(u=>u.username.toLowerCase()===username.toLowerCase() && u.password===btoa(password));
      if (!user) return { ok:false, msg:'Invalid username or password' };
      let safe = { id:user.id, username:user.username, avatar:user.avatar, coins:user.coins };
      this.saveSession(safe, remember);
      return { ok:true, user:safe };
    },

    logout() { this.clearSession(); },
    current() { return this.getSession(); },

    updateCoins(delta) {
      let s = this.getSession();
      if (!s) return;
      let users = this.getUsers();
      let u = users.find(x=>x.id===s.id);
      if (u) { u.coins = Math.max(0, (u.coins||0)+delta); this.saveUsers(users); }
      s.coins = Math.max(0, (s.coins||0)+delta);
      let key = localStorage.getItem(GV.KEYS.SESSION) ? 'localStorage' : 'sessionStorage';
      if (key==='localStorage') localStorage.setItem(GV.KEYS.SESSION, JSON.stringify(s));
      sessionStorage.setItem(GV.KEYS.SESSION, JSON.stringify(s));
    }
  },

  /* ── SAVE STATE ── */
  Save: {
    _key(userId, gameId) { return `${GV.KEYS.SAVES}_${userId}_${gameId}`; },

    get(gameId) {
      let user = GV.Auth.current();
      if (!user) return null;
      try { return JSON.parse(localStorage.getItem(this._key(user.id, gameId))||'null'); } catch(e){return null;}
    },

    set(gameId, data) {
      let user = GV.Auth.current();
      if (!user) return;
      let save = { ...data, savedAt: new Date().toISOString(), gameId };
      localStorage.setItem(this._key(user.id, gameId), JSON.stringify(save));
    },

    clear(gameId) {
      let user = GV.Auth.current();
      if (!user) return;
      localStorage.removeItem(this._key(user.id, gameId));
    },

    getAllForUser() {
      let user = GV.Auth.current();
      if (!user) return {};
      let result = {};
      GV.GAMES.forEach(g=>{
        let s = this.get(g.id);
        if (s) result[g.id] = s;
      });
      return result;
    }
  },

  /* ── NAVIGATION ── */
  Nav: {
    openGame(gameFile, gameId) {
      let user = GV.Auth.current();
      if (!user) { alert('Please log in to play!'); return; }
      sessionStorage.setItem('gv_active_game', gameId);
      window.location.href = gameFile;
    },
    backToHome() { window.location.href = '../index.html'; },
    backToHomeFromRoot() { window.location.href = 'index.html'; }
  },

  /* ── UTILS ── */
  Utils: {
    timeAgo(iso) {
      if (!iso) return '';
      let diff = Date.now()-new Date(iso).getTime();
      let m=Math.floor(diff/60000), h=Math.floor(m/60), d=Math.floor(h/24);
      if (d>0) return d+'d ago'; if (h>0) return h+'h ago'; if (m>0) return m+'m ago'; return 'just now';
    },
    formatScore(n) { return Number(n||0).toLocaleString(); }
  }
};

window.GV = GV;
GV.Theme.apply();
