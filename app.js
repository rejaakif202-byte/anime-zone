// ============================================
// ANIME VERSE — Main App Logic
// ============================================

// ===== THEME =====
function toggleTheme() {
  const html = document.documentElement;
  const btn = document.getElementById('themeBtn');
  if (html.getAttribute('data-theme') === 'dark') {
    html.setAttribute('data-theme', 'light');
    btn.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('av_theme', 'light');
  } else {
    html.setAttribute('data-theme', 'dark');
    btn.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem('av_theme', 'dark');
  }
}

function loadTheme() {
  const saved = localStorage.getItem('av_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeBtn');
  if (btn) {
    btn.innerHTML = saved === 'dark'
      ? '<i class="fas fa-moon"></i>'
      : '<i class="fas fa-sun"></i>';
  }
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
  const searchSection = document.getElementById('searchSection');
  const homeSections = document.getElementById('homeSections');
  const myListSection = document.getElementById('myListSection');
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

  const all = getAllAnime();
  const results = all.filter(a =>
    a.title.toLowerCase().includes(q) ||
    (a.genre && a.genre.join(' ').toLowerCase().includes(q)) ||
    (a.type && a.type.toLowerCase().includes(q))
  );

  const grid = document.getElementById('searchGrid');
  const empty = document.getElementById('searchEmpty');
  grid.innerHTML = '';

  if (results.length === 0) {
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    results.forEach(a => grid.appendChild(createCard(a)));
  }
}

// ===== GET ALL ANIME =====
function getAllAnime() {
  const base = typeof animeData !== 'undefined' ? animeData : [];
  try {
    const extra = JSON.parse(localStorage.getItem('av_anime') || '[]');
    return [...base, ...extra];
  } catch { return base; }
}

// ===== FILTER CATEGORY =====
function filterCategory(cat, btn) {
  if (btn) {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
  }

  const homeSections = document.getElementById('homeSections');
  const categorySection = document.getElementById('categorySection');
  const searchSection = document.getElementById('searchSection');
  const myListSection = document.getElementById('myListSection');

  searchSection.classList.add('hidden');
  myListSection.classList.add('hidden');

  if (cat === 'all') {
    homeSections.classList.remove('hidden');
    categorySection.classList.add('hidden');
    return;
  }

  homeSections.classList.add('hidden');
  categorySection.classList.remove('hidden');

  const title = document.getElementById('categoryTitle');
  const grid = document.getElementById('categoryGrid');
  const labels = { anime: '📺 Anime', movie: '🎬 Movies', series: '📡 Series', news: '📰 News' };
  title.textContent = labels[cat] || cat;
  grid.innerHTML = '';

  const filtered = getAllAnime().filter(a => a.type === cat);
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1">
        <div class="empty-state" style="min-height:40vh">
          <i class="fas fa-folder-open"></i>
          <h2>Koi content nahi</h2>
          <p>Is category mein abhi kuch nahi hai.</p>
        </div>
      </div>`;
  } else {
    filtered.forEach(a => grid.appendChild(createCard(a)));
  }
}

// ===== MY LIST =====
function getMyList() {
  try { return JSON.parse(localStorage.getItem('av_mylist') || '[]'); }
  catch { return []; }
}

function toggleMyList(id, btnEl) {
  id = parseInt(id);
  let list = getMyList();
  if (list.includes(id)) {
    list = list.filter(x => x !== id);
    if (btnEl) { btnEl.classList.remove('saved'); }
  } else {
    list.push(id);
    if (btnEl) { btnEl.classList.add('saved'); }
  }
  localStorage.setItem('av_mylist', JSON.stringify(list));
}

function showMyList() {
  document.getElementById('homeSections').classList.add('hidden');
  document.getElementById('searchSection').classList.add('hidden');
  document.getElementById('categorySection').classList.add('hidden');
  document.getElementById('myListSection').classList.remove('hidden');
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));

  const list = getMyList();
  const grid = document.getElementById('myListGrid');
  const empty = document.getElementById('myListEmpty');
  grid.innerHTML = '';

  if (list.length === 0) {
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    const all = getAllAnime();
    list.forEach(id => {
      const a = all.find(x => x.id === id);
      if (a) grid.appendChild(createCard(a));
    });
  }
}

// ===== CREATE CARD =====
function createCard(anime, isTop10 = false) {
  const myList = getMyList();
  const isSaved = myList.includes(anime.id);

  const card = document.createElement('div');
  card.className = isTop10 ? 'card card-top10' : 'card';

  const typeLabel = anime.type ? anime.type.toUpperCase() : 'ANIME';
  const genres = anime.genre ? anime.genre.slice(0, 2) : [];
  const tagHTML = genres.map(g => `<span class="card-tag">${g}</span>`).join('');
  const rankHTML = isTop10 && anime.top10rank
    ? `<div class="rank-badge">${anime.top10rank}</div>` : '';

  card.innerHTML = `
    <div style="position:relative">
      <img class="card-thumb"
        src="${anime.thumbnail || ''}"
        alt="${anime.title}"
        onerror="this.style.background='var(--bg3)'"/>
      ${rankHTML}
      <button class="card-heart ${isSaved ? 'saved' : ''}"
        onclick="event.stopPropagation(); toggleMyList(${anime.id}, this)">
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
    window.location.href = `anime.html?id=${anime.id}`;
  });

  return card;
}

// ===== SCROLL TO TRENDING =====
function scrollTrending() {
  const el = document.getElementById('trendingAnchor');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ===== RENDER HOME =====
function renderHome() {
  const all = getAllAnime();

  // Agar koi data nahi
  const emptyState = document.getElementById('emptyState');
  const top10Section = document.getElementById('top10Section');
  const latestSection = document.getElementById('latestSection');
  const trendingSection = document.getElementById('trendingSection');

  if (all.length === 0) {
    emptyState.classList.remove('hidden');
    top10Section.classList.add('hidden');
    latestSection.classList.add('hidden');
    trendingSection.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  // Top 10
  const top10 = all.filter(a => a.top10).sort((a, b) => (a.top10rank || 99) - (b.top10rank || 99));
  const top10Grid = document.getElementById('top10Grid');
  if (top10Grid) {
    top10Grid.innerHTML = '';
    if (top10.length > 0) {
      top10Section.classList.remove('hidden');
      top10.forEach(a => top10Grid.appendChild(createCard(a, true)));
    } else {
      top10Section.classList.add('hidden');
    }
  }

  // Latest
  const latest = all.filter(a => a.latest);
  const latestGrid = document.getElementById('latestGrid');
  if (latestGrid) {
    latestGrid.innerHTML = '';
    if (latest.length > 0) {
      latestSection.classList.remove('hidden');
      latest.forEach(a => latestGrid.appendChild(createCard(a)));
    } else {
      latestSection.classList.add('hidden');
    }
  }

  // Trending
  const trending = all.filter(a => a.trending);
  const trendingGrid = document.getElementById('trendingGrid');
  if (trendingGrid) {
    trendingGrid.innerHTML = '';
    if (trending.length > 0) {
      trendingSection.classList.remove('hidden');
      trending.forEach(a => trendingGrid.appendChild(createCard(a)));
    } else {
      trendingSection.classList.add('hidden');
    }
  }
}

// ===== ADMIN LINK IN SIDEBAR =====
function checkAdminSession() {
  const isAdmin = sessionStorage.getItem('av_admin');
  const adminSection = document.getElementById('adminSidebarSection');
  if (adminSection) {
    adminSection.style.display = isAdmin ? 'block' : 'none';
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  renderHome();
  checkAdminSession();
});
