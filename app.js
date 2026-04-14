// ================================================
// ANIME VERSE — Main App
// ================================================

let currentUser     = null;
let allAnimeData    = [];
let currentCategory = 'all';

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

        <!-- Error/Success -->
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
  if (inp.type === 'password') {
    inp.type = 'text';
    if (icon) icon.className = 'fas fa-eye-slash';
  } else {
    inp.type = 'password';
    if (icon) icon.className = 'fas fa-eye';
  }
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

  if (!name || !email || !pw || !pw2) {
    avShowErr('Please fill in all fields.'); return;
  }
  if (pw.length < 6) {
    avShowErr('Password must be at least 6 characters.'); return;
  }
  if (pw !== pw2) {
    avShowErr('Passwords do not match!'); return;
  }

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
    const cred = await auth.signInWithEmailAndPassword(
      email, decodeURIComponent(encodedPw));
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
    if (data.name)      name   = data.name;
    if (data.photoURL)  avatar = data.photoURL;
  } catch(e) {}

  const initial = name.charAt(0).toUpperCase();

  if (profileBtn) {
    profileBtn.innerHTML = '';
    profileBtn.style.cssText = `
      width:36px;height:36px;border-radius:50%;
      overflow:hidden;padding:0;border:2px solid var(--accent);
      cursor:pointer;display:flex;align-items:center;
      justify-content:center;background:var(--accent);
      flex-shrink:0;`;

    if (avatar) {
      const img     = document.createElement('img');
      img.src       = avatar;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover';
      img.onerror   = () => {
        profileBtn.innerHTML =
          `<span style="font-size:15px;font-weight:700;color:#fff">${initial}</span>`;
      };
      profileBtn.appendChild(img);
    } else {
      profileBtn.innerHTML =
        `<span style="font-size:15px;font-weight:700;color:#fff">${initial}</span>`;
    }
    profileBtn.onclick = () => { window.location.href = 'profile.html'; };
  }

  updateSidebarProfile({ name, avatar, initial, email });

  const loginBtn  = document.getElementById('sidebarLoginBtn');
  const logoutBtn = document.getElementById('sidebarLogoutBtn');
  if (loginBtn)  loginBtn.style.display  = 'none';
  if (logoutBtn) logoutBtn.style.display = 'flex';

  const adminSec = document.getElementById('adminSidebarSection');
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
  profileBtn.innerHTML =
    '<i class="fas fa-user" style="color:var(--text2);font-size:15px"></i>';
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
function renderCard(anime) {
  const div = document.createElement('div');
  div.className    = 'card';
  div.style.cursor = 'pointer';
  const genres = (anime.genre||[]).slice(0,2).map(g =>
    `<span class="genre-tag" style="font-size:10px;padding:3px 8px">${g}</span>`
  ).join('');
  div.innerHTML = `
    <div style="position:relative">
      <img class="card-thumb"
        src="${anime.thumbnail||''}" alt="${anime.title}"
        onerror="this.style.background='var(--bg3)'"/>
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

// ===== INIT APP =====
async function initApp() {
  // Show loading, hide everything else
  const loadingState = document.getElementById('loadingState');
  const emptyState   = document.getElementById('emptyState');
  const homeSecs     = document.getElementById('homeSections');
  if (loadingState) loadingState.style.display = 'flex';
  if (emptyState)   emptyState.classList.add('hidden');
  if (homeSecs)     homeSecs.style.display = 'block';

  const data = await fetchAllAnime();

  // Hide loading once data comes in
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

// ===== RENDER HOME =====
function renderHome(data) {
  const latest   = data.filter(a => a.latest).sort((a,b) => {
    const ta = a.createdAt?.toDate?.()?.getTime() || 0;
    const tb = b.createdAt?.toDate?.()?.getTime() || 0;
    return tb - ta;
  });
  const trending = data.filter(a => a.trending);
  const top10    = data.filter(a => a.top10)
    .sort((a,b) => (a.top10rank||0) - (b.top10rank||0));

  const latestSec   = document.getElementById('latestSection');
  const trendingSec = document.getElementById('trendingSection');
  const top10Sec    = document.getElementById('top10Section');
  const emptyState  = document.getElementById('emptyState');
  const homeSecs    = document.getElementById('homeSections');
  const myListSec   = document.getElementById('myListSection');

  // Always hide myList when rendering home
  if (myListSec) myListSec.classList.add('hidden');
  if (homeSecs)  homeSecs.style.display = 'block';

  if (data.length === 0) {
    if (emptyState)   emptyState.classList.remove('hidden');
    if (latestSec)    latestSec.classList.add('hidden');
    if (trendingSec)  trendingSec.classList.add('hidden');
    if (top10Sec)     top10Sec.classList.add('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  // ✅ FIXED: If nothing tagged — show all anime in trending section
  const hasTagged = latest.length || trending.length || top10.length;

  if (!hasTagged) {
    if (latestSec)   latestSec.classList.add('hidden');
    if (top10Sec)    top10Sec.classList.add('hidden');
    if (trendingSec) trendingSec.classList.remove('hidden');
    renderGrid('trendingGrid', data, 'No anime yet.');
    return;
  }

  if (latestSec)   latestSec.classList.toggle('hidden',   !latest.length);
  if (trendingSec) trendingSec.classList.toggle('hidden', !trending.length);

  renderGrid('latestGrid',   latest,   'No latest releases yet.');
  renderGrid('trendingGrid', trending, 'No trending anime yet.');
  renderTop10(top10);
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
  items.forEach(a => grid.appendChild(renderCard(a)));
}

function renderTop10(items) {
  const grid = document.getElementById('top10Grid');
  const sec  = document.getElementById('top10Section');
  if (!grid || !sec) return;
  if (!items.length) { sec.classList.add('hidden'); return; }
  sec.classList.remove('hidden');
  grid.innerHTML = '';
  items.forEach((anime, i) => {
    const div = document.createElement('div');
    div.className    = 'top10-item';
    div.style.cursor = 'pointer';
    div.innerHTML = `
      <span class="top10-rank">${i+1}</span>
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

// ===== FILTER CATEGORY =====
function filterCategory(cat, btnEl) {
  currentCategory = cat;
  document.querySelectorAll('.cat-pill,.pill').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  const filtered = cat === 'all'
    ? allAnimeData
    : allAnimeData.filter(a => a.type === cat);
  renderHome(filtered);
}

// ===== SEARCH =====
let searchActive = false;

function toggleSearch() {
  const bar = document.getElementById('searchBar');
  const inp = document.getElementById('searchInput');
  if (!bar) return;
  searchActive = !searchActive;
  // ✅ FIX: CSS uses .open class, not .hidden
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
  if (!q.trim()) { renderHome(allAnimeData); return; }
  const r = allAnimeData.filter(a =>
    a.title.toLowerCase().includes(q.toLowerCase()) ||
    (a.genre||[]).some(g => g.toLowerCase().includes(q.toLowerCase()))
  );
  const sec1 = document.getElementById('trendingSection');
  const sec2 = document.getElementById('top10Section');
  const sec3 = document.getElementById('latestSection');
  if (sec1) sec1.classList.add('hidden');
  if (sec2) sec2.classList.add('hidden');
  if (sec3) sec3.classList.remove('hidden');
  renderGrid('latestGrid', r, 'No results found.');
}

// ===== SIDEBAR — FIXED to use .open class =====
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  // ✅ FIXED: Use .open class (matches CSS) instead of .hidden
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

// ===== MY LIST PAGE =====
function showMyList() {
  if (!currentUser) { openAuthModal(); return; }

  const myListSec  = document.getElementById('myListSection');
  const homeSecs   = document.getElementById('homeSections');

  if (myListSec) myListSec.classList.remove('hidden');
  if (homeSecs)  homeSecs.style.display = 'none';

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
window.avSwitchTab          = avSwitchTab;
window.avDoLogin            = avDoLogin;
window.avDoSignup           = avDoSignup;
window.avForgotPw           = avForgotPw;
window.avTogglePw           = avTogglePw;
window.avResend             = avResend;
