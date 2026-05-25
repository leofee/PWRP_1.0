/* ============================================================
   PRWP Store — LocalStorage Data Layer
   Seeds from static JS data, then persists to LocalStorage
   ============================================================ */

const Store = (() => {
  const PREFIX = 'prwp_v1_';
  const COLLECTIONS = ['materials', 'interfaces', 'failures', 'templates'];

  // Seed data map (from static JS files)
  const SEEDS = {
    materials:  () => MATERIALS_DATA,
    interfaces: () => INTERFACES_DATA,
    failures:   () => FAILURES_DATA,
    templates:  () => TEMPLATES_DATA,
  };

  /* ---- Internal ---- */
  const _key = (col) => `${PREFIX}${col}`;

  const _read = (col) => {
    try {
      const raw = localStorage.getItem(_key(col));
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  };

  const _write = (col, data) => {
    try {
      localStorage.setItem(_key(col), JSON.stringify(data));
      return true;
    } catch { return false; }
  };

  const _genId = (col) => {
    const prefixes = {
      materials: 'MAT', interfaces: 'IFC', failures: 'FAIL', templates: 'TPL'
    };
    const p = prefixes[col] || 'REC';
    const all = _read(col) || [];
    const nums = all.map(r => parseInt((r.id || '').replace(p + '-', '')) || 0);
    const next = (Math.max(0, ...nums) + 1).toString().padStart(3, '0');
    return `${p}-${next}`;
  };

  /* ---- Init ---- */
  const init = () => {
    COLLECTIONS.forEach(col => {
      if (_read(col) === null) {
        _write(col, SEEDS[col]());
      }
    });
  };

  /* ---- CRUD ---- */
  const getAll = (col) => _read(col) || [];

  const getById = (col, id) => (getAll(col)).find(r => r.id === id) || null;

  const add = (col, data) => {
    const all = getAll(col);
    const record = { ...data, id: data.id || _genId(col), _createdAt: Date.now() };
    all.push(record);
    _write(col, all);
    _emit('change', { col, action: 'add', id: record.id });
    return record;
  };

  const update = (col, id, data) => {
    const all = getAll(col);
    const idx = all.findIndex(r => r.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...data, id, _updatedAt: Date.now() };
    _write(col, all);
    _emit('change', { col, action: 'update', id });
    return all[idx];
  };

  const remove = (col, id) => {
    const all = getAll(col);
    const filtered = all.filter(r => r.id !== id);
    _write(col, filtered);
    _emit('change', { col, action: 'delete', id });
    return true;
  };

  /* ---- Import / Export ---- */
  const exportAll = () => {
    const data = {};
    COLLECTIONS.forEach(col => { data[col] = getAll(col); });
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      platform: 'PRWP',
      data
    };
  };

  const importAll = (json, mode = 'merge') => {
    try {
      const parsed = typeof json === 'string' ? JSON.parse(json) : json;
      const src = parsed.data || parsed;
      COLLECTIONS.forEach(col => {
        if (!src[col]) return;
        if (mode === 'replace') {
          _write(col, src[col]);
        } else {
          // merge: keep existing, add new
          const existing = getAll(col);
          const existingIds = new Set(existing.map(r => r.id));
          const incoming = src[col].filter(r => !existingIds.has(r.id));
          _write(col, [...existing, ...incoming]);
        }
      });
      _emit('change', { action: 'import' });
      return { ok: true, message: `Import successful (mode: ${mode})` };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  };

  const resetToSeed = (col) => {
    if (col) {
      _write(col, SEEDS[col]());
    } else {
      COLLECTIONS.forEach(c => _write(c, SEEDS[c]()));
    }
    _emit('change', { action: 'reset' });
  };

  /* ---- Stats ---- */
  const getStats = () => {
    const stats = {};
    COLLECTIONS.forEach(col => { stats[col] = getAll(col).length; });
    return stats;
  };

  /* ---- Events ---- */
  const _emit = (event, detail) => {
    document.dispatchEvent(new CustomEvent(`store:${event}`, { detail }));
  };

  const onChange = (fn) => {
    document.addEventListener('store:change', fn);
  };

  return { init, getAll, getById, add, update, remove, exportAll, importAll, resetToSeed, getStats, onChange };
})();
