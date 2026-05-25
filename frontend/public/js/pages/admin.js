/* ============================================================
   PRWP Admin Dashboard Page
   ============================================================ */

const AdminPage = {
  render() {
    const t = i18n.t.bind(i18n);
    const lang = i18n.getLang();
    const stats = Store.getStats();

    return `
      <div class="page-inner animate-in">
        <div class="admin-header-strip">
          <div class="admin-header-title">⚙️ ${lang==='zh' ? '数据管理中心' : 'Data Management'}</div>
          <div class="admin-header-desc">${lang==='zh' ? '录入、导出、导入、重置平台知识库数据' : 'Add, export, import and reset platform knowledge data'}</div>
        </div>

        <!-- Stats -->
        <div class="section">
          <div class="section-title" style="margin-bottom:var(--space-4);">${lang==='zh' ? '当前数据量' : 'Current Records'}</div>
          <div class="grid-4">
            ${[
              { col:'materials',  icon:'⚗️', zh:'材料', en:'Materials' },
              { col:'interfaces', icon:'🔗', zh:'界面', en:'Interfaces' },
              { col:'failures',   icon:'⚠️', zh:'失效模式', en:'Failures' },
              { col:'templates',  icon:'📐', zh:'工艺模板', en:'Templates' },
            ].map((s,i) => `
              <div class="stat-card animate-in animate-in-delay-${i+1}">
                <div style="font-size:20px;margin-bottom:var(--space-2);">${s.icon}</div>
                <div class="stat-card-value">${stats[s.col] || 0}</div>
                <div class="stat-card-label">${lang==='zh' ? s.zh : s.en}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Actions -->
        <div class="section">
          <div class="section-title" style="margin-bottom:var(--space-4);">${lang==='zh' ? '数据操作' : 'Data Operations'}</div>
          <div class="grid-3">

            <!-- Export -->
            <div class="admin-action-card">
              <div class="admin-action-icon">📤</div>
              <div class="admin-action-title">${lang==='zh' ? '导出全部数据' : 'Export All Data'}</div>
              <div class="admin-action-desc">${lang==='zh' ? '将所有库的数据导出为 JSON 文件，用于备份或迁移。' : 'Export all library data as a JSON file for backup or migration.'}</div>
              <button class="btn btn-primary" onclick="AdminPage.exportAll()">
                📤 ${lang==='zh' ? '导出 JSON' : 'Export JSON'}
              </button>
            </div>

            <!-- Import -->
            <div class="admin-action-card">
              <div class="admin-action-icon">📥</div>
              <div class="admin-action-title">${lang==='zh' ? '导入数据' : 'Import Data'}</div>
              <div class="admin-action-desc">${lang==='zh' ? '从 JSON 文件导入数据，支持合并（保留现有）或替换模式。' : 'Import data from a JSON file. Supports merge (keep existing) or replace mode.'}</div>
              <div style="display:flex;gap:var(--space-2);">
                <button class="btn btn-secondary" onclick="AdminPage.importData('merge')">
                  ${lang==='zh' ? '合并导入' : 'Merge'}
                </button>
                <button class="btn btn-secondary" onclick="AdminPage.importData('replace')">
                  ${lang==='zh' ? '替换导入' : 'Replace'}
                </button>
              </div>
            </div>

            <!-- Reset -->
            <div class="admin-action-card">
              <div class="admin-action-icon">🔄</div>
              <div class="admin-action-title">${lang==='zh' ? '重置为出厂数据' : 'Reset to Seed Data'}</div>
              <div class="admin-action-desc">${lang==='zh' ? '清除所有自定义数据，恢复初始示例数据。此操作不可撤销。' : 'Clear all custom data and restore initial seed data. This cannot be undone.'}</div>
              <button class="btn btn-secondary" style="color:var(--color-danger);" onclick="AdminPage.resetAll()">
                ⚠️ ${lang==='zh' ? '重置全部' : 'Reset All'}
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Add -->
        <div class="section">
          <div class="section-title" style="margin-bottom:var(--space-4);">${lang==='zh' ? '快速录入' : 'Quick Add'}</div>
          <div class="grid-4">
            ${[
              { route:'material',  icon:'⚗️', zh:'新建材料卡',   en:'Add Material' },
              { route:'interface', icon:'🔗', zh:'新建界面卡',   en:'Add Interface' },
              { route:'failure',   icon:'⚠️', zh:'新建失效模式', en:'Add Failure Mode' },
              { route:'process',   icon:'📐', zh:'新建工艺模板', en:'Add Process Template' },
            ].map(a => `
              <button class="admin-action-card" style="text-align:left;width:100%;cursor:pointer;border:none;font-family:var(--font-family);"
                onclick="Router.navigate('${a.route}'); setTimeout(()=>document.getElementById('btn-add-${a.route}')?.click(),100);">
                <div class="admin-action-icon">${a.icon}</div>
                <div class="admin-action-title">${lang==='zh' ? a.zh : a.en}</div>
              </button>
            `).join('')}
          </div>
        </div>
        <!-- Security Settings -->
        <div class="section">
          <div class="section-title" style="margin-bottom:var(--space-4);">${lang==='zh' ? '🔐 安全设置' : '🔐 Security'}</div>
          <div class="admin-action-card" style="max-width:520px;">
            <div class="admin-action-icon">🔐</div>
            <div class="admin-action-title">${lang==='zh' ? '管理员密码' : 'Admin Password'}</div>
            <div class="admin-action-desc">${lang==='zh' ? '用于保护删除操作。默认密码 88888888。' : 'Protects delete operations. Default: 88888888.'}</div>
            <div style="display:flex;gap:var(--space-2);flex-wrap:wrap;margin-top:var(--space-3);">
              <input class="form-input" id="pwd-current" type="password" placeholder="${lang==='zh'?'当前密码':'Current password'}" style="flex:1;min-width:130px;">
              <input class="form-input" id="pwd-new" type="password" placeholder="${lang==='zh'?'新密码（至少6位）':'New password (≥6 chars)'}" style="flex:1;min-width:160px;">
              <button class="btn btn-secondary" onclick="AdminPage.changePassword()">${lang==='zh'?'修改密码':'Change'}</button>
            </div>
            <div id="pwd-status" style="margin-top:var(--space-2);font-size:var(--text-sm);min-height:20px;"></div>
          </div>
          <!-- Gemini API Key -->
          <div class="admin-action-card" style="max-width:520px;margin-top:var(--space-4);">
            <div class="admin-action-icon">🤖</div>
            <div class="admin-action-title">Gemini API Key</div>
            <div class="admin-action-desc">${lang==='zh'?'用于 AI 材料特性自动查询。在 aistudio.google.com 获取。':'Used for AI material property lookup. Get it at aistudio.google.com.'}</div>
            ${AI.getKey() ? `
            <div style="margin-top:var(--space-2);padding:var(--space-2) var(--space-3);background:var(--color-success-light);border-radius:var(--radius-md);font-size:var(--text-xs);color:var(--color-success);font-family:var(--font-mono);">
              ✓ ${lang==='zh'?'当前 Key：':'Active Key: '}<span id="gemini-key-preview">${AI.getKey().slice(0,8)}••••••••••••••••••••</span>
              <button onclick="AdminPage.toggleKeyPreview()" style="margin-left:8px;background:none;border:none;color:var(--color-success);cursor:pointer;font-size:var(--text-xs);text-decoration:underline;">
                <span id="gemini-preview-btn">${lang==='zh'?'显示':'Show'}</span>
              </button>
            </div>` : ''}
            <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3);">
              <div style="position:relative;flex:1;">
                <input class="form-input" id="gemini-key-input" type="password" placeholder="${AI.getKey() ? (lang==='zh'?'输入新 Key 以替换当前':'Enter new key to replace current') : 'AIzaSy...'}" style="width:100%;font-family:var(--font-mono);font-size:var(--text-sm);padding-right:44px;box-sizing:border-box;">
                <button id="gemini-eye-btn" onclick="AdminPage.toggleKeyVisibility()" title="${lang==='zh'?'显示/隐藏':'Show/Hide'}" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:16px;color:var(--color-text-tertiary);padding:0;line-height:1;">👁</button>
              </div>
              <button class="btn btn-secondary" onclick="AdminPage.saveGeminiKey()">${lang==='zh'?'保存':'Save'}</button>
            </div>
            <div id="gemini-key-status" style="margin-top:var(--space-2);font-size:var(--text-sm);min-height:20px;"></div>
          </div>
        </div>
      </div>
    `;
  },

  exportAll() {
    const data = Store.exportAll();
    const filename = `prwp_backup_${new Date().toISOString().slice(0,10)}.json`;
    UI.downloadJSON(data, filename);
    UI.toast(`已导出 ${filename}`, 'success');
  },

  importData(mode) {
    const lang = i18n.getLang();
    UI.uploadJSON((data) => {
      const result = Store.importAll(data, mode);
      if (result.ok) {
        UI.toast(lang==='zh' ? `导入成功（${mode === 'merge' ? '合并' : '替换'}模式）` : `Import successful (${mode})`, 'success');
        Router.resolve();
      } else {
        UI.toast(`Import failed: ${result.message}`, 'error');
      }
    });
  },

  resetAll() {
    const lang = i18n.getLang();
    UI.confirm({
      title: lang==='zh' ? '确认重置所有数据？' : 'Reset all data?',
      desc: lang==='zh' ? '所有自定义录入的数据将被清除，恢复为初始示例数据。此操作无法撤销。' : 'All custom data will be cleared and replaced with seed data. This cannot be undone.',
      danger: true,
      onConfirm: () => {
        Store.resetToSeed();
        UI.toast(lang==='zh' ? '已重置为出厂数据' : 'Reset to seed data', 'success');
        Router.resolve();
      }
    });
  },

  changePassword() {
    const lang = i18n.getLang();
    const current = document.getElementById('pwd-current')?.value || '';
    const newPwd  = document.getElementById('pwd-new')?.value || '';
    const status  = document.getElementById('pwd-status');
    if (!status) return;

    if (current !== UI.getAdminPwd()) {
      status.innerHTML = `<span style="color:var(--color-danger)">❌ ${lang==='zh'?'当前密码错误':'Wrong current password'}</span>`;
      return;
    }
    if (newPwd.length < 6) {
      status.innerHTML = `<span style="color:var(--color-danger)">❌ ${lang==='zh'?'新密码至少6位':'Min 6 characters'}</span>`;
      return;
    }
    UI.setAdminPwd(newPwd);
    document.getElementById('pwd-current').value = '';
    document.getElementById('pwd-new').value = '';
    status.innerHTML = `<span style="color:var(--color-success)">✓ ${lang==='zh'?'密码已更新':'Password updated'}</span>`;
  },

  toggleKeyVisibility() {
    const input = document.getElementById('gemini-key-input');
    const btn   = document.getElementById('gemini-eye-btn');
    if (!input) return;
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    if (btn) btn.textContent = isHidden ? '🙈' : '👁';
  },

  toggleKeyPreview() {
    const preview = document.getElementById('gemini-key-preview');
    const btn     = document.getElementById('gemini-preview-btn');
    if (!preview) return;
    const lang = i18n.getLang();
    const key  = AI.getKey();
    const isShowing = preview.textContent === key;
    preview.textContent = isShowing
      ? key.slice(0, 8) + '••••••••••••••••••••'
      : key;
    if (btn) btn.textContent = isShowing ? (lang==='zh'?'显示':'Show') : (lang==='zh'?'隐藏':'Hide');
  },

  saveGeminiKey() {
    const lang   = i18n.getLang();
    const input  = document.getElementById('gemini-key-input');
    const status = document.getElementById('gemini-key-status');
    const val    = input?.value?.trim();

    if (!val) {
      if (status) status.innerHTML = `<span style="color:var(--color-danger)">❌ ${lang==='zh'?'请输入 API Key':'Please enter an API Key'}</span>`;
      return;
    }
    // Must start with AIzaSy to be a valid Gemini key
    if (!val.startsWith('AIza')) {
      if (status) status.innerHTML = `<span style="color:var(--color-danger)">❌ ${lang==='zh'?'Key 格式不正确，应以 AIza 开头':'Invalid key format — should start with AIza'}</span>`;
      return;
    }
    AI.setKey(val);
    input.value = '';
    input.type  = 'password';
    input.placeholder = lang==='zh'?'输入新 Key 以替换当前':'Enter new key to replace current';
    if (status) status.innerHTML = `<span style="color:var(--color-success)">✓ ${lang==='zh'?'已保存，当前 Key：':'Saved. Active Key: '}${val.slice(0,8)}••••</span>`;
    UI.toast('Gemini API Key ' + (lang==='zh'?'已更新':'updated'), 'success');
    // Refresh preview
    const preview = document.getElementById('gemini-key-preview');
    if (preview) preview.textContent = val.slice(0, 8) + '••••••••••••••••••••';
  }
};

