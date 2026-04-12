// ============================================
// ANIME VERSE — Main App Logic (Firebase)
// ============================================

function goToProfile() {
  if (currentUser) {
    window.location.href = 'profile.html';
  } else {
    openAuthModal();
  }
}

let allAnimeCache = [];
let currentUser   = null;

// ===== THEME =====
function toggleTheme() {
  const html = document.documentElement;
  const btn  = document.getElementById('themeBtn');
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  localStorage.setItem('av_theme', isDark ? 'light' : 'dark');
}
function loadTheme() {
  const saved = localStorage.getItem('av_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.innerHTML = saved === 'dark'
    ? '<i class="fas fa-moon"></i>'
    : '<i class="fas fa-sun"></i>';
}

// ===== SIDEBAR =====
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('active');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
}

// ===== SEARCH =====
function toggleSearch() {
  document.getElementById('searchBar').classList.toggle('open');
  if (document.getElementById('searchBar').classList.contains('open')) {
    setTimeout(() => document.getElementById('searchInput').focus(), 300);
  }
}
function closeSearch() {
  document.getElementById('searchBar').classList.remove('open');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchSection').classList.add('hidden');
  document.getElementById('homeSections').classList.remove('hidden');
}
function searchAnime(query) {
  const q = query.trim().toLowerCase();
  const searchSection   = document.getElementById('searchSection');
  const homeSections    = document.getElementById('homeSections');
  const myListSection   = document.getElementById('myListSection');
  const categorySection = document.getElementById('categorySection');

  if (q.length < 1) {
    searchSection.classList.add('hidden');
    homeSections.classList.remove('hidden');
    return;
  }
  myListSection.classList.add('hidden');
  categorySection.classList.add('hidden');
  homeSections.classList.add('hidden');
  searchSection.classList.remove('hidden');

  const results = allAnimeCache.filter(a =>
    a.title.toLowerCase().includes(q) ||
    (a.genre && a.genre.join(' ').toLowerCase().includes(q)) ||
    (a.type && a.type.toLowerCase().includes(q))
  );
  const grid  = document.getElementById('searchGrid');
  const empty = document.getElementById('searchEmpty');
  grid.innerHTML = '';
  if (results.length === 0) {
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    results.forEach(a => grid.appendChild(createCard(a)));
  }
}

// ===== AUTH MODAL =====
function openAuthModal() {
  if (currentUser) {
    if (confirm(`Logged in as ${currentUser.displayName || currentUser.email}\n\nDo you want to logout?`)) {
      logoutUser();
    }
    return;
  }
  document.getElementById('authModal').classList.remove('hidden');
  clearAuthMessages();
  switchAuthTab('login');
}
function closeAuthModal() {
  document.getElementById('authModal').classList.add('hidden');
  clearAuthMessages();
}
function clearAuthMessages() {
  document.getElementById('authError').style.display   = 'none';
  document.getElementById('authSuccess').style.display = 'none';
  document.getElementById('authError').innerHTML       = '';
  document.getElementById('authSuccess').textContent   = '';
}
function switchAuthTab(tab) {
  document.getElementById('loginForm').style.display  = tab === 'login'  ? 'block' : 'none';
  document.getElementById('signupForm').style.display = tab === 'signup' ? 'block' : 'none';
  document.getElementById('loginTab').classList.toggle('active',  tab === 'login');
  document.getElementById('signupTab').classList.toggle('active', tab === 'signup');
  clearAuthMessages();
}

function showAuthError(msg) {
  const el = document.getElementById('authError');
  el.innerHTML = msg;
  el.style.display = 'block';
  document.getElementById('authSuccess').style.display = 'none';
}
function showAuthSuccess(msg) {
  const el = document.getElementById('authSuccess');
  el.textContent = msg;
  el.style.display = 'block';
  document.getElementById('authError').style.display = 'none';
}

// ===== LOGIN =====
async function loginUser() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showAuthError('Please fill in all fields.');
    return;
  }

  const btn = document.getElementById('loginBtn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
  btn.disabled  = true;

  try {
    const cred = await auth.signInWithEmailAndPassword(email, password);

    // Check if email is verified
    if (!cred.user.emailVerified) {
      await auth.signOut();
      showAuthError(
        '⚠️ Email not verified! Please check your inbox and click the verification link.<br><br>' +
        '<a href="#" onclick="resendVerification(\'' + email + '\',\'' + encodeURIComponent(password) + '\')" ' +
        'style="color:var(--accent);text-decoration:underline;font-weight:600">' +
        '📧 Resend verification email</a>'
      );
      return;
    }

    showAuthSuccess('✅ Logged in successfully!');
    setTimeout(closeAuthModal, 1000);

  } catch(e) {
    const code = e.code || '';
    if (code === 'auth/invalid-login-credentials' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-credential') {
      showAuthError(
        '❌ Wrong email or password.<br><br>' +
        '<a href="#" onclick="forgotPassword()" ' +
        'style="color:var(--accent);text-decoration:underline;font-weight:600">' +
        '🔑 Forgot Password? Reset it here</a>'
      );
    } else if (code === 'auth/too-many-requests') {
      showAuthError('Too many failed attempts. Please try again later or reset your password.');
    } else if (code === 'auth/invalid-email') {
      showAuthError('Please enter a valid email address.');
    } else {
      showAuthError('Login failed: ' + e.message.replace('Firebase: ', ''));
    }
  } finally {
    btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    btn.disabled  = false;
  }
}

// ===== FORGOT PASSWORD =====
async function forgotPassword() {
  const email = document.getElementById('loginEmail').value.trim();
  if (!email) {
    showAuthError(
      'Please enter your email address in the field above first, then click forgot password.'
    );
    return;
  }

  try {
    await auth.sendPasswordResetEmail(email);
    showAuthSuccess(
      '📧 Password reset email sent to ' + email + '!\n\nCheck your inbox (and spam folder).'
    );
  } catch(e) {
    const code = e.code || '';
    if (code === 'auth/user-not-found') {
      showAuthError('No account found with this email. Please sign up first.');
    } else {
      showAuthError('Could not send reset email: ' + e.message.replace('Firebase: ', ''));
    }
  }
}

// ===== SIGNUP =====
async function signupUser() {
  const name     = document.getElementById('signupName').value.trim();
  const email    = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirm  = document.getElementById('signupConfirm').value;

  // Validation
  if (!name || !email || !password || !confirm) {
    showAuthError('Please fill in all fields.');
    return;
  }
  if (password.length < 6) {
    showAuthError('Password must be at least 6 characters long.');
    return;
  }
  if (password !== confirm) {
    showAuthError('Passwords do not match!');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showAuthError('Please enter a valid email address.');
    return;
  }

  const btn = document.getElementById('signupBtn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
  btn.disabled  = true;

  try {
    // Check if email already exists first
    const methods = await auth.fetchSignInMethodsForEmail(email);
    if (methods && methods.length > 0) {
      showAuthError(
        '❌ This email is already registered. Please login instead.<br><br>' +
        '<a href="#" onclick="switchAuthTab(\'login\')" ' +
        'style="color:var(--accent);text-decoration:underline;font-weight:600">' +
        '→ Go to Login</a>'
      );
      return;
    }

    // Create account
    const cred = await auth.createUserWithEmailAndPassword(email, password);

    // Set display name
    await cred.user.updateProfile({ displayName: name });

    // Send verification email
    await cred.user.sendEmailVerification();

    // Save user data to Firestore
    await db.collection('users').doc(cred.user.uid).set({
      name,
      email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      watchlist:  [],
      emailVerified: false
    });

    // Sign out until verified
    await auth.signOut();

    showAuthSuccess(
      '✅ Account created successfully!\n\n' +
      '📧 A verification email has been sent to ' + email + '\n\n' +
      'Please check your inbox and click the verification link before logging in.'
    );

    // Clear signup form
    document.getElementById('signupName').value     = '';
    document.getElementById('signupEmail').value    = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupConfirm').value  = '';

    // Switch to login tab after 3 seconds
    setTimeout(() => {
      switchAuthTab('login');
      document.getElementById('loginEmail').value = email;
    }, 3000);

  } catch(e) {
    const code = e.code || '';
    if (code === 'auth/email-already-in-use') {
      showAuthError(
        '❌ This email is already registered.<br><br>' +
        '<a href="#" onclick="switchAuthTab(\'login\')" ' +
        'style="color:var(--accent);text-decoration:underline;font-weight:600">' +
        '→ Go to Login</a> or ' +
        '<a href="#" onclick="forgotPasswordDirect(\'' + email + '\')" ' +
        'style="color:var(--accent);text-decoration:underline;font-weight:600">' +
        'Reset Password</a>'
      );
    } else if (code === 'auth/weak-password') {
      showAuthError('Password is too weak. Use at least 6 characters.');
    } else if (code === 'auth/invalid-email') {
      showAuthError('Please enter a valid email address.');
    } else {
      showAuthError('Signup failed: ' + e.message.replace('Firebase: ', ''));
    }
  } finally {
    btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
    btn.disabled  = false;
  }
}

// Resend verification
async function resendVerification(email, encodedPassword) {
  try {
    const password = decodeURIComponent(encodedPassword);
    const cred = await auth.signInWithEmailAndPassword(email, password);
    await cred.user.sendEmailVerification();
    await auth.signOut();
    showAuthSuccess('📧 Verification email resent to ' + email + '! Check your inbox.');
  } catch(e) {
    showAuthError('Could not resend: ' + e.message.replace('Firebase: ', ''));
  }
}

// Forgot password from signup tab
async function forgotPasswordDirect(email) {
  try {
    await auth.sendPasswordResetEmail(email);
    showAuthSuccess('📧 Password reset email sent to ' + email + '!');
    switchAuthTab('login');
  } catch(e) {
    showAuthError('Error: ' + e.message.replace('Firebase: ', ''));
  }
}

// ===== LOGOUT =====
async function logoutUser() {
  await auth.signOut();
}

// ===== UPDATE UI AFTER AUTH =====
function updateAuthUI(user) {
  currentUser = user;
  const profileBtn       = document.getElementById('profileBtn');
  const sidebarUserInfo  = document.getElementById('sidebarUserInfo');
  const sidebarLoginBtn  = document.getElementById('sidebarLoginBtn');
  const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');
  const adminSection     = document.getElementById('adminSidebarSection');

  if (user) {
    const initial = (user.displayName || user.email || 'U')[0].toUpperCase();
    // Check for avatar
    if (user.photoURL) {
      profileBtn.innerHTML = `
        <img src="${user.photoURL}"
          style="width:32px;height:32px;border-radius:50%;object-fit:cover"
          onerror="this.parentElement.textContent='${initial}'"/>`;
    } else {
      profileBtn.innerHTML = '';
      profileBtn.textContent = initial;
    }
    profileBtn.style.fontWeight = '700';
    profileBtn.style.fontSize   = '15px';

    sidebarUserInfo.style.display = 'block';
    document.getElementById('sidebarAvatar').textContent = initial;
    document.getElementById('sidebarName').textContent   = user.displayName || 'User';
    document.getElementById('sidebarEmail').textContent  = user.email;
    sidebarLoginBtn.style.display  = 'none';
    sidebarLogoutBtn.style.display = 'flex';

    if (sessionStorage.getItem('av_admin') === '1') {
      adminSection.style.display = 'block';
    }
  } else {
    profileBtn.innerHTML        = '<i class="fas fa-user"></i>';
    profileBtn.style.fontWeight = '';
    profileBtn.style.fontSize   = '';
    sidebarUserInfo.style.display  = 'none';
    sidebarLoginBtn.style.display  = 'flex';
    sidebarLogoutBtn.style.display = 'none';
    adminSection.style.display     = 'none';
  }
}

// ===== MY LIST =====
function getMyListLocal() {
  try { return JSON.parse(localStorage.getItem('av_mylist') || '[]'); }
  catch { return []; }
}
async function getMyList() {
  if (currentUser) {
    try {
      const doc = await db.collection('users').doc(currentUser.uid).get();
      return doc.exists ? (doc.data().watchlist || []) : [];
    } catch { return getMyListLocal(); }
  }
  return getMyListLocal();
}
async function toggleMyList(id, btnEl) {
  id = String(id);

  if (currentUser) {
    try {
      const ref = db.collection('users').doc(currentUser.uid);
      const doc = await ref.get();

      let list = doc.exists ? (doc.data().watchlist || []).map(String) : [];

      if (list.includes(id)) {
        list = list.filter(x => x !== id);
        if (btnEl) btnEl.classList.remove('saved');
      } else {
        list.push(id);
        if (btnEl) btnEl.classList.add('saved');
      }

      // Use SET with merge — works even if doc doesn't exist
      await ref.set({ watchlist: list }, { merge: true });

    } catch(e) {
      console.error('Watchlist error:', e);
      // Fallback to localStorage
      let list = getMyListLocal().map(String);
      if (list.includes(id)) {
        list = list.filter(x => x !== id);
        if (btnEl) btnEl.classList.remove('saved');
      } else {
        list.push(id);
        if (btnEl) btnEl.classList.add('saved');
      }
      localStorage.setItem('av_mylist', JSON.stringify(list));
    }
  } else {
    let list = getMyListLocal().map(String);
    if (list.includes(id)) {
      list = list.filter(x => x !== id);
      if (btnEl) btnEl.classList.remove('saved');
    } else {
      list.push(id);
      if (btnEl) btnEl.classList.add('saved');
    }
    localStorage.setItem('av_mylist', JSON.stringify(list));
  }
}

async function showMyList() {
  document.getElementById('homeSections').classList.add('hidden');
  document.getElementById('searchSection').classList.add('hidden');
  document.getElementById('categorySection').classList.add('hidden');
  document.getElementById('myListSection').classList.remove('hidden');
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));

  const list  = await getMyList();
  const grid  = document.getElementById('myListGrid');
  const empty = document.getElementById('myListEmpty');
  grid.innerHTML = '';

  if (list.length === 0) {
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    list.forEach(id => {
      const a = allAnimeCache.find(x => x.firestoreId === id || String(x.id) === id);
      if (a) grid.appendChild(createCard(a));
    });
  }
}

// ===== FILTER CATEGORY =====
function filterCategory(cat, btn) {
  if (btn) {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
  }
  const home      = document.getElementById('homeSections');
  const catSec    = document.getElementById('categorySection');
  const searchSec = document.getElementById('searchSection');
  const myListSec = document.getElementById('myListSection');

  searchSec.classList.add('hidden');
  myListSec.classList.add('hidden');

  if (cat === 'all') {
    home.classList.remove('hidden');
    catSec.classList.add('hidden');
    return;
  }

  home.classList.add('hidden');
  catSec.classList.remove('hidden');

  const labels = { anime:'📺 Anime', movie:'🎬 Movies', series:'📡 Series', news:'📰 News' };
  document.getElementById('categoryTitle').textContent = labels[cat] || cat;

  const grid     = document.getElementById('categoryGrid');
  const filtered = allAnimeCache.filter(a => a.type === cat);
  grid.innerHTML = '';
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1">
      <div class="empty-state" style="min-height:40vh">
        <i class="fas fa-folder-open"></i>
        <h2>No content yet</h2>
        <p>Nothing in this category.</p>
      </div></div>`;
  } else {
    filtered.forEach(a => grid.appendChild(createCard(a)));
  }
}

// ===== CREATE CARD =====
function createCard(anime, isTop10 = false) {
  const myList  = getMyListLocal().map(String);
  const cardId  = anime.firestoreId || String(anime.id);
  const isSaved = myList.includes(cardId);

  const card = document.createElement('div');
  card.className = isTop10 ? 'card card-top10' : 'card';

  const typeLabel = (anime.type || 'ANIME').toUpperCase();
  const genres    = (anime.genre || []).slice(0, 2);
  const tagHTML   = genres.map(g => `<span class="card-tag">${g}</span>`).join('');
  const rankHTML  = isTop10 && anime.top10rank
    ? `<div class="rank-badge">${anime.top10rank}</div>` : '';

  card.innerHTML = `
    <div style="position:relative">
      <img class="card-thumb" src="${anime.thumbnail || ''}" alt="${anime.title}"
        onerror="this.style.background='var(--bg3)'"/>
      ${rankHTML}
      <button class="card-heart ${isSaved ? 'saved' : ''}"
        onclick="event.stopPropagation(); toggleMyList('${cardId}', this)">
        <i class="fas fa-heart"></i>
      </button>
    </div>
    <div class="card-info">
      <span class="card-badge">${typeLabel}</span>
      <div class="card-title">${anime.title}</div>
      <div class="card-meta">
        <span class="card-rating"><i class="fas fa-star"></i> ${anime.rating || 'N/A'}</span>
        <span class="card-year">${anime.year || ''}</span>
      </div>
      <div class="card-tags">${tagHTML}</div>
    </div>
  `;
  card.addEventListener('click', () => {
    window.location.href = `anime.html?id=${cardId}`;
  });
  return card;
}

// ===== SCROLL =====
function scrollTrending() {
  const el = document.getElementById('trendingAnchor');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ===== LOAD FROM FIREBASE =====
async function loadAnimeFromFirebase() {
  try {
    const snapshot = await db.collection('anime').orderBy('createdAt', 'desc').get();
    const data = [];
    snapshot.forEach(doc => {
      data.push({ ...doc.data(), firestoreId: doc.id });
    });
    return data;
  } catch(e) {
    console.error('Firebase load error:', e);
    return [];
  }
}

// ===== RENDER HOME =====
async function renderHome() {
  const loadingEl   = document.getElementById('loadingState');
  const emptyEl     = document.getElementById('emptyState');
  const top10Sec    = document.getElementById('top10Section');
  const latestSec   = document.getElementById('latestSection');
  const trendingSec = document.getElementById('trendingSection');

  loadingEl.classList.remove('hidden');
  emptyEl.classList.add('hidden');
  top10Sec.classList.add('hidden');
  latestSec.classList.add('hidden');
  trendingSec.classList.add('hidden');

  allAnimeCache = await loadAnimeFromFirebase();
  loadingEl.classList.add('hidden');

  if (allAnimeCache.length === 0) {
    emptyEl.classList.remove('hidden');
    return;
  }

  emptyEl.classList.add('hidden');

  // Top 10
  const top10 = allAnimeCache.filter(a => a.top10)
    .sort((a, b) => (a.top10rank||99) - (b.top10rank||99));
  if (top10.length > 0) {
    top10Sec.classList.remove('hidden');
    const g = document.getElementById('top10Grid');
    g.innerHTML = '';
    top10.forEach(a => g.appendChild(createCard(a, true)));
  }

  // Latest
  const latest = allAnimeCache.filter(a => a.latest);
  if (latest.length > 0) {
    latestSec.classList.remove('hidden');
    const g = document.getElementById('latestGrid');
    g.innerHTML = '';
    latest.forEach(a => g.appendChild(createCard(a)));
  }

  // Trending
  const trending = allAnimeCache.filter(a => a.trending);
  if (trending.length > 0) {
    trendingSec.classList.remove('hidden');
    const g = document.getElementById('trendingGrid');
    g.innerHTML = '';
    trending.forEach(a => g.appendChild(createCard(a)));
  }

  // If nothing is tagged — show all
  if (top10.length === 0 && latest.length === 0 && trending.length === 0) {
    trendingSec.classList.remove('hidden');
    const g = document.getElementById('trendingGrid');
    g.innerHTML = '';
    allAnimeCache.forEach(a => g.appendChild(createCard(a)));
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();

  auth.onAuthStateChanged(user => {
    updateAuthUI(user);
  });

  renderHome();

  // Close modal on overlay click
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) closeAuthModal();
    });
  }
});
