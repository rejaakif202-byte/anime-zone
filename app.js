// ================================================
// ANIME VERSE — Main App
// ================================================

let currentUser     = null;
let allAnimeData    = [];
let currentCategory = 'all';
let currentPage     = 1;
const PAGE_SIZE     = 20;   // items per page on category/paginated views
const SECTION_SIZE  = 15;   // items shown per home section

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
loadTheme();

// ===== AUTH STATE =====
auth.onAuthStateChanged(async user => {
  currentUser = user;
  if (user) {
    const modal = document.getElementById('avAuthModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
    await updateAuthUI(user);
    initApp();
  } else {
    setProfileBtnAnon();
    updateSidebarProfile(null);
    initApp();
  }
});

// ===== AUTH MODAL =====
function openAuthModal() {
  let modal = document.getElementById('avAuthModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'avAuthModal';
    modal.style.cssText =
      'position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999;' +
      'display:flex;align-items:center;justify-content:center;' +
      'padding:20px;backdrop-filter:blur(6px)';
    modal.innerHTML = `
      <div style="background:var(--card-bg);border:1px solid var(--border);
        border-radius:20px;padding:24px;width:100%;max-width:380px;
        position:relative">

        <button onclick="closeAuthModal()"
          style="position:absolute;top:14px;right:14px;background:none;
            border:none;color:var(--text2);cursor:pointer;font-size:18px">
          <i class="fas fa-times"></i>
        </button>

        <div style="text-align:center;margin-bottom:20px">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;
            letter-spacing:2px;color:var(--text)">
            ANIME <span style="color:var(--accent)">VERSE</span>
          </div>
          <p style="font-size:13px;color:var(--text2);margin-top:4px">
            Login to unlock all features
          </p>
        </div>

        <!-- TABS -->
        <div style="display:flex;background:var(--bg3);
          border-radius:10px;padding:4px;margin-bottom:20px">
          <button id="av_tabLogin" onclick="avSwitchTab('login')"
            style="flex:1;padding:9px;border-radius:8px;border:none;
              background:var(--accent);color:#fff;
              font-family:'Poppins',sans-serif;font-size:13px;
              font-weight:700;cursor:pointer;transition:all 0.2s">
            Login
          </button>
          <button id="av_tabSignup" onclick="avSwitchTab('signup')"
            style="flex:1;padding:9px;border-radius:8px;border:none;
              background:transparent;color:var(--text2);
              font-family:'Poppins',sans-serif;font-size:13px;
              font-weight:600;cursor:pointer;transition:all 0.2s">
            Sign Up
          </button>
        </div>

        <div id="av_authErr"
          style="display:none;background:rgba(229,9,20,0.1);
            border:1px solid #e50914;color:#e50914;
            padding:10px 12px;border-radius:8px;
            font-size:12px;margin-bottom:14px;line-height:1.6">
        </div>
        <div id="av_authOk"
          style="display:none;background:rgba(39,174,96,0.1);
            border:1px solid #27ae60;color:#27ae60;
            padding:10px 12px;border-radius:8px;
            font-size:12px;margin-bottom:14px;line-height:1.6;
            white-space:pre-line">
        </div>

        <!-- LOGIN FORM -->
        <div id="av_loginForm">
          <div style="margin-bottom:14px">
            <label style="font-size:11px;font-weight:700;
              color:var(--text2);letter-spacing:0.5px;
              display:block;margin-bottom:6px">EMAIL</label>
            <input id="av_email" type="email" placeholder="your@email.com"
              style="width:100%;padding:11px 14px;border-radius:10px;
                border:1px solid var(--border);background:var(--bg3);
                color:var(--text);font-family:'Poppins',sans-serif;
                font-size:13px;box-sizing:border-box;outline:none"/>
          </div>
          <div style="margin-bottom:8px">
            <label style="font-size:11px;font-weight:700;
              color:var(--text2);letter-spacing:0.5px;
              display:block;margin-bottom:6px">PASSWORD</label>
            <div style="position:relative">
              <input id="av_pw" type="password" placeholder="Enter password"
                style="width:100%;padding:11px 44px 11px 14px;border-radius:10px;
                  border:1px solid var(--border);background:var(--bg3);
                  color:var(--text);font-family:'Poppins',sans-serif;
                  font-size:13px;box-sizing:border-box;outline:none"
                onkeydown="if(event.key==='Enter')avDoLogin()"/>
              <button onclick="avTogglePw('av_pw','av_eyeL')"
                style="position:absolute;right:12px;top:50%;
                  transform:translateY(-50%);background:none;
                  border:none;color:var(--text2);cursor:pointer;font-size:15px">
                <i class="fas fa-eye" id="av_eyeL"></i>
              </button>
            </div>
          </div>
          <div style="text-align:right;margin-bottom:16px">
            <a href="#" onclick="avForgotPw()"
              style="font-size:12px;color:var(--accent);
                text-decoration:none;font-weight:600">
              <i class="fas fa-key" style="font-size:11px"></i>
              Forgot Password?
            </a>
          </div>
          <button onclick="avDoLogin()"
            style="width:100%;padding:13px;border-radius:12px;
              border:none;background:var(--accent);color:#fff;
              font-family:'Poppins',sans-serif;font-size:14px;
              font-weight:700;cursor:pointer">
            <i class="fas fa-sign-in-alt"></i> Login
          </button>
          <p style="text-align:center;margin-top:14px;
            font-size:12px;color:var(--text2)">
            Don't have an account?
            <a href="#" onclick="avSwitchTab('signup')"
              style="color:var(--accent);font-weight:600;text-decoration:none">
              Sign Up
            </a>
          </p>
        </div>

        <!-- SIGNUP FORM -->
        <div id="av_signupForm" style="display:none">
          <div style="margin-bottom:14px">
            <label style="font-size:11px;font-weight:700;
              color:var(--text2);letter-spacing:0.5px;
              display:block;margin-bottom:6px">DISPLAY NAME</label>
            <input id="av_name" type="text" placeholder="Your name"
              style="width:100%;padding:11px 14px;border-radius:10px;
                border:1px solid var(--border);background:var(--bg3);
                color:var(--text);font-family:'Poppins',sans-serif;
                font-size:13px;box-sizing:border-box;outline:none"/>
          </div>
          <div style="margin-bottom:14px">
            <label style="font-size:11px;font-weight:700;
              color:var(--text2);letter-spacing:0.5px;
              display:block;margin-bottom:6px">EMAIL</label>
            <input id="av_semail" type="email" placeholder="your@email.com"
              style="width:100%;padding:11px 14px;border-radius:10px;
                border:1px solid var(--border);background:var(--bg3);
                color:var(--text);font-family:'Poppins',sans-serif;
                font-size:13px;box-sizing:border-box;outline:none"/>
          </div>
          <div style="margin-bottom:14px">
            <label style="font-size:11px;font-weight:700;
              color:var(--text2);letter-spacing:0.5px;
              display:block;margin-bottom:6px">PASSWORD</label>
            <div style="position:relative">
              <input id="av_spw" type="password"
                placeholder="Minimum 6 characters"
                style="width:100%;padding:11px 44px 11px 14px;border-radius:10px;
                  border:1px solid var(--border);background:var(--bg3);
                  color:var(--text);font-family:'Poppins',sans-serif;
                  font-size:13px;box-sizing:border-box;outline:none"/>
              <button onclick="avTogglePw('av_spw','av_eyeS')"
                style="position:absolute;right:12px;top:50%;
                  transform:translateY(-50%);background:none;
                  border:none;color:var(--text2);cursor:pointer;font-size:15px">
                <i class="fas fa-eye" id="av_eyeS"></i>
              </button>
            </div>
          </div>
          <div style="margin-bottom:16px">
            <label style="font-size:11px;font-weight:700;
              color:var(--text2);letter-spacing:0.5px;
              display:block;margin-bottom:6px">CONFIRM PASSWORD</label>
            <input id="av_spw2" type="password"
              placeholder="Re-enter password"
              style="width:100%;padding:11px 14px;border-radius:10px;
                border:1px solid var(--border);background:var(--bg3);
                color:var(--text);font-family:'Poppins',sans-serif;
                font-size:13px;box-sizing:border-box;outline:none"
              onkeydown="if(event.key==='Enter')avDoSignup()"/>
          </div>
          <div style="background:rgba(200,119,64,0.08);
            border:1px solid var(--accent);border-radius:8px;
            padding:10px 12px;margin-bottom:16px;font-size:12px;
            color:var(--text2);line-height:1.6;
            display:flex;gap:10px;align-items:flex-start">
            <i class="fas fa-shield-halved"
              style="color:var(--accent);margin-top:2px;
                font-size:14px;flex-shrink:0"></i>
            <span>Verification email will be sent. Verify before logging in.</span>
          </div>
          <button onclick="avDoSignup()"
            style="width:100%;padding:13px;border-radius:12px;
              border:none;background:var(--accent);color:#fff;
              font-family:'Poppins',sans-serif;font-size:14px;
              font-weight:700;cursor:pointer">
            <i class="fas fa-user-plus"></i> Create Account
          </button>
          <p style="text-align:center;margin-top:14px;
            font-size:12px;color:var(--text2)">
            Already have an account?
            <a href="#" onclick="avSwitchTab('login')"
              style="color:var(--accent);font-weight:600;text-decoration:none">
              Login
            </a>
          </p>
        </div>
      </div>`;

    modal.addEventListener('click', e => {
      if (e.target === modal) closeAuthModal();
    });
    document.body.appendChild(modal);
  } else {
    modal.style.display = 'flex';
  }
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  const modal = document.getElementById('avAuthModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

function avSwitchTab(tab) {
  const loginForm  = document.getElementById('av_loginForm');
  const signupForm = document.getElementById('av_signupForm');
  const tabLogin   = document.getElementById('av_tabLogin');
  const tabSignup  = document.getElementById('av_tabSignup');
  if (!loginForm) return;
  const isLogin = tab === 'login';
  loginForm.style.display  = isLogin ? 'block' : 'none';
  signupForm.style.display = isLogin ? 'none'  : 'block';
  const activeStyle   = `background:var(--accent);color:#fff;font-weight:700`;
  const inactiveStyle = `background:transparent;color:var(--text2);font-weight:600`;
  if (tabLogin)  tabLogin.style.cssText  += ';' + (isLogin  ? activeStyle : inactiveStyle);
  if (tabSignup) tabSignup.style.cssText += ';' + (!isLogin ? activeStyle : inactiveStyle);
  avClearMsg();
}

function avShowErr(msg) {
  const e = document.getElementById('av_authErr');
  const s = document.getElementById('av_authOk');
  if (e) { e.innerHTML = msg; e.style.display = 'block'; }
  if (s) s.style.display = 'none';
}
function avShowOk(msg) {
  const e = document.getElementById('av_authErr');
  const s = document.getElementById('av_authOk');
  if (s) { s.textContent = msg; s.style.display = 'block'; }
  if (e) e.style.display = 'none';
}
function avClearMsg() {
  const e = document.getElementById('av_authErr');
  const s = document.getElementById('av_authOk');
  if (e) { e.style.display = 'none'; e.innerHTML = ''; }
  if (s) { s.style.display = 'none'; s.textContent = ''; }
}
function avTogglePw(inputId, iconId) {
  const inp  = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
  if (icon) icon.className = inp.type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}

async function avDoLogin() {
  const email = (document.getElementById('av_email')?.value || '').trim();
  const pw    = document.getElementById('av_pw')?.value || '';
  if (!email || !pw) { avShowErr('Please fill in all fields.'); return; }
  try {
    const cred = await auth.signInWithEmailAndPassword(email, pw);
    if (!cred.user.emailVerified) {
      await auth.signOut();
      avShowErr('⚠️ Email not verified! Check your inbox.<br><br>' +
        `<a href="#" onclick="avResend('${email}','${encodeURIComponent(pw)}')"
          style="color:var(--accent);text-decoration:underline;font-weight:600">
          📧 Resend verification email</a>`);
      return;
    }
    avShowOk('✅ Logged in!');
    setTimeout(closeAuthModal, 800);
  } catch(e) {
    const c = e.code || '';
    if (c.includes('wrong-password') || c.includes('user-not-found') ||
        c.includes('invalid-credential') || c.includes('invalid-login')) {
      avShowErr('❌ Wrong email or password.<br><br>' +
        '<a href="#" onclick="avForgotPw()" ' +
        'style="color:var(--accent);text-decoration:underline;font-weight:600">' +
        '🔑 Forgot Password?</a>');
    } else {
      avShowErr('Login failed: ' + e.message.replace('Firebase: ', ''));
    }
  }
}

async function avForgotPw() {
  const email = (document.getElementById('av_email')?.value || '').trim();
  if (!email) { avShowErr('Enter your email above first.'); return; }
  try {
    await auth.sendPasswordResetEmail(email);
    avShowOk('📧 Reset email sent to ' + email + '!');
  } catch(e) {
    avShowErr('Error: ' + e.message.replace('Firebase: ', ''));
  }
}

async function avDoSignup() {
  const name  = (document.getElementById('av_name')?.value   || '').trim();
  const email = (document.getElementById('av_semail')?.value || '').trim();
  const pw    = document.getElementById('av_spw')?.value  || '';
  const pw2   = document.getElementById('av_spw2')?.value || '';
  if (!name || !email || !pw || !pw2) { avShowErr('Please fill in all fields.'); return; }
  if (pw.length < 6) { avShowErr('Password must be at least 6 characters.'); return; }
  if (pw !== pw2)    { avShowErr('Passwords do not match!'); return; }
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pw);
    await cred.user.updateProfile({ displayName: name });
    await cred.user.sendEmailVerification();
    await db.collection('users').doc(cred.user.uid).set({
      name, email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      watchlist: [], emailVerified: false
    });
    await auth.signOut();
    avShowOk('✅ Account created!\n📧 Verification email sent to ' + email);
    setTimeout(() => avSwitchTab('login'), 3000);
  } catch(e) {
    const c = e.code || '';
    if (c === 'auth/email-already-in-use') {
      avShowErr('❌ Email already registered.<br>' +
        '<a href="#" onclick="avSwitchTab(\'login\')" ' +
        'style="color:var(--accent);text-decoration:underline">→ Go to Login</a>');
    } else {
      avShowErr('Signup failed: ' + e.message.replace('Firebase: ', ''));
    }
  }
}

async function avResend(email, encodedPw) {
  try {
    const cred = await auth.signInWithEmailAndPassword(email, decodeURIComponent(encodedPw));
    await cred.user.sendEmailVerification();
    await auth.signOut();
    avShowOk('📧 Verification email resent!');
  } catch(e) {
    avShowErr('Could not resend: ' + e.message.replace('Firebase: ', ''));
  }
}

// ===== UPDATE AUTH UI =====
async function updateAuthUI(user) {
  const profileBtn = document.getElementById('profileBtn');
  let name   = user.displayName || 'User';
  let avatar = user.photoURL || '';
  let email  = user.email || '';
  try {
    const doc  = await db.collection('users').doc(user.uid).get();
    const data = doc.exists ? doc.data() : {};
    if (data.name)     name   = data.name;
    if (data.photoURL) avatar = data.photoURL;
  } catch(e) {}
  const initial = name.charAt(0).toUpperCase();
  if (profileBtn) {
    profileBtn.innerHTML = '';
    profileBtn.style.cssText = `
      width:36px;height:36px;border-radius:50%;
      overflow:hidden;padding:0;border:2px solid var(--accent);
      cursor:pointer;display:flex;align-items:center;
      justify-content:center;background:var(--accent);flex-shrink:0;`;
    if (avatar) {
      const img = document.createElement('img');
      img.src = avatar;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover';
      img.onerror = () => {
        profileBtn.innerHTML = `<span style="font-size:15px;font-weight:700;color:#fff">${initial}</span>`;
      };
      profileBtn.appendChild(img);
    } else {
      profileBtn.innerHTML = `<span style="font-size:15px;font-weight:700;color:#fff">${initial}</span>`;
    }
    profileBtn.onclick = () => { window.location.href = 'profile.html'; };
  }
  updateSidebarProfile({ name, avatar, initial, email });
  const loginBtn  = document.getElementById('sidebarLoginBtn');
  const logoutBtn = document.getElementById('sidebarLogoutBtn');
  if (loginBtn)  loginBtn.style.display  = 'none';
  if (logoutBtn) logoutBtn.style.display = 'flex';
  const adminSec    = document.getElementById('adminSidebarSection');
  const ADMIN_EMAIL = 'rejaakif202@gmail.com';
  if (adminSec) adminSec.style.display = (email === ADMIN_EMAIL) ? 'block' : 'none';
}

function setProfileBtnAnon() {
  const profileBtn = document.getElementById('profileBtn');
  if (!profileBtn) return;
  profileBtn.innerHTML = '';
  profileBtn.style.cssText = `
    width:36px;height:36px;border-radius:50%;
    overflow:hidden;padding:0;border:none;
    cursor:pointer;display:flex;align-items:center;
    justify-content:center;background:var(--bg3);flex-shrink:0;`;
  profileBtn.innerHTML = '<i class="fas fa-user" style="color:var(--text2);font-size:15px"></i>';
  profileBtn.onclick = () => openAuthModal();
}

function updateSidebarProfile(userData) {
  const nameEl   = document.getElementById('sidebarUserName');
  const emailEl  = document.getElementById('sidebarUserEmail');
  const avatarEl = document.getElementById('sidebarAvatar');
  if (!userData) {
    if (nameEl)   nameEl.textContent  = 'Guest';
    if (emailEl)  emailEl.textContent = 'Login to save progress';
    if (avatarEl) avatarEl.innerHTML  =
      '<i class="fas fa-user" style="font-size:20px;color:#fff"></i>';
    return;
  }
  const { name, avatar, initial, email } = userData;
  if (nameEl)  nameEl.textContent  = name;
  if (emailEl) emailEl.textContent = email || '';
  if (avatarEl) {
    avatarEl.innerHTML = avatar
      ? `<img src="${avatar}"
           style="width:100%;height:100%;border-radius:50%;object-fit:cover"
           onerror="this.parentElement.innerHTML='<span style=\\'font-size:22px;font-weight:700;color:#fff\\'>${initial}</span>'"/>`
      : `<span style="font-size:22px;font-weight:700;color:#fff">${initial}</span>`;
  }
}

// ===== LOGOUT =====
async function logoutUser() {
  await auth.signOut();
  currentUser = null;
  window.location.reload();
}

// ===== MY LIST =====
async function toggleMyList(id, btnEl) {
  id = String(id);
  if (!currentUser) { openAuthModal(); return; }
  try {
    const ref = db.collection('users').doc(currentUser.uid);
    const doc = await ref.get();
    let list  = doc.exists ? (doc.data().watchlist||[]).map(String) : [];
    if (list.includes(id)) {
      list = list.filter(x => x !== id);
      if (btnEl) btnEl.classList.remove('saved');
    } else {
      list.push(id);
      if (btnEl) btnEl.classList.add('saved');
    }
    await ref.set({ watchlist: list }, { merge: true });
  } catch(e) { console.error('Watchlist error:', e); }
}

async function handleWishlistToggle(id, btnEl) {
  if (!currentUser) { openAuthModal(); return; }
  await toggleMyList(id, btnEl);
}

// ===== FETCH ANIME =====
async function fetchAllAnime() {
  try {
    let snap;
    try {
      snap = await db.collection('anime').orderBy('createdAt','desc').get();
    } catch(e) {
      snap = await db.collection('anime').get();
    }
    const data = [];
    snap.forEach(doc => data.push({ ...doc.data(), firestoreId: doc.id }));
    allAnimeData = data;
    return data;
  } catch(e) {
    console.error('Fetch error:', e);
    return [];
  }
}

// ===== RENDER CARD =====
function renderCard(anime, isScroll = false) {
  const div = document.createElement('div');
  div.className    = 'card';
  div.style.cursor = 'pointer';
  const genres = (anime.genre||[]).slice(0,2).map(g =>
    `<span class="genre-tag" style="font-size:10px;padding:3px 8px">${g}</span>`
  ).join('');
  // ✅ Use banner image everywhere as requested
  const imgSrc = anime.banner || anime.thumbnail || '';
  div.innerHTML = `
    <div style="position:relative">
      <img class="card-thumb"
        src="${imgSrc}" alt="${anime.title}"
        onerror="this.src='https://via.placeholder.com/400x250?text=No+Image'"/>
      <button class="wishlist-btn" id="wl-${anime.firestoreId}"
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

// ===== RENDER NEWS CARD =====
function renderNewsCard(anime) {
  const div = document.createElement('div');
  div.className    = 'news-card';
  div.style.cursor = 'pointer';
  const desc = anime.description || anime.desc || '';
  div.innerHTML = `
    <img class="news-thumb"
      src="${anime.thumbnail||''}" alt="${anime.title}"
      onerror="this.style.background='var(--bg3)'"/>
    <div class="news-info">
      <div class="news-title">${anime.title}</div>
      ${desc ? `<div class="news-desc">${desc.slice(0,150)}${desc.length>150?'…':''}</div>` : ''}
    </div>`;
  div.addEventListener('click', () => {
    window.location.href = `anime.html?id=${anime.firestoreId}`;
  });
  return div;
}


async function initApp() {
  const loadingState = document.getElementById('loadingState');
  const emptyState   = document.getElementById('emptyState');
  const homeSecs     = document.getElementById('homeSections');
  if (loadingState) loadingState.style.display = 'flex';
  if (emptyState)   emptyState.classList.add('hidden');
  if (homeSecs)     homeSecs.style.display = 'block';
  const data = await fetchAllAnime();
  if (loadingState) loadingState.style.display = 'none';
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
  initSidebar();
}

// ===================================================================
// ===== PAGINATION ENGINE ===========================================
// ===================================================================

/**
 * Renders paginated grid + page buttons.
 * @param {Array}  items    - Filtered array to paginate
 * @param {number} page     - Current page (1-indexed)
 * @param {string} gridId   - ID of the grid container
 * @param {string} label    - Section label shown above grid
 */
function renderPaginatedView(items, page, gridId, label) {
  const total      = items.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safeP      = Math.min(Math.max(1, page), totalPages);
  const start      = (safeP - 1) * PAGE_SIZE;
  const end        = Math.min(start + PAGE_SIZE, total);
  const slice      = items.slice(start, end);

  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  if (!slice.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;
      padding:40px;color:var(--text2);font-size:13px">No content here yet.</div>`;
  } else {
    const isScroll = grid.classList.contains('scroll-row');
    slice.forEach(a => grid.appendChild(renderCard(a, isScroll)));
  }

  // Section title
  const titleEl = document.getElementById('pageSectionTitle');
  if (titleEl && label) titleEl.textContent = label;

  // Pagination buttons
  renderPageButtons(safeP, totalPages);
}

/**
 * Renders 3D square page number buttons.
 */
function renderPageButtons(current, total) {
  const wrap = document.getElementById('paginationWrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  if (total <= 1) return;   // no buttons needed if only 1 page

  const container = document.createElement('div');
  container.style.cssText = `
    display:flex; align-items:center; justify-content:center;
    gap:7px; flex-wrap:wrap; padding:16px 0 8px;`;

  // Build page list with "..." gaps
  const pages = buildPageList(current, total);

  pages.forEach(p => {
    if (p === '...') {
      const dot = document.createElement('span');
      dot.textContent = '···';
      dot.style.cssText = `
        font-size:14px; color:var(--text2); font-weight:700;
        padding:0 4px; font-family:'Poppins',sans-serif;`;
      container.appendChild(dot);
    } else {
      const btn = document.createElement('button');
      const isActive = p === current;
      btn.textContent = String(p);
      btn.style.cssText = `
        min-width:40px; height:40px; padding:0 8px;
        border-radius:8px;
        background:${isActive ? 'var(--accent)' : 'var(--card-bg)'};
        color:${isActive ? '#fff' : 'var(--text2)'};
        border:1.5px solid ${isActive ? 'var(--accent)' : 'var(--border)'};
        font-family:'Poppins',sans-serif; font-size:13px; font-weight:800;
        cursor:${isActive ? 'default' : 'pointer'};
        transition:all 0.15s;
        box-shadow:${isActive
          ? '0 4px 0 var(--btn-shadow,rgba(100,80,200,0.4)),0 6px 14px rgba(0,0,0,0.2)'
          : '0 3px 0 var(--btn-3d,rgba(0,0,0,0.2)),0 4px 10px rgba(0,0,0,0.12)'};
        outline:none;`;
      if (!isActive) {
        btn.onmouseover = () => {
          btn.style.borderColor = 'var(--accent)';
          btn.style.color       = 'var(--accent)';
          btn.style.transform   = 'translateY(-1px)';
        };
        btn.onmouseout = () => {
          btn.style.borderColor = 'var(--border)';
          btn.style.color       = 'var(--text2)';
          btn.style.transform   = '';
        };
        btn.onmousedown = () => { btn.style.transform = 'translateY(2px)'; };
        btn.onmouseup   = () => { btn.style.transform = ''; };
        btn.onclick     = () => goToPage(p);
      }
      container.appendChild(btn);
    }
  });

  wrap.appendChild(container);
}

/** Builds smart page list: [1,2,3,...,8,9,10] for long ranges */
function buildPageList(current, total) {
  if (total <= 7) return Array.from({length: total}, (_,i) => i+1);
  const pages = [];
  const delta = 1; // pages around current
  // Always show first 2 and last 2 + current ± delta
  const rangeStart = Math.max(2,      current - delta);
  const rangeEnd   = Math.min(total-1, current + delta);
  pages.push(1);
  if (rangeStart > 2) pages.push('...');
  for (let p = rangeStart; p <= rangeEnd; p++) pages.push(p);
  if (rangeEnd < total - 1) pages.push('...');
  pages.push(total);
  return pages;
}

/** Navigate to a page */
function goToPage(page) {
  currentPage = page;
  // Hide home sections, show category section
  const homeSecs    = document.getElementById('homeSections');
  const catSec      = document.getElementById('pageCategorySection');
  const myListSec   = document.getElementById('myListSection');
  if (myListSec)  myListSec.classList.add('hidden');
  if (homeSecs)   homeSecs.style.display    = 'none';
  if (catSec)     catSec.style.display      = 'block';

  const cat   = currentCategory;
  const label = getCategoryLabel(cat);
  const items = getFilteredItems(cat);
  renderPaginatedView(items, currentPage, 'pageCategoryGrid', label);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getCategoryLabel(cat) {
  const map = { all:'All Anime', anime:'Anime', movie:'Movies',
                series:'Series', news:'News' };
  return map[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
}

function getFilteredItems(cat) {
  if (cat === 'all') return allAnimeData;
  return allAnimeData.filter(a => a.type === cat);
}

// ===== RENDER HOME =====
function renderHome(data) {
  currentPage = 1;

  const latest   = data.filter(a => a.latest && a.type !== 'news').sort((a,b) => {
    const ta = a.createdAt?.toDate?.()?.getTime() || 0;
    const tb = b.createdAt?.toDate?.()?.getTime() || 0;
    return tb - ta;
  });
  const trending = data.filter(a => a.trending && a.type !== 'news');
  const top10    = data.filter(a => a.top10 && a.type !== 'news')
    .sort((a,b) => (a.top10rank||0) - (b.top10rank||0));
  const news     = data.filter(a => a.type === 'news');

  const latestSec   = document.getElementById('latestSection');
  const trendingSec = document.getElementById('trendingSection');
  const top10Sec    = document.getElementById('top10Section');
  const newsSec     = document.getElementById('newsSection');
  const emptyState  = document.getElementById('emptyState');
  const homeSecs    = document.getElementById('homeSections');
  const myListSec   = document.getElementById('myListSection');
  const catSec      = document.getElementById('pageCategorySection');

  if (myListSec) myListSec.classList.add('hidden');
  if (catSec)    catSec.style.display    = 'none';
  if (homeSecs)  homeSecs.style.display  = 'block';

  // Clear pagination
  const pw = document.getElementById('paginationWrap');
  if (pw) pw.innerHTML = '';

  if (data.length === 0) {
    if (emptyState)   emptyState.classList.remove('hidden');
    if (latestSec)    latestSec.classList.add('hidden');
    if (trendingSec)  trendingSec.classList.add('hidden');
    if (top10Sec)     top10Sec.classList.add('hidden');
    return;
  }
  if (emptyState) emptyState.classList.add('hidden');

  const hasTagged = latest.length || trending.length || top10.length;
  if (!hasTagged) {
    if (latestSec)   latestSec.classList.add('hidden');
    if (top10Sec)    top10Sec.classList.add('hidden');
    if (trendingSec) trendingSec.classList.remove('hidden');
    renderGrid('trendingGrid', data.filter(a => a.type !== 'news'), 'No anime yet.');
    renderNewsSection(news);
    return;
  }

  if (latestSec)   latestSec.classList.toggle('hidden',   !latest.length);
  if (trendingSec) trendingSec.classList.toggle('hidden', !trending.length);

  // Page 1 sections: show only first SECTION_SIZE items
  renderGrid('latestGrid',   latest.slice(0, SECTION_SIZE),   'No latest releases yet.');
  renderGrid('trendingGrid', trending.slice(0, SECTION_SIZE), 'No trending anime yet.');
  renderTop10(top10.slice(0, SECTION_SIZE));
  renderNewsSection(news);

  // ── "SEE MORE" pagination: if any section overflows, show page buttons ──
  // We paginate ALL anime (entire library) across pages 2+
  const totalItems = data.length;
  if (totalItems > SECTION_SIZE) {
    // Total pages = page 1 (sections) + pages for full list
    const extraPages = Math.ceil(totalItems / PAGE_SIZE);
    const totalPages = 1 + extraPages;
    renderPageButtons(1, totalPages);
  }
}

function renderGrid(gridId, items, emptyMsg) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  if (!items.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;
      padding:30px;color:var(--text2);font-size:13px">${emptyMsg}</div>`;
    return;
  }
  const isScroll = grid.classList.contains('scroll-row');
  items.forEach(a => grid.appendChild(renderCard(a, isScroll)));
}

function renderNewsSection(items) {
  const sec  = document.getElementById('newsSection');
  const grid = document.getElementById('newsGrid');
  if (!sec || !grid) return;
  if (!items.length) { sec.classList.add('hidden'); return; }
  sec.classList.remove('hidden');
  grid.innerHTML = '';
  items.slice(0, SECTION_SIZE).forEach(a => grid.appendChild(renderNewsCard(a)));
}

function renderTop10(items) {
  const grid = document.getElementById('top10Grid');
  const sec  = document.getElementById('top10Section');
  if (!grid || !sec) return;
  if (!items.length) { sec.classList.add('hidden'); return; }
  sec.classList.remove('hidden');
  grid.innerHTML = '';
  // ✅ Use normal renderCard — same as other sections
  const isScroll = grid.classList.contains('scroll-row');
  items.forEach(a => grid.appendChild(renderCard(a, isScroll)));
}

// ===== FILTER CATEGORY (pills) =====
function filterCategory(cat, btnEl) {
  currentCategory = cat;
  currentPage     = 1;
  document.querySelectorAll('.cat-pill,.pill').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  const myListSec = document.getElementById('myListSection');
  if (myListSec) myListSec.classList.add('hidden');

  if (cat === 'all') {
    // Show home sections (page 1)
    const homeSecs = document.getElementById('homeSections');
    const catSec   = document.getElementById('pageCategorySection');
    if (homeSecs) homeSecs.style.display = 'block';
    if (catSec)   catSec.style.display   = 'none';
    renderHome(allAnimeData);
  } else {
    // Show paginated category grid
    const homeSecs = document.getElementById('homeSections');
    const catSec   = document.getElementById('pageCategorySection');
    if (homeSecs) homeSecs.style.display = 'none';
    if (catSec)   catSec.style.display   = 'block';
    const items = getFilteredItems(cat);
    renderPaginatedView(items, 1, 'pageCategoryGrid', getCategoryLabel(cat));
  }
}

// ===== SEARCH =====
let searchActive = false;

function toggleSearch() {
  const bar = document.getElementById('searchBar');
  const inp = document.getElementById('searchInput');
  if (!bar) return;
  searchActive = !searchActive;
  bar.classList.toggle('open', searchActive);
  if (searchActive && inp) inp.focus();
  else if (inp) { inp.value = ''; renderHome(allAnimeData); }
}

function closeSearch() {
  searchActive = false;
  const bar = document.getElementById('searchBar');
  const inp = document.getElementById('searchInput');
  if (bar) bar.classList.remove('open');
  if (inp) inp.value = '';
  renderHome(allAnimeData);
}

function searchAnime(q) {
  // Hide pagination during search
  const pw = document.getElementById('paginationWrap');
  if (pw) pw.innerHTML = '';

  if (!q.trim()) { renderHome(allAnimeData); return; }
  const r = allAnimeData.filter(a =>
    a.title.toLowerCase().includes(q.toLowerCase()) ||
    (a.genre||[]).some(g => g.toLowerCase().includes(q.toLowerCase()))
  );

  // Show results in home latest section
  const sec1 = document.getElementById('trendingSection');
  const sec2 = document.getElementById('top10Section');
  const sec3 = document.getElementById('latestSection');
  const catSec = document.getElementById('pageCategorySection');
  const homeSecs = document.getElementById('homeSections');
  if (catSec)   catSec.style.display = 'none';
  if (homeSecs) homeSecs.style.display = 'block';
  if (sec1) sec1.classList.add('hidden');
  if (sec2) sec2.classList.add('hidden');
  if (sec3) sec3.classList.remove('hidden');
  renderGrid('latestGrid', r, 'No results found.');
}

// ===== SIDEBAR =====
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  window.toggleSidebar = () => {
    if (!sidebar) return;
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
  };
  window.closeSidebar = () => {
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
  };

  if (overlay) overlay.addEventListener('click', window.closeSidebar);

  const pfSec = document.getElementById('sidebarProfileSection');
  if (pfSec) {
    pfSec.onclick = () => {
      window.closeSidebar();
      if (currentUser) window.location.href = 'profile.html';
      else openAuthModal();
    };
  }
}

// ===== MY LIST =====
function showMyList() {
  if (!currentUser) { openAuthModal(); return; }
  const myListSec  = document.getElementById('myListSection');
  const homeSecs   = document.getElementById('homeSections');
  const catSec     = document.getElementById('pageCategorySection');
  if (myListSec) myListSec.classList.remove('hidden');
  if (homeSecs)  homeSecs.style.display = 'none';
  if (catSec)    catSec.style.display   = 'none';
  const pw = document.getElementById('paginationWrap');
  if (pw) pw.innerHTML = '';

  const grid  = document.getElementById('myListGrid');
  const empty = document.getElementById('myListEmpty');
  db.collection('users').doc(currentUser.uid).get().then(doc => {
    const ids   = doc.exists ? (doc.data().watchlist||[]) : [];
    const items = allAnimeData.filter(a =>
      ids.map(String).includes(String(a.firestoreId))
    );
    if (!items.length) {
      if (grid)  grid.innerHTML = '';
      if (empty) empty.style.display = 'flex';
      return;
    }
    if (empty) empty.style.display = 'none';
    if (grid) {
      grid.innerHTML = '';
      items.forEach(a => grid.appendChild(renderCard(a)));
    }
  }).catch(e => console.error(e));
}

function scrollTrending() {
  const sec = document.getElementById('trendingSection') ||
              document.getElementById('trendingAnchor');
  if (sec) sec.scrollIntoView({ behavior: 'smooth' });
}

// ===== GLOBAL EXPORTS =====
window.toggleTheme          = toggleTheme;
window.filterCategory       = filterCategory;
window.scrollTrending       = scrollTrending;
window.showMyList           = showMyList;
window.logoutUser           = logoutUser;
window.openAuthModal        = openAuthModal;
window.closeAuthModal       = closeAuthModal;
window.handleWishlistToggle = handleWishlistToggle;
window.toggleSearch         = toggleSearch;
window.closeSearch          = closeSearch;
window.searchAnime          = searchAnime;
window.goToPage             = goToPage;
window.avSwitchTab          = avSwitchTab;
window.avDoLogin            = avDoLogin;
window.avDoSignup           = avDoSignup;
window.avForgotPw           = avForgotPw;
window.avTogglePw           = avTogglePw;
window.avResend             = avResend;
