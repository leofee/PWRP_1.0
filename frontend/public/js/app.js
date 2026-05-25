/* ============================================================
   PRWP App — Main Controller (v1.1 with Store + Admin)
   ============================================================ */

const App = {
  init() {
    Store.init();          // Initialize data store (seeds LocalStorage if empty)
    this.renderShell();
    this.registerRoutes();
    this.bindEvents();
    Router.init();
  },

  renderShell() {
    const t = i18n.t.bind(i18n);
    const lang = i18n.getLang();

    const navGroups = [
      {
        labelKey: 'nav.overview',
        items: [
          { route: 'dashboard',       labelZh: '平台总览',     labelEn: 'Overview',        color: '#0071E3' },
          { route: 'knowledge-chain', labelZh: '知识推导链',   labelEn: 'Knowledge Chain', color: '#AF52DE' },
        ]
      },
      {
        labelKey: 'nav.core',
        items: [
          { route: 'material',  labelZh: '01 材料库',     labelEn: '01 Material',     color: 'var(--lib-color-01)' },
          { route: 'interface', labelZh: '02 界面库',     labelEn: '02 Interface',    color: 'var(--lib-color-02)' },
          { route: 'process',   labelZh: '03 工艺模板',   labelEn: '03 Process',      color: 'var(--lib-color-03)' },
          { route: 'power',     labelZh: '04 电源库',     labelEn: '04 Power',        color: 'var(--lib-color-04)' },
          { route: 'head',      labelZh: '05 机构库',     labelEn: '05 Mech. Head',   color: 'var(--lib-color-05)' },
          { route: 'electrode', labelZh: '06 电极库',     labelEn: '06 Electrode',    color: 'var(--lib-color-06)' },
          { route: 'sensor',    labelZh: '07 传感闭环',   labelEn: '07 Sensor',       color: 'var(--lib-color-07)' },
          { route: 'waveform',  labelZh: '08 波形库',     labelEn: '08 Waveform',     color: 'var(--lib-color-08)' },
          { route: 'failure',   labelZh: '09 失效库',     labelEn: '09 Failure',      color: 'var(--lib-color-09)' },
        ]
      },
      {
        labelKey: 'nav.advanced',
        items: [
          { route: 'doe',        labelZh: '10 DOE验证',   labelEn: '10 DOE',          color: 'var(--lib-color-10)' },
          { route: 'production', labelZh: '11 量产窗口',  labelEn: '11 Production',   color: 'var(--lib-color-11)' },
          { route: 'emc',        labelZh: '12 EMC/水冷',  labelEn: '12 EMC',          color: 'var(--lib-color-12)' },
        ]
      },
      {
        labelKey: 'nav.system',
        items: [
          { route: 'software', labelZh: '13 控制软件',   labelEn: '13 Software',     color: 'var(--lib-color-13)' },
          { route: 'ai',       labelZh: '14 AI工艺引擎', labelEn: '14 AI Engine',    color: 'var(--lib-color-14)' },
          { route: 'cases',    labelZh: '15 项目案例',   labelEn: '15 Cases',        color: 'var(--lib-color-15)' },
        ]
      }
    ];

    const statusMap = {
      material:'active', interface:'active', process:'active', failure:'active',
      'knowledge-chain':'active', dashboard:'active', admin:'active',
      power:'soon', head:'soon', electrode:'soon', sensor:'soon', waveform:'soon',
      doe:'planned', production:'planned', emc:'planned', software:'planned', ai:'planned', cases:'planned'
    };

    const navHTML = navGroups.map(group => `
      <div class="nav-section-label">${t(group.labelKey)}</div>
      ${group.items.map(item => {
        const status = statusMap[item.route] || 'planned';
        const badgeMap = { active:'', soon:'Dev', planned:'Soon' };
        const badge = badgeMap[status] ? `<span class="nav-item-badge">${badgeMap[status]}</span>` : '';
        return `
          <a class="nav-item" data-route="${item.route}"
             onclick="Router.navigate('${item.route}'); return false;" href="#${item.route}"
             id="nav-${item.route}">
            <div class="nav-item-dot" style="background:${item.color||'var(--color-text-tertiary)'}"></div>
            <span class="nav-item-label">${lang==='zh' ? item.labelZh : item.labelEn}</span>
            ${badge}
          </a>`;
      }).join('')}
    `).join('');

    document.getElementById('app').innerHTML = `
      <nav id="sidebar">
        <div class="sidebar-header">
          <a href="/api/logout" class="sidebar-logo" style="text-decoration:none;color:inherit;cursor:pointer;" title="退出登录">
            <div class="sidebar-logo-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="sidebar-brand">
              <div class="sidebar-brand-name">PRWP</div>
              <div class="sidebar-brand-version">v1.1 · 2025</div>
            </div>
          </a>
        </div>

        <nav class="sidebar-nav">
          ${navHTML}
        </nav>

        <div class="sidebar-footer">
          <a class="nav-item" data-route="admin" onclick="Router.navigate('admin'); return false;" href="#admin" id="nav-admin"
             style="margin-bottom:var(--space-2);">
            <div class="nav-item-dot" style="background:#636366;"></div>
            <span class="nav-item-label">${lang==='zh' ? '⚙️ 数据管理' : '⚙️ Data Admin'}</span>
          </a>
          <div style="font-size:var(--text-xs);color:var(--color-text-tertiary);padding:0 var(--space-3);line-height:1.5;">
            Precision Resistance<br>Welding Platform
          </div>
        </div>
      </nav>

      <div id="main">
        <header id="topbar">
          <div class="topbar-breadcrumb">
            <span>PRWP</span>
            <span class="sep">/</span>
            <span class="current" id="topbar-current">Overview</span>
          </div>
          <div class="topbar-actions">
            <div class="lang-toggle">
              <button class="lang-btn ${lang==='zh'?'active':''}" id="lang-zh" onclick="App.setLang('zh')">中文</button>
              <button class="lang-btn ${lang==='en'?'active':''}" id="lang-en" onclick="App.setLang('en')">EN</button>
            </div>
          </div>
        </header>

        <main id="page-content">
          <div class="page-loading">Loading...</div>
        </main>
      </div>
    `;
  },

  registerRoutes() {
    Router.register('dashboard',       () => this.loadPage(DashboardPage.render(), 'PRWP Overview', DashboardPage));
    Router.register('material',        () => this.loadPage(MaterialPage.render(),  'Material Library / 材料库', MaterialPage));
    Router.register('interface',       () => this.loadPage(InterfacePage.render(), 'Interface Library / 界面库', InterfacePage));
    Router.register('failure',         () => this.loadPage(FailurePage.render(),   'Failure Library / 失效库', FailurePage));
    Router.register('process',         () => this.loadPage(ProcessPage.render(),   'Process Templates / 工艺模板', ProcessPage));
    Router.register('knowledge-chain', () => this.loadPage(KnowledgeChainPage.render(), 'Knowledge Chain / 知识推导链', KnowledgeChainPage));
    Router.register('admin',           () => this.loadPage(AdminPage.render(),     'Data Admin / 数据管理', AdminPage));

    ['power','head','electrode','sensor','waveform','doe','production','emc','software','ai','cases']
      .forEach(key => Router.register(key, () => this.loadPage(PlaceholderPage.render(key), key)));

    Router.register('404', () => this.loadPage('<div class="page-inner"><h1 style="margin-top:4rem;">404 — Not Found</h1></div>', '404'));
  },

  loadPage(html, title, page) {
    const content = document.getElementById('page-content');
    content.innerHTML = html;
    content.scrollTop = 0;
    const el = document.getElementById('topbar-current');
    if (el) el.textContent = title;
    // Call afterRender if page provides it
    if (page && typeof page.afterRender === 'function') {
      setTimeout(() => page.afterRender(), 0);
    }
  },

  setLang(lang) {
    i18n.setLang(lang);
    this.renderShell();
    this.registerRoutes();
    Router.resolve();
  },

  bindEvents() {
    Store.onChange(() => {
      // Auto-refresh stats on dashboard if currently viewing it
      if (Router.getCurrent() === 'dashboard') Router.resolve();
    });
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
