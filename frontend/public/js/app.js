const STORAGE_KEY = 'electrode_db';
let db = loadData();
let editingId = null;

const filterState = {
  search: '',
  category: 'all',
  conductivity: 'all',
  workpiece: null,
  sort: 'default',
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.warn('localStorage读取失败，使用默认数据', e); }
  saveData(ELECTRODES);
  return [...ELECTRODES];
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch (e) { console.error('localStorage写入失败', e); }
}

function getCondStyle(conductivity) {
  if (conductivity === null || conductivity === undefined)
    return { color: 'var(--text-muted)', start: '#3a4555', end: '#4d5f78' };
  if (conductivity >= 70) return { color: 'var(--cond-high)', start: '#1a6b30', end: '#2ea043' };
  if (conductivity >= 40) return { color: 'var(--cond-mid)', start: '#9e6a00', end: '#e6a817' };
  return { color: 'var(--cond-low)', start: '#8b3a00', end: '#d97a1a' };
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateId(name) { return 'custom_' + name.replace(/\s+/g, '_') + '_' + Date.now(); }

function parseCommaSeparated(str) {
  if (!str || !str.trim()) return [];
  return str.split(/[,，]/).map(s => s.trim()).filter(Boolean);
}

let toastTimer = null;
function showToast(msg, type) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast ' + (type || 'info') + ' show';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

function applyFilters() {
  let results = [...db];
  if (filterState.search) {
    const q = filterState.search.toLowerCase();
    results = results.filter(e =>
      (e.name || '').toLowerCase().includes(q) ||
      (e.nameAlt || '').toLowerCase().includes(q) ||
      (e.formula || '').toLowerCase().includes(q) ||
      (e.features || '').toLowerCase().includes(q) ||
      (e.suitableForDisplay || '').toLowerCase().includes(q) ||
      (e.grades || []).some(g => g.toLowerCase().includes(q))
    );
  }
  if (filterState.category !== 'all') results = results.filter(e => e.category === filterState.category);
  if (filterState.conductivity !== 'all') {
    results = results.filter(e => {
      const c = e.conductivity;
      if (c == null) return false;
      if (filterState.conductivity === 'high') return c >= 70;
      if (filterState.conductivity === 'mid') return c >= 40 && c < 70;
      if (filterState.conductivity === 'low') return c < 40;
      return true;
    });
  }
  if (filterState.workpiece) results = results.filter(e => (e.suitableFor || []).includes(filterState.workpiece));
  if (filterState.sort === 'cond-desc') results.sort((a, b) => (b.conductivity ?? -1) - (a.conductivity ?? -1));
  else if (filterState.sort === 'cond-asc') results.sort((a, b) => (a.conductivity ?? 999) - (b.conductivity ?? 999));
  else if (filterState.sort === 'temp-desc') results.sort((a, b) => (b.softeningTemp ?? -1) - (a.softeningTemp ?? -1));
  return results;
}

function renderCards() {
  const grid = document.getElementById('cardGrid');
  const results = applyFilters();
  document.getElementById('resultCount').innerHTML = '显示 <em>' + results.length + '</em> / ' + db.length + ' 种材料';
  document.getElementById('totalCount').textContent = db.length;
  updateFilterCounts();
  if (results.length === 0) {
    grid.innerHTML = '<div class="no-result"><div class="icon">🔍</div><p>没有找到匹配的电极材料</p><p style="font-size:0.73rem;margin-top:6px;color:var(--text-muted)">尝试修改筛选条件或重置</p></div>';
    return;
  }
  grid.innerHTML = results.map((e, i) => buildCard(e, i)).join('');
}

function buildCard(e, i) {
  const cond = getCondStyle(e.conductivity);
  const condPct = e.conductivity != null ? Math.min(e.conductivity, 100) : 0;
  const isCustom = (e.id || '').startsWith('custom_');
  const metricsHtml = [
    e.softeningTempDisplay ? '<div class="metric-chip"><span class="metric-chip-label">软化温度</span><span class="metric-chip-value temp">' + escapeHtml(e.softeningTempDisplay) + '</span></div>' : '',
    e.hardness ? '<div class="metric-chip"><span class="metric-chip-label">硬度</span><span class="metric-chip-value hard">' + escapeHtml(e.hardness) + '</span></div>' : '',
  ].filter(Boolean).join('');
  const suitableHtml = (e.suitableFor && e.suitableFor.length > 0)
    ? e.suitableFor.map(t => '<span class="suitable-tag">' + escapeHtml(t) + '</span>').join('')
    : '<span class="suitable-empty">—</span>';
  const gradesHtml = (e.grades && e.grades.length > 0)
    ? '<div class="card-grades">' + e.grades.map(g => '<span class="grade-chip">' + escapeHtml(g) + '</span>').join('') + '</div>'
    : '';
  return '<div class="material-card" data-category="' + escapeHtml(e.category) + '" data-id="' + escapeHtml(e.id) + '" style="animation-delay:' + (i * 35) + 'ms" onclick="openDetailModal(\'' + escapeHtml(e.id) + '\')">'
    + '<div class="card-actions">'
    + '<button class="card-action-btn card-action-btn--edit" title="编辑此材料" onclick="openEditModal(event, \'' + escapeHtml(e.id) + '\')">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>'
    + '<button class="card-action-btn card-action-btn--delete" title="删除此材料" onclick="deleteCard(event, \'' + escapeHtml(e.id) + '\')">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button></div>'
    + (isCustom ? '<span class="card-custom-badge">自定义</span>' : '')
    + '<div class="card-header"><div><div class="card-name">' + escapeHtml(e.name) + (e.nameAlt ? '<span class="card-name-alt">(' + escapeHtml(e.nameAlt) + ')</span>' : '') + '</div><div class="card-formula">' + escapeHtml(e.formula) + '</div></div><span class="card-category-badge">' + escapeHtml(e.category) + '</span></div>'
    + '<div class="cond-bar-section"><div class="cond-bar-label"><span>导电率</span><span class="cond-bar-value" style="--cond-color:' + cond.color + '">' + escapeHtml(e.conductivityDisplay || '—') + '</span></div><div class="cond-bar-track"><div class="cond-bar-fill" style="width:' + condPct + '%;--cond-color-start:' + cond.start + ';--cond-color-end:' + cond.end + '"></div></div></div>'
    + (metricsHtml ? '<div class="card-metrics">' + metricsHtml + '</div>' : '')
    + '<div class="suitable-tags">' + suitableHtml + '</div>'
    + '<div class="card-features">' + escapeHtml(e.features || '暂无描述') + '</div>'
    + gradesHtml + '</div>';
}

function deleteCard(event, id) {
  event.stopPropagation();
  const item = db.find(e => e.id === id);
  if (!item) return;
  if (!confirm('确认删除「' + item.name + '」？\n\n此操作不可撤销。')) return;
  db = db.filter(e => e.id !== id);
  saveData(db);
  refreshWorkpieceTags();
  renderCards();
  showToast('已删除「' + item.name + '」', 'info');
}

function openDetailModal(id) {
  const e = db.find(m => m.id === id);
  if (!e) return;
  const cond = getCondStyle(e.conductivity);
  const metricsHtml = '<div class="modal-metrics-grid">'
    + '<div class="modal-metric"><div class="modal-metric-label">导电率</div><div class="modal-metric-value" style="color:' + cond.color + '">' + escapeHtml(e.conductivityDisplay || '—') + '</div></div>'
    + '<div class="modal-metric"><div class="modal-metric-label">软化温度</div><div class="modal-metric-value" style="color:var(--accent-gold)">' + escapeHtml(e.softeningTempDisplay || '—') + '</div></div>'
    + '<div class="modal-metric"><div class="modal-metric-label">硬度</div><div class="modal-metric-value" style="color:var(--accent-cyan)">' + escapeHtml(e.hardness || '—') + '</div></div>'
    + (e.strength ? '<div class="modal-metric" style="grid-column:1/-1"><div class="modal-metric-label">抗拉强度</div><div class="modal-metric-value" style="color:var(--accent-orange)">≥' + e.strength + ' MPa</div></div>' : '')
    + '</div>';
  const prosHtml = (e.pros && e.pros.length > 0) ? '<div class="modal-section"><div class="modal-section-title">优点</div><ul class="modal-list modal-list--pros">' + e.pros.map(p => '<li>' + escapeHtml(p) + '</li>').join('') + '</ul></div>' : '';
  const consHtml = (e.cons && e.cons.length > 0) ? '<div class="modal-section"><div class="modal-section-title">局限性</div><ul class="modal-list modal-list--cons">' + e.cons.map(c => '<li>' + escapeHtml(c) + '</li>').join('') + '</ul></div>' : '';
  const partsHtml = (e.typicalParts && e.typicalParts.length > 0) ? '<div class="modal-section"><div class="modal-section-title">典型电极零件</div><div class="modal-suitable">' + e.typicalParts.map(p => '<span class="modal-tag" style="background:rgba(230,168,23,0.08);border-color:rgba(230,168,23,0.25);color:var(--accent-gold)">' + escapeHtml(p) + '</span>').join('') + '</div></div>' : '';
  const gradesHtml = (e.grades && e.grades.length > 0) ? '<div class="modal-section"><div class="modal-section-title">常用牌号</div><div class="modal-grades-list">' + e.grades.map(g => '<span class="grade-chip" style="font-size:0.78rem;padding:3px 9px">' + escapeHtml(g) + '</span>').join('') + '</div></div>' : '';
  document.getElementById('detailContent').innerHTML = '<div class="modal-header"><div class="modal-title-group"><div class="modal-name">' + escapeHtml(e.name) + (e.nameAlt ? '<span style="font-size:0.85rem;color:var(--text-muted);font-weight:400"> · ' + escapeHtml(e.nameAlt) + '</span>' : '') + '</div><div class="modal-formula">' + escapeHtml(e.formula) + '</div><div style="margin-top:6px"><span class="card-category-badge" style="display:inline-block">' + escapeHtml(e.category) + '</span></div></div><button class="modal-close" onclick="closeModal(\'detailOverlay\')">✕</button></div>'
    + '<div class="modal-section"><div class="modal-section-title">主要技术参数</div>' + metricsHtml + '</div>'
    + (e.description ? '<div class="modal-section"><div class="modal-section-title">材料介绍</div><p class="modal-text">' + escapeHtml(e.description) + '</p></div>' : '<div class="modal-section"><div class="modal-section-title">材料特点</div><p class="modal-text">' + escapeHtml(e.features || '暂无描述') + '</p></div>')
    + prosHtml + consHtml
    + '<div class="modal-section"><div class="modal-section-title">适用工件材质</div>' + (e.suitableFor && e.suitableFor.length > 0 ? '<div class="modal-suitable" style="margin-bottom:8px">' + e.suitableFor.map(t => '<span class="modal-tag">' + escapeHtml(t) + '</span>').join('') + '</div>' : '') + '<p class="modal-text" style="font-size:0.8rem">' + escapeHtml(e.suitableForDisplay || '—') + '</p></div>'
    + partsHtml + gradesHtml;
  const overlay = document.getElementById('detailOverlay');
  overlay.querySelector('.modal').setAttribute('data-category', e.category);
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(overlayId) {
  document.getElementById(overlayId).classList.remove('active');
  document.body.style.overflow = '';
}

function readFormFields() {
  const conductivityRaw = document.getElementById('f-conductivity').value;
  const conductivity = conductivityRaw !== '' ? parseFloat(conductivityRaw) : null;
  const tempRaw = document.getElementById('f-temp').value;
  const softeningTemp = tempRaw !== '' ? parseFloat(tempRaw) : null;
  let conductivityDisplay = document.getElementById('f-condDisplay').value.trim();
  if (!conductivityDisplay && conductivity != null) conductivityDisplay = conductivity + '% IACS';
  let softeningTempDisplay = document.getElementById('f-tempDisplay').value.trim();
  if (!softeningTempDisplay && softeningTemp != null) softeningTempDisplay = softeningTemp + '°C';
  return {
    name: document.getElementById('f-name').value.trim(),
    nameAlt: document.getElementById('f-nameAlt').value.trim() || undefined,
    formula: document.getElementById('f-formula').value.trim(),
    category: document.getElementById('f-category').value,
    conductivity,
    conductivityDisplay: conductivityDisplay || null,
    softeningTemp,
    softeningTempDisplay: softeningTempDisplay || null,
    hardness: document.getElementById('f-hardness').value.trim() || null,
    grades: parseCommaSeparated(document.getElementById('f-grades').value),
    features: document.getElementById('f-features').value.trim() || '',
    suitableFor: parseCommaSeparated(document.getElementById('f-suitableFor').value),
    suitableForDisplay: document.getElementById('f-suitableDisplay').value.trim() || '—',
  };
}

function openAddModal() {
  editingId = null;
  document.getElementById('addForm').reset();
  document.getElementById('addModalTitle').textContent = '添加新材料';
  document.getElementById('addModalDesc').textContent = '填写电极材料基本信息';
  document.getElementById('addSubmitBtn').textContent = '保存材料';
  document.getElementById('addOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('f-name').focus(), 100);
}

function openEditModal(event, id) {
  event.stopPropagation();
  const item = db.find(e => e.id === id);
  if (!item) return;
  editingId = id;
  document.getElementById('f-name').value = item.name || '';
  document.getElementById('f-nameAlt').value = item.nameAlt || '';
  document.getElementById('f-formula').value = item.formula || '';
  document.getElementById('f-category').value = item.category || '';
  document.getElementById('f-conductivity').value = item.conductivity ?? '';
  document.getElementById('f-condDisplay').value = item.conductivityDisplay || '';
  document.getElementById('f-temp').value = item.softeningTemp ?? '';
  document.getElementById('f-tempDisplay').value = item.softeningTempDisplay || '';
  document.getElementById('f-hardness').value = item.hardness || '';
  document.getElementById('f-grades').value = (item.grades || []).join(', ');
  document.getElementById('f-features').value = item.features || '';
  document.getElementById('f-suitableFor').value = (item.suitableFor || []).join(', ');
  document.getElementById('f-suitableDisplay').value = item.suitableForDisplay || '';
  document.getElementById('addModalTitle').textContent = '编辑材料 · ' + item.name;
  document.getElementById('addModalDesc').textContent = '修改后点击保存';
  document.getElementById('addSubmitBtn').textContent = '保存修改';
  document.getElementById('addOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('f-name').focus(), 100);
}

function closeAddModal() { editingId = null; closeModal('addOverlay'); }

function submitAddForm(event) {
  event.preventDefault();
  const fields = readFormFields();
  if (!fields.name || !fields.formula || !fields.category) {
    showToast('请填写必填项（名称、成分、类别）', 'error');
    return;
  }
  if (editingId) {
    const idx = db.findIndex(e => e.id === editingId);
    if (idx === -1) { showToast('未找到材料记录', 'error'); return; }
    db[idx] = { ...db[idx], ...fields };
    saveData(db);
    closeAddModal();
    refreshWorkpieceTags();
    renderCards();
    showToast('已更新「' + fields.name + '」', 'success');
  } else {
    const newItem = { id: generateId(fields.name), ...fields };
    db.push(newItem);
    saveData(db);
    closeAddModal();
    refreshWorkpieceTags();
    renderCards();
    showToast('已添加「' + fields.name + '」', 'success');
  }
}

function getAllWorkpieceTags() {
  const set = new Set();
  db.forEach(e => (e.suitableFor || []).forEach(t => set.add(t)));
  return [...set].sort();
}

function countBy(field, value) { return value === 'all' ? db.length : db.filter(e => e[field] === value).length; }

function countByCond(range) {
  return db.filter(e => {
    const c = e.conductivity;
    if (range === 'all') return true;
    if (c == null) return false;
    if (range === 'high') return c >= 70;
    if (range === 'mid') return c >= 40 && c < 70;
    if (range === 'low') return c < 40;
    return true;
  }).length;
}

function countByWorkpiece(tag) { return db.filter(e => (e.suitableFor || []).includes(tag)).length; }

function updateFilterCounts() {
  document.querySelectorAll('#categoryFilters .filter-pill').forEach(btn => {
    const countEl = btn.querySelector('.pill-count');
    if (countEl) countEl.textContent = countBy('category', btn.dataset.value);
  });
  document.querySelectorAll('#condFilters .filter-pill').forEach(btn => {
    const countEl = btn.querySelector('.pill-count');
    if (countEl) countEl.textContent = countByCond(btn.dataset.value);
  });
}

function initCategoryFilter() {
  const items = [
    { value: 'all', label: '全部' },
    { value: '铜合金', label: '铜合金系' },
    { value: '难熔金属', label: '难熔金属系' },
    { value: '铜难熔复合', label: '铜难熔复合系' },
  ];
  document.getElementById('categoryFilters').innerHTML = items.map(c =>
    '<button class="filter-pill ' + (c.value === 'all' ? 'active' : '') + '" data-filter="category" data-value="' + c.value + '">'
    + c.label + '<span class="pill-count">' + countBy('category', c.value) + '</span></button>'
  ).join('');
}

function initCondFilter() {
  const items = [
    { value: 'all', label: '全部' },
    { value: 'high', label: '高 ≥70%' },
    { value: 'mid', label: '中 40~70%' },
    { value: 'low', label: '低 <40%' },
  ];
  document.getElementById('condFilters').innerHTML = items.map(c =>
    '<button class="filter-pill ' + (c.value === 'all' ? 'active' : '') + '" data-filter="conductivity" data-value="' + c.value + '">'
    + c.label + '<span class="pill-count">' + countByCond(c.value) + '</span></button>'
  ).join('');
}

function refreshWorkpieceTags() {
  const container = document.getElementById('workpieceTags');
  const tags = getAllWorkpieceTags();
  const activeTag = filterState.workpiece;
  container.innerHTML = tags.map(t =>
    '<button class="tag-btn ' + (activeTag === t ? 'active' : '') + '" data-tag="' + escapeHtml(t) + '">'
    + escapeHtml(t) + '<span style="font-size:0.62rem;opacity:0.6;margin-left:2px">' + countByWorkpiece(t) + '</span></button>'
  ).join('');
}

function bindFilterEvents() {
  document.querySelector('.filter-bar').addEventListener('click', e => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    const filter = btn.dataset.filter;
    const value = btn.dataset.value;
    filterState[filter] = value;
    document.querySelectorAll('[data-filter="' + filter + '"]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCards();
  });
  document.getElementById('workpieceTags').addEventListener('click', e => {
    const btn = e.target.closest('.tag-btn');
    if (!btn) return;
    const tag = btn.dataset.tag;
    filterState.workpiece = (filterState.workpiece === tag) ? null : tag;
    refreshWorkpieceTags();
    renderCards();
  });
  document.querySelector('.sort-group').addEventListener('click', e => {
    const btn = e.target.closest('[data-sort]');
    if (!btn) return;
    filterState.sort = btn.dataset.sort;
    document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCards();
  });
  let debounce;
  document.getElementById('searchInput').addEventListener('input', e => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { filterState.search = e.target.value.trim(); renderCards(); }, 200);
  });
}

function resetFilters() {
  filterState.search = '';
  filterState.category = 'all';
  filterState.conductivity = 'all';
  filterState.workpiece = null;
  filterState.sort = 'default';
  document.getElementById('searchInput').value = '';
  document.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('active', b.dataset.value === 'all'));
  document.querySelectorAll('[data-sort]').forEach(b => b.classList.toggle('active', b.dataset.sort === 'default'));
  refreshWorkpieceTags();
  renderCards();
}

document.addEventListener('DOMContentLoaded', () => {
  initCategoryFilter();
  initCondFilter();
  refreshWorkpieceTags();
  bindFilterEvents();
  renderCards();
  ['detailOverlay', 'addOverlay'].forEach(id => {
    document.getElementById(id).addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(id); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') ['detailOverlay', 'addOverlay'].forEach(id => closeModal(id));
  });
});