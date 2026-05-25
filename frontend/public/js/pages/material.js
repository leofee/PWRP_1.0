/* PRWP Material Library Page — v2: Inline Card Editor */
const MaterialPage = {
  _editingId: null,   // null | 'new' | 'MAT-xxx'
  _extraFields: [],   // [{key,val}]
  _getRating: null,
  _getTags: null,

  /* ============================================================
     RENDER
  ============================================================ */
  render() {
    const t = i18n.t.bind(i18n);
    const lang = i18n.getLang();
    const materials = Store.getAll('materials');

    const cards = materials.map((m, i) => {
      if (m.id === this._editingId) {
        return this._editorCardHTML(m);
      }
      return this._displayCardHTML(m, i);
    }).join('');

    const editorAtTop = this._editingId === 'new'
      ? `<div id="mat-card-editor-new" class="material-card card-editor animate-in">${this._editorCardHTML({}, true)}</div>`
      : '';

    return `
      <div class="page-inner animate-in">
        <div class="page-header">
          <div class="page-header-top">
            <div>
              <div style="font-size:var(--text-xs);color:var(--color-text-tertiary);margin-bottom:var(--space-2);font-family:var(--font-mono);">01 / MATERIAL LIBRARY</div>
              <h1 class="page-title">${t('mat.title')}</h1>
              <p class="page-subtitle">${t('mat.subtitle')}</p>
            </div>
            <div style="display:flex;align-items:center;gap:var(--space-3);flex-shrink:0;">
              <span class="badge badge-active"><span class="badge-dot"></span>Active</span>
              <span style="font-size:var(--text-sm);color:var(--color-text-tertiary);">${materials.length} records</span>
              <button class="btn-add" id="btn-add-material" onclick="MaterialPage.openAdd()">+ ${lang==='zh'?'新建材料':'Add Material'}</button>
            </div>
          </div>
          <!-- Search -->
          <div id="mat-search-container" style="margin-top:var(--space-4);max-width:320px;"></div>
        </div>

        <div class="section">
          <div class="grid-auto" id="materials-grid">
            ${editorAtTop}${cards.length > 0 || editorAtTop ? cards : '<div class="empty-state"><div class="empty-state-icon">⚗️</div><div class="empty-state-text">No materials yet.</div></div>'}
          </div>
        </div>
      </div>`;
  },

  afterRender() {
    // Init search box
    const sc = document.getElementById('mat-search-container');
    if (sc) {
      const lang = i18n.getLang();
      UI.searchBox({
        container: sc,
        placeholder: lang === 'zh' ? '搜索材料名称...' : 'Search materials...',
        getData: () => Store.getAll('materials'),
        getLabel: (m) => [m.nameZh, m.nameEn, m.formula].filter(Boolean).join(' / '),
        onSelect: (m) => {
          if (!m) return;
          const el = document.getElementById(`mat-card-${m.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('card-highlight');
            setTimeout(() => el.classList.remove('card-highlight'), 1500);
          }
        }
      });
    }
    // Init editor widgets if in edit mode
    if (this._editingId) {
      const suffix = this._editingId === 'new' ? 'new' : this._editingId;
      const wrap = document.getElementById(`mat-card-editor-${suffix}`);
      if (wrap) this._initWidgets(wrap);
    }
  },

  /* ============================================================
     DISPLAY CARD HTML
  ============================================================ */
  _displayCardHTML(m, i = 0) {
    const lang = i18n.getLang();
    const t = i18n.t.bind(i18n);
    const riskBadge = (val) => {
      if (!val || val === '—') return '<span style="color:var(--color-text-tertiary);">—</span>';
      const v = val.toLowerCase();
      if (v.includes('very high') || v.includes('极高')) return `<span class="badge badge-high">${val}</span>`;
      if (v.includes('high') || v.includes('高')) return `<span class="badge badge-high">${val}</span>`;
      if (v.includes('medium') || v.includes('中')) return `<span class="badge badge-medium">${val}</span>`;
      return `<span class="badge badge-low">${val}</span>`;
    };
    const weldBar = (level) => {
      level = parseInt(level) || 1;
      return `<div style="display:flex;gap:4px;align-items:center;">${Array.from({length:5},(_,i)=>`<div style="width:10px;height:10px;border-radius:50%;background:${i<level?'var(--color-danger)':'var(--color-bg-tertiary)'}"></div>`).join('')}<span style="font-size:var(--text-xs);color:var(--color-text-tertiary);margin-left:4px;">${level}/5</span></div>`;
    };

    // Extra custom fields
    const extraRows = (m.extra || []).map(e =>
      `<div class="field-row"><span class="field-key">${e.key}</span><span class="field-value">${e.val}</span></div>`
    ).join('');

    return `
      <div class="material-card animate-in animate-in-delay-${(i%3)+1}" id="mat-card-${m.id}">
        <div class="material-card-header">
          <div>
            <div class="material-card-id">${m.id}</div>
            <div class="material-card-name">${lang==='zh'?(m.nameZh||m.nameEn||m.formula):(m.nameEn||m.nameZh||m.formula)}</div>
            <div class="material-card-formula">${m.formula||''}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:var(--space-2);">
            <span class="badge badge-priority-${(m.priority||'p2').toLowerCase()}">${m.priority||'—'}</span>
            <div class="card-actions">
              <button class="action-btn" onclick="MaterialPage.openEdit('${m.id}')">✏️</button>
              <button class="action-btn danger" onclick="MaterialPage.confirmDelete('${m.id}')">🗑</button>
            </div>
          </div>
        </div>
        <div class="material-card-body">
          <div class="material-metrics">
            <div class="metric-item"><div class="metric-value">${(m.conductivity||'—').split('/')[0].trim()}</div><div class="metric-label">${t('mat.conductivity')}</div></div>
            <div class="metric-item"><div class="metric-value">${m.melting_point||'—'}</div><div class="metric-label">${t('mat.melting')}</div></div>
            <div class="metric-item">${weldBar(m.weldability_level)}<div class="metric-label">${t('mat.weldability')}</div></div>
          </div>
          <div class="field-list" style="margin-bottom:var(--space-4);">
            <div class="field-row"><span class="field-key">${t('mat.contact_r')}</span><span class="field-value">${m.contact_resistance||'—'}</span></div>
            <div class="field-row"><span class="field-key">${t('mat.splash')}</span><span class="field-value">${riskBadge(m.splash_risk)}</span></div>
            <div class="field-row"><span class="field-key">${t('mat.rec_current')}</span><span class="field-value field-value-mono">${m.recommended_current_density||'—'}</span></div>
            <div class="field-row" style="border-bottom:none;"><span class="field-key">${t('mat.notes')}</span><span class="field-value" style="color:var(--color-text-secondary);font-size:var(--text-sm);line-height:1.5;">${(lang==='zh'?(m.notes?.zh||m.notes?.en):(m.notes?.en||m.notes?.zh))||(typeof m.notes==='string'?m.notes:'')||'—'}</span></div>
            ${extraRows}
          </div>
          <div class="material-card-tags">${(m.tags||[]).map(tag=>`<span class="tag">${tag}</span>`).join('')}</div>
        </div>
      </div>`;
  },

  /* ============================================================
     EDITOR CARD HTML
  ============================================================ */
  _editorCardHTML(m = {}, isNew = false) {
    const lang = i18n.getLang();
    const opts = (vals, cur) => vals.map(v => `<option value="${v}" ${cur===v?'selected':''}>${v}</option>`).join('');
    const rOpts = ['High / 高','Medium-High / 中高','Medium / 中','Low-Medium / 中低','Low / 低','Very High / 极高'];
    const cOpts = ['Very High / 极高','High / 高','Medium / 中','Low / 低'];
    const id = isNew ? 'new' : m.id;

    const extraRows = (m.extra || []).map((e, i) => `
      <div class="extra-field-row" id="extra-row-${i}">
        <input class="form-input" id="extra-key-${i}" placeholder="${lang==='zh'?'字段名':'Field name'}" value="${e.key||''}">
        <input class="form-input" id="extra-val-${i}" placeholder="${lang==='zh'?'值':'Value'}" value="${e.val||''}">
        <button class="action-btn danger" onclick="MaterialPage.removeExtraRow(${i})">🗑</button>
      </div>`).join('');

    const card = `
      <div class="card-editor-inner" id="mat-card-editor-${id}">
        <!-- Header -->
        <div class="card-editor-header">
          <div style="flex:1;">
            ${isNew ? `<div class="material-card-id" style="color:var(--color-accent);">✦ ${lang==='zh'?'新建材料':'New Material'}</div>` : `<div class="material-card-id">${m.id}</div>`}
            <div style="display:flex;gap:var(--space-2);margin-top:var(--space-2);flex-wrap:wrap;">
              <input class="form-input" id="f-nameZh" value="${m.nameZh||''}" placeholder="${lang==='zh'?'中文名称':'中文名称'}" style="flex:1;min-width:120px;"
                oninput="MaterialPage._onNameInput(this.value, '${m.id||''}')">
              <input class="form-input" id="f-nameEn" value="${m.nameEn||''}" placeholder="English Name" style="flex:1;min-width:120px;"
                oninput="MaterialPage._onNameInput(this.value, '${m.id||''}')">
              <input class="form-input" id="f-formula" value="${m.formula||''}" placeholder="Formula / AgSnO₂" style="flex:1;min-width:100px;"
                onblur="MaterialPage._onFormulaBlur(this.value, '${m.id||''}')">
              <button class="btn-ai-lookup" id="btn-ai-lookup" onclick="MaterialPage.aiLookup()" title="${lang==='zh'?'AI 自动查询材料特性':'AI auto-lookup material properties'}">
                🤖 ${lang==='zh'?'AI 查询':'AI Lookup'}
              </button>
            </div>
            <div id="smart-hint-duplicate"></div>
            <div id="smart-hint-autofill"></div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:var(--space-2);flex-shrink:0;">
            <select class="form-select" id="f-priority" style="width:80px;">${opts(['P0','P1','P2'],m.priority||'P1')}</select>
          </div>
        </div>

        <!-- Fixed Fields -->
        <div class="card-editor-fields">
          <div class="editor-field-row">
            <span class="editor-field-label">${lang==='zh'?'分类':'Category'}</span>
            <input class="form-input editor-field-input" id="f-category" value="${m.category||''}" placeholder="Contact Material">
          </div>
          <div class="editor-field-row">
            <span class="editor-field-label">${lang==='zh'?'导电性':'Conductivity'}</span>
            <select class="form-select editor-field-input" id="f-conductivity">${opts(cOpts,m.conductivity||'High / 高')}</select>
          </div>
          <div class="editor-field-row">
            <span class="editor-field-label">${lang==='zh'?'热导率':'Thermal Cond.'}</span>
            <select class="form-select editor-field-input" id="f-thermal">${opts(cOpts,m.thermal_conductivity||'High / 高')}</select>
          </div>
          <div class="editor-field-row">
            <span class="editor-field-label">${lang==='zh'?'熔点':'Melting Point'}</span>
            <input class="form-input editor-field-input" id="f-melting" value="${m.melting_point||''}" placeholder="962°C">
          </div>
          <div class="editor-field-row">
            <span class="editor-field-label">${lang==='zh'?'硬度':'Hardness'}</span>
            <select class="form-select editor-field-input" id="f-hardness">${opts(['Very High / 极高','High / 高','Medium / 中','Low / 低','Very Low / 极低'],m.hardness||'Medium / 中')}</select>
          </div>
          <div class="editor-field-row">
            <span class="editor-field-label">${lang==='zh'?'接触电阻':'Contact R.'}</span>
            <select class="form-select editor-field-input" id="f-contact_r">${opts(rOpts,m.contact_resistance||'Medium / 中')}</select>
          </div>
          <div class="editor-field-row">
            <span class="editor-field-label">${lang==='zh'?'可焊性 (1难→5易)':'Weldability (1–5)'}</span>
            <div id="f-weldability-wrap" class="editor-field-input"></div>
          </div>
          <div class="editor-field-row">
            <span class="editor-field-label">${lang==='zh'?'飞溅风险':'Splash Risk'}</span>
            <select class="form-select editor-field-input" id="f-splash">${opts(rOpts,m.splash_risk||'Medium / 中')}</select>
          </div>
          <div class="editor-field-row">
            <span class="editor-field-label">${lang==='zh'?'裂纹风险':'Crack Risk'}</span>
            <select class="form-select editor-field-input" id="f-crack">${opts(rOpts,m.crack_risk||'Low / 低')}</select>
          </div>
          <div class="editor-field-row">
            <span class="editor-field-label">${lang==='zh'?'推荐电流密度':'Rec. Current'}</span>
            <input class="form-input editor-field-input" id="f-current" value="${m.recommended_current_density||''}" placeholder="600–900 A/mm²">
          </div>
          <div class="editor-field-row">
            <span class="editor-field-label">${lang==='zh'?'推荐压力':'Rec. Pressure'}</span>
            <input class="form-input editor-field-input" id="f-pressure" value="${m.recommended_pressure||''}" placeholder="400–700 N">
          </div>
          <div class="editor-field-row" style="align-items:flex-start;">
            <span class="editor-field-label" style="padding-top:8px;">${lang==='zh'?'标签':'Tags'}</span>
            <div id="f-tags-wrap" class="editor-field-input"></div>
          </div>
          <div class="editor-field-row" style="align-items:flex-start;">
            <span class="editor-field-label" style="padding-top:8px;">${lang==='zh'?'备注 (中文)':'Notes (ZH)'}</span>
            <textarea class="form-textarea editor-field-input" id="f-notes-zh" style="min-height:60px;">${m.notes?.zh||m.notes||''}</textarea>
          </div>
          <div class="editor-field-row" style="align-items:flex-start;">
            <span class="editor-field-label" style="padding-top:8px;">Notes (EN)</span>
            <textarea class="form-textarea editor-field-input" id="f-notes-en" style="min-height:60px;">${m.notes?.en||''}</textarea>
          </div>
        </div>

        <!-- Custom Extra Fields -->
        <div class="card-editor-extra">
          <div class="extra-fields-title">${lang==='zh'?'自定义扩展字段':'Custom Fields'}</div>
          <div id="extra-fields-container">${extraRows}</div>
          <button class="btn-add-row" onclick="MaterialPage.addExtraRow()">+ ${lang==='zh'?'新增行':'Add Row'}</button>
        </div>

        <!-- Footer -->
        <div class="card-editor-footer">
          <button class="btn btn-secondary" onclick="MaterialPage.cancelEdit()">
            ${lang==='zh'?'取消':'Cancel'}
          </button>
          <button class="btn btn-primary" onclick="MaterialPage.saveCard('${isNew?'':m.id}')">
            💾 ${lang==='zh'?'保存':'Save'}
          </button>
        </div>
      </div>`;

    return isNew ? card : `<div class="material-card card-editor" id="mat-card-${m.id}">${card}</div>`;
  },

  /* ============================================================
     WIDGET INIT (called after DOM is ready)
  ============================================================ */
  _initWidgets(scope) {
    const m = this._editingId && this._editingId !== 'new'
      ? Store.getById('materials', this._editingId) : {};
    const wWrap = scope ? scope.querySelector('#f-weldability-wrap') : document.getElementById('f-weldability-wrap');
    if (wWrap) { const r = UI.ratingInput(wWrap, m.weldability_level || 3); this._getRating = r.getValue; }
    const tWrap = scope ? scope.querySelector('#f-tags-wrap') : document.getElementById('f-tags-wrap');
    if (tWrap) { const tg = UI.tagsInput(tWrap, m.tags || []); this._getTags = tg.getTags; }
  },

  /* ============================================================
     OPEN ADD / EDIT
  ============================================================ */
  openAdd() {
    if (this._editingId) this.cancelEdit();
    this._editingId = 'new';
    this._extraFields = [];

    const grid = document.getElementById('materials-grid');
    if (!grid) { Router.resolve(); return; }

    // Remove empty state if present
    const empty = grid.querySelector('.empty-state');
    if (empty) empty.remove();

    const div = document.createElement('div');
    div.className = 'material-card card-editor animate-in';
    div.id = 'mat-card-wrapper-new';
    div.innerHTML = this._editorCardHTML({}, true);
    grid.prepend(div);
    div.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
      this._initWidgets(div);
      document.getElementById('f-nameZh')?.focus();
    }, 50);
  },

  openEdit(id) {
    if (this._editingId) this.cancelEdit();
    const m = Store.getById('materials', id);
    if (!m) return;

    this._editingId = id;
    this._extraFields = [...(m.extra || [])];

    const cardEl = document.getElementById(`mat-card-${id}`);
    if (!cardEl) { Router.resolve(); return; }

    // Save original HTML for cancel
    cardEl._originalHTML = cardEl.outerHTML;
    cardEl.classList.add('card-editor');
    cardEl.innerHTML = this._editorCardHTML(m, false);

    setTimeout(() => {
      this._initWidgets(cardEl);
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  },

  /* ============================================================
     CANCEL EDIT
  ============================================================ */
  cancelEdit() {
    if (this._editingId === 'new') {
      document.getElementById('mat-card-wrapper-new')?.remove();
    } else if (this._editingId) {
      const cardEl = document.getElementById(`mat-card-${this._editingId}`);
      if (cardEl && cardEl._originalHTML) {
        cardEl.outerHTML = cardEl._originalHTML;
      } else {
        Router.resolve();
      }
    }
    this._editingId = null;
    this._extraFields = [];
    this._getRating = null;
    this._getTags = null;
  },

  /* ============================================================
     SAVE
  ============================================================ */
  saveCard(existingId) {
    const val = (id) => document.getElementById(id)?.value?.trim() || '';

    // Collect extra fields
    const extra = [];
    let i = 0;
    while (document.getElementById(`extra-key-${i}`) !== null) {
      const k = document.getElementById(`extra-key-${i}`)?.value?.trim();
      const v = document.getElementById(`extra-val-${i}`)?.value?.trim();
      if (k) extra.push({ key: k, val: v || '' });
      i++;
    }

    const data = {
      nameZh: val('f-nameZh'), nameEn: val('f-nameEn'), formula: val('f-formula'),
      category: val('f-category'), conductivity: val('f-conductivity'),
      thermal_conductivity: val('f-thermal'), melting_point: val('f-melting'),
      hardness: val('f-hardness'), contact_resistance: val('f-contact_r'),
      weldability_level: this._getRating ? this._getRating() : 3,
      splash_risk: val('f-splash'), crack_risk: val('f-crack'),
      recommended_current_density: val('f-current'), recommended_pressure: val('f-pressure'),
      priority: val('f-priority'),
      tags: this._getTags ? this._getTags() : [],
      notes: { zh: val('f-notes-zh'), en: val('f-notes-en') },
      extra,
    };

    if (!data.nameZh && !data.nameEn) {
      UI.toast('请填写名称 / Name required', 'error');
      return;
    }

    const lang = i18n.getLang();
    if (existingId) {
      Store.update('materials', existingId, data);
      UI.toast(lang === 'zh' ? '已更新' : 'Updated', 'success');
    } else {
      Store.add('materials', data);
      UI.toast(lang === 'zh' ? '已添加' : 'Added', 'success');
    }

    this._editingId = null;
    this._extraFields = [];
    this._getRating = null;
    this._getTags = null;
    Router.resolve();
  },

  /* ============================================================
     EXTRA FIELDS
  ============================================================ */
  addExtraRow() {
    const container = document.getElementById('extra-fields-container');
    if (!container) return;
    const idx = container.querySelectorAll('.extra-field-row').length;
    const lang = i18n.getLang();
    const row = document.createElement('div');
    row.className = 'extra-field-row';
    row.id = `extra-row-${idx}`;
    row.innerHTML = `
      <input class="form-input" id="extra-key-${idx}" placeholder="${lang==='zh'?'字段名':'Field name'}">
      <input class="form-input" id="extra-val-${idx}" placeholder="${lang==='zh'?'值':'Value'}">
      <button class="action-btn danger" onclick="MaterialPage.removeExtraRow(${idx})">🗑</button>`;
    container.appendChild(row);
    row.querySelector('input')?.focus();
  },

  removeExtraRow(idx) {
    document.getElementById(`extra-row-${idx}`)?.remove();
  },

  /* ============================================================
     DELETE (with password)
  ============================================================ */
  confirmDelete(id) {
    const lang = i18n.getLang();
    const m = Store.getById('materials', id);
    const name = lang === 'zh' ? (m?.nameZh || id) : (m?.nameEn || id);

    UI.confirm({
      title: lang === 'zh' ? `删除 ${name}？` : `Delete ${name}?`,
      desc: lang === 'zh' ? '此操作需要管理员密码确认，无法撤销。' : 'Admin password required. Cannot be undone.',
      danger: true,
      onConfirm: () => {
        UI.passwordConfirm({
          title: lang === 'zh' ? '管理员验证' : 'Admin Verification',
          desc: lang === 'zh' ? `确认删除「${name}」` : `Confirm delete "${name}"`,
          onSuccess: () => {
            Store.remove('materials', id);
            UI.toast(lang === 'zh' ? '已删除' : 'Deleted', 'success');
            Router.resolve();
          }
        });
      }
    });
  },

  /* ============================================================
     PHASE 1: SMART INPUT INTELLIGENCE
  ============================================================ */

  // Debounce timer for name input
  _nameCheckTimer: null,

  _onNameInput(val, excludeId) {
    clearTimeout(this._nameCheckTimer);
    this._nameCheckTimer = setTimeout(() => this._checkDuplicate(val, excludeId), 350);
  },

  _checkDuplicate(val, excludeId) {
    const hint = document.getElementById('smart-hint-duplicate');
    if (!hint) return;
    if (!val || val.trim().length < 2) { hint.innerHTML = ''; return; }

    const lang = i18n.getLang();
    const q = val.trim().toLowerCase();
    const matches = Store.getAll('materials').filter(m => {
      if (m.id === excludeId) return false;
      return (m.nameZh || '').toLowerCase().includes(q) ||
             (m.nameEn || '').toLowerCase().includes(q) ||
             (m.formula || '').toLowerCase().includes(q);
    });

    if (!matches.length) { hint.innerHTML = ''; return; }

    hint.innerHTML = `
      <div class="smart-hint smart-hint-warning">
        <span class="smart-hint-icon">⚠️</span>
        <span>${lang==='zh'?'发现相似记录：':'Similar records found:'}</span>
        <div class="smart-hint-matches">
          ${matches.slice(0,3).map(m => `
            <span class="smart-hint-tag" onclick="MaterialPage.cancelEdit();setTimeout(()=>{const el=document.getElementById('mat-card-${m.id}');if(el){el.scrollIntoView({behavior:'smooth',block:'center'});el.classList.add('card-highlight');setTimeout(()=>el.classList.remove('card-highlight'),1500);}},100)">
              ${m.nameZh||m.nameEn||m.formula} (${m.id})
            </span>`).join('')}
        </div>
      </div>`;
  },

  _onFormulaBlur(formula, excludeId) {
    const hint = document.getElementById('smart-hint-autofill');
    if (!hint || !formula.trim()) { if(hint) hint.innerHTML=''; return; }

    const lang = i18n.getLang();
    const q = formula.trim().toLowerCase();
    const match = Store.getAll('materials').find(m =>
      m.id !== excludeId && (m.formula||'').toLowerCase() === q
    );

    if (!match) { hint.innerHTML = ''; return; }

    hint.innerHTML = `
      <div class="smart-hint smart-hint-info">
        <span class="smart-hint-icon">💡</span>
        <span>${lang==='zh'?`发现相同配方「${match.nameZh||match.id}」，是否填充已有参数？`
          :`Formula matches "${match.nameEn||match.id}". Auto-fill properties?`}</span>
        <button class="smart-hint-btn" onclick="MaterialPage._autoFill('${match.id}')">
          ${lang==='zh'?'一键填充':'Auto-fill'}
        </button>
        <button class="smart-hint-btn secondary" onclick="document.getElementById('smart-hint-autofill').innerHTML=''">
          ${lang==='zh'?'忽略':'Dismiss'}
        </button>
      </div>`;
  },

  _autoFill(sourceId) {
    const source = Store.getById('materials', sourceId);
    if (!source) return;
    const lang = i18n.getLang();

    const set = (id, val) => { const el = document.getElementById(id); if(el && val) el.value = val; };
    set('f-category',    source.category);
    set('f-conductivity',source.conductivity);
    set('f-thermal',     source.thermal_conductivity);
    set('f-melting',     source.melting_point);
    set('f-hardness',    source.hardness);
    set('f-contact_r',  source.contact_resistance);
    set('f-splash',      source.splash_risk);
    set('f-crack',       source.crack_risk);
    set('f-current',     source.recommended_current_density);
    set('f-pressure',    source.recommended_pressure);

    if (this._getRating === null) {
      const w = document.getElementById('f-weldability-wrap');
      if (w) { const r = UI.ratingInput(w, source.weldability_level || 3); this._getRating = r.getValue; }
    }

    document.getElementById('smart-hint-autofill').innerHTML = `
      <div class="smart-hint smart-hint-success">
        <span class="smart-hint-icon">✓</span>
        <span>${lang==='zh'?'已填充参数，请核对后保存':'Parameters filled. Please review before saving.'}</span>
      </div>`;

    UI.toast(lang==='zh'?'参数已自动填充':'Parameters auto-filled', 'success');
  },

  /* ============================================================
     PHASE 1+: AI LOOKUP (PubChem + Gemini)
  ============================================================ */
  aiLookup() {
    const lang = i18n.getLang();
    const formula = document.getElementById('f-formula')?.value?.trim();
    const nameZh  = document.getElementById('f-nameZh')?.value?.trim();
    const nameEn  = document.getElementById('f-nameEn')?.value?.trim();
    const name = nameZh || nameEn || formula;

    if (!formula && !name) {
      UI.toast(lang==='zh'?'请先输入化学式或名称':'Enter formula or name first', 'error');
      return;
    }
    if (!AI.getKey()) {
      UI.toast(lang==='zh'?'请先在 Admin 页面配置 Gemini API Key':'Set Gemini API Key in Admin page', 'error');
      return;
    }

    // Show loading state
    const btn = document.getElementById('btn-ai-lookup');
    if (btn) { btn.textContent = '⏳ 查询中...'; btn.disabled = true; }

    const query = formula || name;
    AI.lookupMaterial(query, name).then(({ pubchem, gemini, merged }) => {
      if (btn) { btn.innerHTML = `🤖 ${lang==='zh'?'AI 查询':'AI Lookup'}`; btn.disabled = false; }

      if (!merged || (!pubchem && !gemini)) {
        UI.toast(lang==='zh'?'未找到相关数据，请检查化学式':'No data found. Check formula.', 'error');
        return;
      }

      this._showAIPreview(merged, pubchem);
    }).catch(() => {
      if (btn) { btn.innerHTML = `🤖 ${lang==='zh'?'AI 查询':'AI Lookup'}`; btn.disabled = false; }
      UI.toast(lang==='zh'?'查询失败，请检查网络或 API Key':'Query failed. Check network or API Key.', 'error');
    });
  },

  _showAIPreview(merged, pubchem) {
    const lang = i18n.getLang();
    const row = (label, val) => val
      ? `<div class="field-row"><span class="field-key">${label}</span><span class="field-value">${val}</span></div>`
      : '';
    const stars = (n) => '★'.repeat(n||0) + '☆'.repeat(5-(n||0));

    UI.modal({
      title: `🤖 AI ${lang==='zh'?'查询结果':'Lookup Result'} — ${merged.formula || merged.nameEn || ''}`,
      size: 'lg',
      body: `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);">
          <div>
            <div style="font-size:var(--text-xs);font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:.5px;margin-bottom:var(--space-3);">
              📡 PubChem ${lang==='zh'?'基础数据':'Basic Data'}
            </div>
            <div class="field-list">
              ${row('Formula', pubchem?.formula)}
              ${row('IUPAC', pubchem?.iupac)}
              ${row(lang==='zh'?'分子量':'MW', pubchem?.molecularWeight)}
              ${row(lang==='zh'?'熔点':'Melting Pt.', pubchem?.meltingPoint)}
              ${row(lang==='zh'?'密度':'Density', pubchem?.density)}
            </div>
            ${!pubchem ? `<div style="color:var(--color-text-tertiary);font-size:var(--text-sm);">PubChem 未找到此化合物</div>` : ''}
          </div>
          <div>
            <div style="font-size:var(--text-xs);font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:.5px;margin-bottom:var(--space-3);">
              🤖 Gemini AI ${lang==='zh'?'焊接特性':'Welding Properties'}
            </div>
            <div class="field-list">
              ${row(lang==='zh'?'中文名':'Name ZH', merged.nameZh)}
              ${row('Name EN', merged.nameEn)}
              ${row(lang==='zh'?'分类':'Category', merged.category)}
              ${row(lang==='zh'?'导电性':'Conductivity', merged.conductivity)}
              ${row(lang==='zh'?'热导率':'Thermal', merged.thermal_conductivity)}
              ${row(lang==='zh'?'硬度':'Hardness', merged.hardness)}
              ${row(lang==='zh'?'可焊性':'Weldability', merged.weldability_level ? stars(merged.weldability_level) + ` (${merged.weldability_level}/5)` : null)}
              ${row(lang==='zh'?'飞溅风险':'Splash Risk', merged.splash_risk)}
              ${row(lang==='zh'?'裂纹风险':'Crack Risk', merged.crack_risk)}
              ${row(lang==='zh'?'推荐电流密度':'Rec. Current', merged.recommended_current_density)}
              ${row(lang==='zh'?'推荐压力':'Rec. Pressure', merged.recommended_pressure)}
            </div>
          </div>
        </div>
        ${merged.ai_summary ? `
        <div style="margin-top:var(--space-4);padding:var(--space-3);background:var(--color-accent-light);border-radius:var(--radius-md);">
          <div style="font-size:var(--text-xs);color:var(--color-accent);font-weight:600;margin-bottom:var(--space-2);">AI SUMMARY</div>
          <div style="font-size:var(--text-sm);color:var(--color-text-secondary);line-height:1.6;">${merged.ai_summary}</div>
        </div>` : ''}
        <div style="margin-top:var(--space-3);padding:var(--space-2) var(--space-3);background:var(--color-warning-light);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--color-warning);">
          ⚠️ ${lang==='zh'?'AI 生成数据仅供参考，请确认后填入。':'AI-generated data for reference only. Please verify before use.'}
        </div>`,
      confirmText: `✓ ${lang==='zh'?'导入到卡片':'Import to Card'}`,
      cancelText: lang==='zh'?'取消':'Cancel',
      onConfirm: () => {
        this._fillFromAI(merged, pubchem);
      }
    });
  },

  _fillFromAI(merged, pubchem) {
    const lang = i18n.getLang();
    // Strip 'e.g.' prefix from AI-returned text values
    const clean = (val) => (val == null) ? null : String(val).replace(/^e\.g\.\s*/i, '').trim() || null;
    const set = (id, val) => {
      const cleaned = clean(val);
      const el = document.getElementById(id);
      if (el && cleaned) el.value = cleaned;
    };

    console.log('[AI] Filling from merged:', JSON.stringify(merged));

    if (merged.nameZh) set('f-nameZh', merged.nameZh);
    if (merged.nameEn) set('f-nameEn', merged.nameEn);
    if (merged.formula) set('f-formula', merged.formula);
    set('f-category',    merged.category);
    set('f-conductivity',merged.conductivity);
    set('f-thermal',     merged.thermal_conductivity);
    set('f-melting',     merged.melting_point);
    set('f-hardness',    merged.hardness);
    set('f-contact_r',  merged.contact_resistance);
    set('f-splash',      merged.splash_risk);
    set('f-crack',       merged.crack_risk);
    set('f-current',     merged.recommended_current_density);
    set('f-pressure',    merged.recommended_pressure);
    if (merged.priority) set('f-priority', merged.priority);

    // Notes
    const notesZh = document.getElementById('f-notes-zh');
    const notesEn = document.getElementById('f-notes-en');
    if (notesZh && merged.notes?.zh) notesZh.value = merged.notes.zh;
    if (notesEn && merged.notes?.en) notesEn.value = merged.notes.en;

    // Weldability rating widget
    if (merged.weldability_level) {
      const w = document.getElementById('f-weldability-wrap');
      if (w) { const r = UI.ratingInput(w, merged.weldability_level); this._getRating = r.getValue; }
    }

    // Tags
    if (merged.tags?.length) {
      const tw = document.getElementById('f-tags-wrap');
      if (tw) { const tg = UI.tagsInput(tw, merged.tags); this._getTags = tg.getTags; }
    }

    // Download lib sidecar JSON
    const saveResult = AI.saveToLib(merged, pubchem, merged.formula || '');
    UI.toast(
      lang==='zh'
        ? `✓ 已导入！JSON 已下载 → 请移至 ~/lib/${saveResult.record.category}/`
        : `✓ Imported! JSON downloaded → move to ~/lib/${saveResult.record.category}/`,
      'success'
    );
  }
};
