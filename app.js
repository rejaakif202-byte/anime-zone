// ============================================
// ANIME VERSE — Main App Logic (Firebase)
// ============================================

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
  const searchSection  = document.getElementById('searchSection');
  const homeSections   = document.getElementById('homeSections');
  const myListSection  = document.getElementById('myListSection');
  const categorySection= document.getElementById('categorySection');

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
    // Already logged in — show logout option
    if (confirm(`Logged in as ${currentUser.displayName || currentUser.email}\n\nDo you want to logout?`)) {
      logoutUser();
    }
    return;
  }
  document.getElementById('authModal').classList.remove('hidden');
  document.getElementById('authError').style.display   = 'none';
  document.getElementById('authSuccess').style.display = 'none';
}
function closeAuthModal() {
  document.getElementById('authModal').classList.add('hidden');
}
function switchAuthTab(tab) {
  document.getElementById('loginForm').style.display  = tab === 'login'  ? 'block' : 'none';
  document.getElementById('signupForm').style.display = tab === 'signup' ? 'block' : 'none';
  document.getElementById('loginTab').classList.toggle('active',  tab === 'login');
  document.getElementById('signupTab').classList.toggle('active', tab === 'signup');
  document.getElementById('authError').style.display   = 'none';
  document.getElementById('authSuccess').style.display = 'none';
}

function showAuthError(msg) {
  const el = document.getElementById('authError');
  el.textContent = msg;
  el.style.display = 'block';
  document.getElementById('authSuccess').style.display = 'none';
}
function showAuthSuccess(msg) {
  const el = document.getElementById('authSuccess');
  el.textContent = msg;
  el.style.display = 'block';
  document.getElementById('authError').style.display = 'none';
}

async function loginUser() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!email || !password) { showAuthError('Please fill all fields.'); return; }
  try {
    await auth.signInWithEmailAndPassword(email, password);
    showAuthSuccess('Logged in successfully!');
    setTimeout(closeAuthModal, 1000);
  } catch(e) {
    showAuthError(e.message.replace('Firebase: ', ''));
  }
}

async function signupUser() {
  const name     = document.getElementById('signupName').value.trim();
  const email    = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  if (!name || !email || !password) { showAuthError('Please fill all fields.'); return; }
  if (password.length < 6) { showAuthError('Password must be at least 6 characters.'); return; }
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: name });
    await db.collection('users').doc(cred.user.uid).set({
      name, email, createdAt: firebase.firestore.FieldValue.serverTimestamp(), watchlist: []
    });
    showAuthSuccess('Account created! Welcome to Anime Verse!');
    setTimeout(closeAuthModal, 1200);
  } catch(e) {
    showAuthError(e.message.replace('Firebase: ', ''));
  }
}

async function logoutUser() {
  await auth.signOut();
}

// ===== UPDATE UI AFTER AUTH =====
function updateAuthUI(user) {
  currentUser = user;
  const profileBtn  = document.getElementById('profileBtn');
  const profileIcon = document.getElementById('profileIcon');
  const sidebarUserInfo  = document.getElementById('sidebarUserInfo');
  const sidebarLoginBtn  = document.getElementById('sidebarLoginBtn');
  const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');
  const adminSection     = document.getElementById('adminSidebarSection');

  if (user) {
    const initial = (user.displayName || user.email || 'U')[0].toUpperCase();
    profileIcon.className = '';
    profileBtn.textContent = initial;
    profileBtn.style.fontWeight = '700';
    profileBtn.style.fontSize   = '15px';

    sidebarUserInfo.style.display = 'block';
    document.getElementById('sidebarAvatar').textContent = initial;
    document.getElementById('sidebarName').textContent   = user.displayName || 'User';
    document.getElementById('sidebarEmail').textContent  = user.email;
    sidebarLoginBtn.style.display  = 'none';
    sidebarLogoutBtn.style.display = 'flex';

    // Show admin link only for admin session
    if (sessionStorage.getItem('av_admin') === '1') {
      adminSection.style.display = 'block';
    }
  } else {
    profileBtn.innerHTML = '<i class="fas fa-user"></i>';
    profileBtn.style.fontWeight = '';
    profileBtn.style.fontSize   = '';

    sidebarUserInfo.style.display  = 'none';
    sidebarLoginBtn.style.display  = 'flex';
    sidebarLogoutBtn.style.display = 'none';
    adminSection.style.display     = 'none';
  }
}

// ===== MY LIST (Firestore-backed when logged in, localStorage fallback) =====
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
  id = parseInt(id);
  if (currentUser) {
    try {
      const ref  = db.collection('users').doc(currentUser.uid);
      const doc  = await ref.get();
      let list   = doc.exists ? (doc.data().watchlist || []) : [];
      if (list.includes(id)) {
        list = list.filter(x => x !== id);
        if (btnEl) btnEl.classList.remove('saved');
      } else {
        list.push(id);
        if (btnEl) btnEl.classList.add('saved');
      }
      await ref.update({ watchlist: list });
    } catch(e) { console.error(e); }
  } else {
    let list = getMyListLocal();
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
      const a = allAnimeCache.find(x => x.id === id || x.firestoreId === id);
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
  const home     = document.getElementById('homeSections');
  const catSec   = document.getElementById('categorySection');
  const searchSec= document.getElementById('searchSection');
  const myListSec= document.getElementById('myListSection');

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
        <p>Nothing in this category yet.</p>
      </div></div>`;
  } else {
    filtered.forEach(a => grid.appendChild(createCard(a)));
  }
}

// ===== CREATE CARD =====
function createCard(anime, isTop10 = false) {
  const myList  = getMyListLocal();
  const isSaved = myList.includes(anime.id) || myList.includes(anime.firestoreId);
  const cardId  = anime.firestoreId || anime.id;

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
    console.error('Firebase error:', e);
    return [];
  }
}

// ===== RENDER HOME =====
async function renderHome() {
  const loadingEl = document.getElementById('loadingState');
  const emptyEl   = document.getElementById('emptyState');

  loadingEl.classList.remove('hidden');
  emptyEl.classList.add('hidden');

  allAnimeCache = await loadAnimeFromFirebase();

  loadingEl.classList.add('hidden');

  const top10Sec    = document.getElementById('top10Section');
  const latestSec   = document.getElementById('latestSection');
  const trendingSec = document.getElementById('trendingSection');

  if (allAnimeCache.length === 0) {
    emptyEl.classList.remove('hidden');
    top10Sec.classList.add('hidden');
    latestSec.classList.add('hidden');
    trendingSec.classList.add('hidden');
    return;
  }

  emptyEl.classList.add('hidden');

  // Top 10
  const top10 = allAnimeCache.filter(a => a.top10)
    .sort((a, b) => (a.top10rank || 99) - (b.top10rank || 99));
  if (top10.length > 0) {
    top10Sec.classList.remove('hidden');
    const g = document.getElementById('top10Grid');
    g.innerHTML = '';
    top10.forEach(a => g.appendChild(createCard(a, true)));
  } else { top10Sec.classList.add('hidden'); }

  // Latest
  const latest = allAnimeCache.filter(a => a.latest);
  if (latest.length > 0) {
    latestSec.classList.remove('hidden');
    const g = document.getElementById('latestGrid');
    g.innerHTML = '';
    latest.forEach(a => g.appendChild(createCard(a)));
  } else { latestSec.classList.add('hidden'); }

  // Trending
  const trending = allAnimeCache.filter(a => a.trending);
  if (trending.length > 0) {
    trendingSec.classList.remove('hidden');
    const g = document.getElementById('trendingGrid');
    g.innerHTML = '';
    trending.forEach(a => g.appendChild(createCard(a)));
  } else { trendingSec.classList.add('hidden'); }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();

  // Auth state listener
  auth.onAuthStateChanged(user => {
    updateAuthUI(user);
  });

  renderHome();

  // Close modal on overlay click
  document.getElementById('authModal').addEventListener('click', function(e) {
    if (e.target === this) closeAuthModal();
  });

  // Enter key for auth forms
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const loginForm = document.getElementById('loginForm');
      if (loginForm && loginForm.style.display !== 'none') loginUser();
    }
  });
});
