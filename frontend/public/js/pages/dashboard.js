/* ============================================================
   PRWP Dashboard Page
   ============================================================ */

const DashboardPage = {
  render() {
    const t = i18n.t.bind(i18n);
    const lang = i18n.getLang();
    const libs = PLATFORM_DATA.libraries;
    const _s = Store.getStats();
    const stats = {
      materials: _s.materials,
      interfaces: _s.interfaces,
      failures: _s.failures,
      templates: _s.templates,
      activeLibs: libs.filter(l => l.status === 'active').length,
    };

    const statusBadge = (status) => {
      const map = {
        active:  `<span class="badge badge-active"><span class="badge-dot"></span>${t('dash.status.active')}</span>`,
        soon:    `<span class="badge badge-soon"><span class="badge-dot"></span>${t('dash.status.soon')}</span>`,
        planned: `<span class="badge badge-planned"><span class="badge-dot"></span>${t('dash.status.planned')}</span>`,
      };
      return map[status] || '';
    };

    const flowSteps = PLATFORM_DATA.flowSteps;
    const flowHTML = flowSteps.map((s, i) => `
      <div class="pipeline-step">
        <div class="pipeline-node">
          <div class="pipeline-node-icon">${s.icon}</div>
          <div class="pipeline-node-label">${lang === 'zh' ? s.labelZh : s.labelEn}</div>
          <div class="pipeline-node-sub">${lang === 'zh' ? s.subZh : s.subEn}</div>
        </div>
        ${i < flowSteps.length - 1 ? '<div class="pipeline-arrow">→</div>' : ''}
      </div>
    `).join('');

    const libCards = libs.map((lib, i) => `
      <div class="lib-card animate-in animate-in-delay-${(i % 4) + 1}"
           style="--lib-color: ${lib.color}; cursor: pointer;"
           onclick="Router.navigate('${lib.route.replace('#','')}')"
           id="lib-card-${lib.id}">
        <div class="lib-card-number">${lib.id}  ${lib.icon}</div>
        <div class="lib-card-name">${t(lib.nameKey)}</div>
        <div class="lib-card-name-en">${t(lib.enKey)}</div>
        <div class="lib-card-desc">${t(lib.descKey)}</div>
        <div class="lib-card-footer">
          ${statusBadge(lib.status)}
          <span class="lib-card-count">${lib.count > 0 ? `${lib.count} records` : '—'}</span>
        </div>
      </div>
    `).join('');

    return `
      <div class="page-inner animate-in">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-header-top">
            <div>
              <h1 class="page-title">${t('dash.title')}</h1>
              <p class="page-subtitle">${t('dash.subtitle')}</p>
            </div>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="section">
          <div class="grid-4">
            <div class="stat-card animate-in animate-in-delay-1">
              <div class="stat-card-value">${stats.materials}</div>
              <div class="stat-card-label">${t('dash.stats.materials')}</div>
              <div class="stat-card-sub">Material Cards</div>
            </div>
            <div class="stat-card animate-in animate-in-delay-2">
              <div class="stat-card-value">${stats.interfaces}</div>
              <div class="stat-card-label">${t('dash.stats.interfaces')}</div>
              <div class="stat-card-sub">Interface Pairs</div>
            </div>
            <div class="stat-card animate-in animate-in-delay-3">
              <div class="stat-card-value">${stats.failures}</div>
              <div class="stat-card-label">${t('dash.stats.failures')}</div>
              <div class="stat-card-sub">Failure Modes</div>
            </div>
            <div class="stat-card animate-in animate-in-delay-4">
              <div class="stat-card-value">${stats.templates}</div>
              <div class="stat-card-label">${t('dash.stats.templates')}</div>
              <div class="stat-card-sub">Process Templates</div>
            </div>
          </div>
        </div>

        <!-- Core Flow -->
        <div class="section">
          <div class="section-header">
            <div>
              <div class="section-title">${t('dash.flow.title')}</div>
              <div class="section-desc">${t('dash.flow.subtitle')}</div>
            </div>
          </div>
          <div class="card">
            <div class="card-body" style="padding: var(--space-6);">
              <div class="pipeline">
                ${flowHTML}
              </div>
            </div>
          </div>
        </div>

        <!-- 15 Libraries -->
        <div class="section">
          <div class="section-header">
            <div>
              <div class="section-title">${t('dash.libs.title')}</div>
              <div class="section-desc">${t('dash.libs.subtitle')}</div>
            </div>
            <div style="display:flex;gap:var(--space-3);font-size:var(--text-xs);color:var(--color-text-tertiary);align-items:center;">
              <span>${libs.filter(l=>l.status==='active').length} Active</span>
              <span>·</span>
              <span>${libs.filter(l=>l.status==='soon').length} In Dev</span>
              <span>·</span>
              <span>${libs.filter(l=>l.status==='planned').length} Planned</span>
            </div>
          </div>
          <div class="grid-auto">
            ${libCards}
          </div>
        </div>
      </div>
    `;
  }
};
