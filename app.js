// ================================================
// ANIME VERSE — Main App
// ================================================

// ===== FIREBASE INIT (already done in firebase-config.js) =====
// db, auth are global

// ===== GLOBALS =====
let currentUser     = null;
let allAnimeData    = [];
let currentCategory = 'all';
let searchActive    = false;

// ===== THEME =====
function toggleTheme() {
  const html = document.documentElement;
  const btn  = document.getElementById('themeBtn');
  const dark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', dark ? 'light' : 'dark');
  if (btn) btn.innerHTML = dark
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
  localStorage.setItem('av_theme', dark ? 'light' : 'dark');
}
function loadTheme() {
  const saved = localStorage.getItem('av_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.innerHTML = saved === 'dark'
    ? '<i class="fas fa-moon"></i>'
    : '<i class="fas fa-sun"></i>';
}

// ===== AUTH GATE =====
// Pages that require login
const PROTECTED_PAGES = ['index.html', 'anime.html', 'watch.html', 'profile.html'];
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

auth.onAuthStateChanged(async user => {
  currentUser = user;
  if (!user) {
    // If on a protected page, show auth wall
    if (PROTECTED_PAGES.includes(currentPage) || currentPage === '') {
      showAuthWall();
      return;
    }
  } else {
    // Hide auth wall if showing
    const wall = document.getElementById('authWall');
    if (wall) wall.style.display = 'none';
    const main = document.getElementById('appContent');
    if (main) main.style.display = 'block';
    // Update UI
    await updateAuthUI(user);
    // Init app
    initApp();
  }
});

function showAuthWall() {
  // Hide main content
  const main = document.getElementById('appContent');
  if (main) main.style.display = 'none';
  // Show auth wall
  let wall = document.getElementById('authWall');
  if (!wall) {
    wall = document.createElement('div');
    wall.id = 'authWall';
    wall.style.cssText = `
      position:fixed;inset:0;background:var(--bg);
      z-index:9999;display:flex;align-items:center;
      justify-content:center;padding:20px;flex-direction:column;
    `;
    wall.innerHTML = `
      <div style="text-align:center;max-width:380px;width:100%">
        <!-- Logo -->
        <div style="font-family:'Bebas Neue',sans-serif;
          font-size:36px;letter-spacing:2px;margin-bottom:8px">
          ANIME <span style="color:var(--accent)">VERSE</span>
        </div>
        <p style="font-size:13px;color:var(--text2);margin-bottom:32px">
          Your anime streaming destination
        </p>

        <!-- Auth Card -->
        <div style="background:var(--card-bg);border:1px solid var(--border);
          border-radius:20px;padding:24px;text-align:left">

          <!-- Tabs -->
          <div style="display:flex;gap:0;margin-bottom:20px;
            background:var(--bg3);border-radius:10px;padding:4px">
            <button id="authTabLogin"
              onclick="switchAuthTab('login')"
              style="flex:1;padding:8px;border-radius:8px;border:none;
                background:var(--accent);color:#fff;font-family:'Poppins',sans-serif;
                font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s">
              Login
            </button>
            <button id="authTabSignup"
              onclick="switchAuthTab('signup')"
              style="flex:1;padding:8px;border-radius:8px;border:none;
                background:none;color:var(--text2);font-family:'Poppins',sans-serif;
                font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s">
              Sign Up
            </button>
          </div>

          <div id="authError"
            style="display:none;background:rgba(229,9,20,0.1);
              border:1px solid #e50914;color:#e50914;padding:10px 12px;
              border-radius:8px;font-size:12px;margin-bottom:14px"></div>
          <div id="authSuccess"
            style="display:none;background:rgba(39,174,96,0.1);
              border:1px solid #27ae60;color:#27ae60;padding:10px 12px;
              border-radius:8px;font-size:12px;margin-bottom:14px"></div>

          <!-- LOGIN FORM -->
          <div id="loginForm">
            <div class="form-group">
              <label style="font-size:11px;font-weight:600;
                color:var(--text2);letter-spacing:0.5px">EMAIL</label>
              <input type="email" id="loginEmail"
                placeholder="your@email.com"
                onkeydown="if(event.key==='Enter')doLogin()"/>
            </div>
            <div class="form-group" style="position:relative">
              <label style="font-size:11px;font-weight:600;
                color:var(--text2);letter-spacing:0.5px">PASSWORD</label>
              <input type="password" id="loginPass"
                placeholder="Password"
                style="padding-right:44px"
                onkeydown="if(event.key==='Enter')doLogin()"/>
              <button onclick="togglePwView('loginPass','eyeLogin')"
                style="position:absolute;right:10px;bottom:10px;
                  background:none;border:none;color:var(--text2);
                  cursor:pointer;font-size:15px">
                <i class="fas fa-eye" id="eyeLogin"></i>
              </button>
            </div>
            <div style="text-align:right;margin-bottom:16px;margin-top:-8px">
              <button onclick="doForgotPassword()"
                style="background:none;border:none;color:var(--accent);
                  font-size:12px;cursor:pointer;
                  font-family:'Poppins',sans-serif">
                Forgot password?
              </button>
            </div>
            <button class="btn-primary" onclick="doLogin()"
              id="loginBtn" style="width:100%">
              <i class="fas fa-right-to-bracket"></i> Login
            </button>
          </div>

          <!-- SIGNUP FORM -->
          <div id="signupForm" style="display:none">
            <div class="form-group">
              <label style="font-size:11px;font-weight:600;
                color:var(--text2);letter-spacing:0.5px">DISPLAY NAME</label>
              <input type="text" id="signupName"
                placeholder="Your name"/>
            </div>
            <div class="form-group">
              <label style="font-size:11px;font-weight:600;
                color:var(--text2);letter-spacing:0.5px">EMAIL</label>
              <input type="email" id="signupEmail"
                placeholder="your@email.com"/>
            </div>
            <div class="form-group" style="position:relative">
              <label style="font-size:11px;font-weight:600;
                color:var(--text2);letter-spacing:0.5px">PASSWORD</label>
              <input type="password" id="signupPass"
                placeholder="Min 6 characters"
                style="padding-right:44px"
                onkeydown="if(event.key==='Enter')doSignup()"/>
              <button onclick="togglePwView('signupPass','eyeSignup')"
                style="position:absolute;right:10px;bottom:10px;
                  background:none;border:none;color:var(--text2);
                  cursor:pointer;font-size:15px">
                <i class="fas fa-eye" id="eyeSignup"></i>
              </button>
            </div>
            <button class="btn-primary" onclick="doSignup()"
              id="signupBtn" style="width:100%">
              <i class="fas fa-user-plus"></i> Create Account
            </button>
          </div>
        </div>

        <p style="font-size:11px;color:var(--text2);margin-top:16px">
          By continuing, you agree to our terms of service.
        </p>
      </div>
    `;
    document.body.appendChild(wall);
  } else {
    wall.style.display = 'flex';
  }
}

function switchAuthTab(tab) {
  const loginForm  = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginTab   = document.getElementById('authTabLogin');
  const signupTab  = document.getElementById('authTabSignup');
  if (!loginForm) return;
  if (tab === 'login') {
    loginForm.style.display  = 'block';
    signupForm.style.display = 'none';
    loginTab.style.background  = 'var(--accent)';
    loginTab.style.color       = '#fff';
    signupTab.style.background = 'none';
    signupTab.style.color      = 'var(--text2)';
  } else {
    loginForm.style.display  = 'none';
    signupForm.style.display = 'block';
    signupTab.style.background = 'var(--accent)';
    signupTab.style.color      = '#fff';
    loginTab.style.background  = 'none';
    loginTab.style.color       = 'var(--text2)';
  }
  document.getElementById('authError').style.display   = 'none';
  document.getElementById('authSuccess').style.display = 'none';
}

function togglePwView(inputId, iconId) {
  const inp  = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
  if (icon) icon.className = inp.type === 'password'
    ? 'fas fa-eye' : 'fas fa-eye-slash';
}

function showAuthError(msg) {
  const el = document.getElementById('authError');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}
function showAuthSuccess(msg) {
  const el = document.getElementById('authSuccess');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
  const errEl = document.getElementById('authError');
  if (errEl) errEl.style.display = 'none';
}

async function doLogin() {
  const email = (document.getElementById('loginEmail')?.value||'').trim();
  const pass  = document.getElementById('loginPass')?.value||'';
  if (!email || !pass) { showAuthError('Fill in all fields.'); return; }
  const btn = document.getElementById('loginBtn');
  if (btn) { btn.innerHTML='<i class="fas fa-circle-notch fa-spin"></i> Logging in...'; btn.disabled=true; }
  try {
    await auth.signInWithEmailAndPassword(email, pass);
    // onAuthStateChanged will handle the rest
  } catch(e) {
    showAuthError(getAuthError(e.code));
    if (btn) { btn.innerHTML='<i class="fas fa-right-to-bracket"></i> Login'; btn.disabled=false; }
  }
}

async function doSignup() {
  const name  = (document.getElementById('signupName')?.value||'').trim();
  const email = (document.getElementById('signupEmail')?.value||'').trim();
  const pass  = document.getElementById('signupPass')?.value||'';
  if (!name)  { showAuthError('Enter your name.'); return; }
  if (!email) { showAuthError('Enter your email.'); return; }
  if (pass.length < 6) { showAuthError('Password must be at least 6 characters.'); return; }
  const btn = document.getElementById('signupBtn');
  if (btn) { btn.innerHTML='<i class="fas fa-circle-notch fa-spin"></i> Creating...'; btn.disabled=true; }
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    await cred.user.updateProfile({ displayName: name });
    // Create user doc
    await db.collection('users').doc(cred.user.uid).set({
      name, email,
      watchlist: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    await cred.user.sendEmailVerification();
    showAuthSuccess('Account created! Verification email sent. You can now browse.');
    setTimeout(() => {
      const wall = document.getElementById('authWall');
      if (wall) wall.style.display = 'none';
      const main = document.getElementById('appContent');
      if (main) main.style.display = 'block';
    }, 1500);
  } catch(e) {
    showAuthError(getAuthError(e.code));
    if (btn) { btn.innerHTML='<i class="fas fa-user-plus"></i> Create Account'; btn.disabled=false; }
  }
}

async function doForgotPassword() {
  const email = (document.getElementById('loginEmail')?.value||'').trim();
  if (!email) { showAuthError('Enter your email first.'); return; }
  try {
    await auth.sendPasswordResetEmail(email);
    showAuthSuccess('Reset email sent! Check your inbox.');
  } catch(e) {
    showAuthError(getAuthError(e.code));
  }
}

function getAuthError(code) {
  const map = {
    'auth/user-not-found':         'No account with this email.',
    'auth/wrong-password':         'Wrong password.',
    'auth/email-already-in-use':   'Email already in use.',
    'auth/invalid-email':          'Invalid email address.',
    'auth/weak-password':          'Password too weak (min 6 chars).',
    'auth/too-many-requests':      'Too many attempts. Try later.',
    'auth/network-request-failed': 'Network error. Check connection.',
    'auth/invalid-credential':     'Wrong email or password.',
  };
  return map[code] || 'Something went wrong. Try again.';
}

// ===== UPDATE AUTH UI =====
async function updateAuthUI(user) {
  if (!user) {
    setProfileBtnAnon();
    updateSidebarProfile(null);
    return;
  }

  // Get Firestore user data for avatar
  let userData = {};
  try {
    const doc = await db.collection('users').doc(user.uid).get();
    if (doc.exists) userData = doc.data();
  } catch(e) {}

  const name   = user.displayName || userData.name || 'User';
  const avatar = userData.photoURL || '';
  const initial= name.charAt(0).toUpperCase();

  // ===== PROFILE BUTTON (top right) =====
  const profileBtn  = document.getElementById('profileBtn');
  const profileIcon = document.getElementById('profileIcon');
  if (profileBtn && profileIcon) {
    if (avatar) {
      profileIcon.style.display = 'none';
      // Remove any existing img
      const existImg = profileBtn.querySelector('img');
      if (existImg) existImg.remove();
      const img = document.createElement('img');
      img.src   = avatar;
      img.style.cssText = 'width:32px;height:32px;border-radius:50%;object-fit:cover;display:block';
      img.onerror = () => {
        img.remove();
        profileIcon.style.display = '';
        profileBtn.textContent = initial;
        profileBtn.style.fontWeight = '700';
        profileBtn.style.fontSize   = '15px';
      };
      profileBtn.textContent = '';
      profileBtn.appendChild(img);
    } else {
      // Show initial
      profileIcon.style.display = 'none';
      profileBtn.textContent    = initial;
      profileBtn.style.fontWeight = '700';
      profileBtn.style.fontSize   = '15px';
    }
    profileBtn.style.background = 'var(--accent)';
    profileBtn.style.color      = '#fff';
    profileBtn.onclick = () => { window.location.href = 'profile.html'; };
  }

  // ===== SIDEBAR =====
  updateSidebarProfile({ name, avatar, initial, email: user.email });

  // Update my list count badge
  const watchlist = userData.watchlist || [];
  const badge = document.getElementById('myListBadge');
  if (badge && watchlist.length > 0) {
    badge.textContent = watchlist.length;
    badge.style.display = 'flex';
  }
}

function setProfileBtnAnon() {
  const profileBtn  = document.getElementById('profileBtn');
  const profileIcon = document.getElementById('profileIcon');
  if (!profileBtn) return;
  profileBtn.textContent = '';
  if (profileIcon) {
    profileIcon.style.display = '';
    profileBtn.appendChild(profileIcon);
  }
  profileBtn.style.background = '';
  profileBtn.style.color      = '';
  profileBtn.onclick = () => openAuthModal();
}

function updateSidebarProfile(userData) {
  const nameEl   = document.getElementById('sidebarUserName');
  const emailEl  = document.getElementById('sidebarUserEmail');
  const avatarEl = document.getElementById('sidebarAvatar');

  if (!userData) {
    if (nameEl)  nameEl.textContent  = 'Guest';
    if (emailEl) emailEl.textContent = 'Login to save progress';
    if (avatarEl) avatarEl.innerHTML =
      '<i class="fas fa-user" style="font-size:20px;color:#fff"></i>';
    return;
  }

  const { name, avatar, initial, email } = userData;
  if (nameEl)  nameEl.textContent  = name;
  if (emailEl) emailEl.textContent = email || '';

  if (avatarEl) {
    if (avatar) {
      avatarEl.innerHTML = `
        <img src="${avatar}"
          style="width:100%;height:100%;border-radius:50%;object-fit:cover"
          onerror="this.parentElement.innerHTML='<span style=\\'font-size:20px;font-weight:700;color:#fff\\'>${initial}</span>'"/>`;
    } else {
      avatarEl.innerHTML =
        `<span style="font-size:22px;font-weight:700;color:#fff">${initial}</span>`;
    }
  }
}

// ===== LOGOUT =====
async function logoutUser() {
  await auth.signOut();
  currentUser = null;
  localStorage.removeItem('av_mylist');
  window.location.reload();
}

// ===== OPEN AUTH MODAL (fallback) =====
function openAuthModal() {
  showAuthWall();
}

// ===== MY LIST HELPERS =====
function getMyListLocal() {
  try { return JSON.parse(localStorage.getItem('av_mylist') || '[]'); }
  catch(e) { return []; }
}

async function toggleMyList(id, btnEl) {
  id = String(id);
  if (currentUser) {
    try {
      const ref = db.collection('users').doc(currentUser.uid);
      const doc = await ref.get();
      let list  = doc.exists ? (doc.data().watchlist||[]).map(String) : [];
      if (list.includes(id)) {
        list = list.filter(x=>x!==id);
        if (btnEl) btnEl.classList.remove('saved');
      } else {
        list.push(id);
        if (btnEl) btnEl.classList.add('saved');
      }
      await ref.set({ watchlist: list }, { merge: true });
    } catch(e) {
      console.error('Watchlist error:', e);
    }
  } else {
    openAuthModal();
  }
}

async function isInMyList(animeId) {
  animeId = String(animeId);
  if (currentUser) {
    try {
      const doc = await db.collection('users').doc(currentUser.uid).get();
      return doc.exists && (doc.data().watchlist||[]).map(String).includes(animeId);
    } catch(e) { return false; }
  }
  return getMyListLocal().map(String).includes(animeId);
}

// ===== FIREBASE DATA =====
async function fetchAllAnime() {
  try {
    const snap = await db.collection('anime').orderBy('createdAt','desc').get();
    const data = [];
    snap.forEach(doc => data.push({...doc.data(), firestoreId: doc.id}));
    allAnimeData = data;
    return data;
  } catch(e) {
    console.error('Fetch error:', e);
    return [];
  }
}

// ===== RENDER CARD =====
function renderCard(anime) {
  const div = document.createElement('div');
  div.className   = 'card';
  div.style.cursor = 'pointer';
  const genres = (anime.genre||[]).slice(0,2).map(g =>
    `<span class="genre-tag" style="font-size:10px;padding:3px 8px">${g}</span>`
  ).join('');
  div.innerHTML = `
    <div style="position:relative">
      <img class="card-thumb"
        src="${anime.thumbnail||''}"
        alt="${anime.title}"
        onerror="this.style.background='var(--bg3)'"/>
      <button class="wishlist-btn ${''}"
        id="wl-${anime.firestoreId}"
        onclick="event.stopPropagation();handleWishlistToggle('${anime.firestoreId}',this)">
        <i class="fas fa-heart"></i>
      </button>
    </div>
    <div class="card-info">
      <span class="card-badge">${(anime.type||'ANIME').toUpperCase()}</span>
      <div class="card-title">${anime.title}</div>
      <div class="card-meta">
        <span class="card-rating">
          <i class="fas fa-star"></i> ${anime.rating||'N/A'}
        </span>
        <span class="card-year">${anime.year||''}</span>
      </div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px">
        ${genres}
      </div>
    </div>`;
  div.addEventListener('click', () => {
    window.location.href = `anime.html?id=${anime.firestoreId}`;
  });
  return div;
}

async function handleWishlistToggle(id, btnEl) {
  if (!currentUser) { openAuthModal(); return; }
  await toggleMyList(id, btnEl);
}

// ===== INIT APP =====
async function initApp() {
  loadTheme();
  const data = await fetchAllAnime();

  // Check saved wishlist state
  if (currentUser) {
    try {
      const doc  = await db.collection('users').doc(currentUser.uid).get();
      const list = doc.exists ? (doc.data().watchlist||[]).map(String) : [];
      list.forEach(id => {
        const btn = document.getElementById(`wl-${id}`);
        if (btn) btn.classList.add('saved');
      });
    } catch(e) {}
  }

  renderHome(data);
  initSearch(data);
  initSidebar();
}

// ===== RENDER HOME =====
function renderHome(data) {
  renderSection('latestGrid',
    data.filter(a=>a.latest).sort((a,b)=>{
      const ta = a.createdAt?.toDate?.()?.getTime()||0;
      const tb = b.createdAt?.toDate?.()?.getTime()||0;
      return tb - ta;
    }), 'No latest releases yet.');

  renderSection('trendingGrid',
    data.filter(a=>a.trending), 'No trending anime yet.');

  renderTop10(data.filter(a=>a.top10).sort((a,b)=>(a.top10rank||0)-(b.top10rank||0)));
}

function renderSection(gridId, items, emptyMsg) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  if (!items.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;
      padding:30px;color:var(--text2);font-size:13px">${emptyMsg}</div>`;
    return;
  }
  items.forEach(anime => grid.appendChild(renderCard(anime)));
}

function renderTop10(items) {
  const grid = document.getElementById('top10Grid');
  if (!grid) return;
  const sec = document.getElementById('top10Section');
  if (!items.length) {
    if (sec) sec.style.display = 'none';
    return;
  }
  if (sec) sec.style.display = 'block';
  grid.innerHTML = '';
  items.forEach((anime, i) => {
    const div = document.createElement('div');
    div.className = 'top10-item';
    div.style.cursor = 'pointer';
    div.innerHTML = `
      <span class="top10-rank">${(i+1)}</span>
      <img src="${anime.thumbnail||''}"
        style="width:60px;height:80px;object-fit:cover;border-radius:8px;flex-shrink:0"
        onerror="this.style.background='var(--bg3)'"/>
      <div style="flex:1;min-width:0">
        <div style="font-size:14px;font-weight:700;color:var(--text);
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${anime.title}
        </div>
        <div style="font-size:12px;color:var(--text2)">
          ${(anime.genre||[]).slice(0,2).join(' · ')}
        </div>
        <div style="font-size:12px;color:var(--accent);font-weight:600;margin-top:3px">
          ★ ${anime.rating||'N/A'}
        </div>
      </div>`;
    div.addEventListener('click', () => {
      window.location.href = `anime.html?id=${anime.firestoreId}`;
    });
    grid.appendChild(div);
  });
}

// ===== FILTER BY CATEGORY =====
function filterCategory(cat, btnEl) {
  currentCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  const filtered = cat === 'all'
    ? allAnimeData
    : allAnimeData.filter(a => a.type === cat);
  renderHome(filtered);
}

// ===== SEARCH =====
function initSearch(data) {
  const searchBtn   = document.getElementById('searchBtn');
  const searchBar   = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');
  const closeSearch = document.getElementById('closeSearch');

  if (searchBtn) searchBtn.addEventListener('click', () => {
    searchBar?.classList.remove('hidden');
    searchInput?.focus();
  });
  if (closeSearch) closeSearch.addEventListener('click', () => {
    searchBar?.classList.add('hidden');
    if (searchInput) searchInput.value = '';
    renderHome(allAnimeData);
  });
  if (searchInput) searchInput.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) { renderHome(allAnimeData); return; }
    const results = allAnimeData.filter(a =>
      a.title.toLowerCase().includes(q) ||
      (a.genre||[]).some(g=>g.toLowerCase().includes(q))
    );
    renderSection('latestGrid', results, 'No results found.');
    const secTrend = document.getElementById('trendingSection');
    const secTop10 = document.getElementById('top10Section');
    if (secTrend) secTrend.style.display = 'none';
    if (secTop10) secTop10.style.display = 'none';
  });
}

// ===== SIDEBAR =====
function initSidebar() {
  const menuBtn  = document.getElementById('menuBtn');
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const closeBtn = document.getElementById('closeSidebar');

  if (menuBtn) menuBtn.addEventListener('click', () => {
    sidebar?.classList.remove('hidden');
    overlay?.classList.remove('hidden');
  });
  const close = () => {
    sidebar?.classList.add('hidden');
    overlay?.classList.add('hidden');
  };
  if (overlay) overlay.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);

  // Sidebar profile click → profile page
  const sidebarProfileEl = document.getElementById('sidebarProfileSection');
  if (sidebarProfileEl) {
    sidebarProfileEl.style.cursor = 'pointer';
    sidebarProfileEl.addEventListener('click', () => {
      if (currentUser) window.location.href = 'profile.html';
      else { close(); openAuthModal(); }
    });
  }

  // Sidebar logout
  const logoutBtn = document.getElementById('sidebarLogout');
  if (logoutBtn) logoutBtn.addEventListener('click', async () => {
    close();
    await auth.signOut();
    window.location.reload();
  });

  // My list sidebar
  const myListBtn = document.getElementById('sidebarMyList');
  if (myListBtn) myListBtn.addEventListener('click', () => {
    close();
    showMyListPage();
  });
}

// ===== MY LIST PAGE =====
async function showMyListPage() {
  if (!currentUser) { openAuthModal(); return; }
  try {
    const doc   = await db.collection('users').doc(currentUser.uid).get();
    const ids   = doc.exists ? (doc.data().watchlist||[]) : [];
    const items = allAnimeData.filter(a => ids.includes(a.firestoreId));
    const latestGrid = document.getElementById('latestGrid');
    const latestSec  = document.getElementById('latestSection');
    const trendSec   = document.getElementById('trendingSection');
    const top10Sec   = document.getElementById('top10Section');
    if (trendSec) trendSec.style.display = 'none';
    if (top10Sec) top10Sec.style.display = 'none';
    if (latestSec) {
      const title = latestSec.querySelector('h2,h3,.section-title,span');
      if (title) title.textContent = 'My List';
    }
    if (latestGrid) {
      latestGrid.innerHTML = '';
      if (!items.length) {
        latestGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;
          padding:40px;color:var(--text2)">
          <i class="fas fa-bookmark"
            style="font-size:36px;opacity:0.3;margin-bottom:14px;display:block"></i>
          Your list is empty.</div>`;
      } else {
        items.forEach(a => latestGrid.appendChild(renderCard(a)));
      }
    }
  } catch(e) { console.error(e); }
}

// ===== INIT =====
loadTheme();
