/* PRWP Failure Library Page — with Store + CRUD */
const FailurePage = {
  render() {
    const t = i18n.t.bind(i18n);
    const lang = i18n.getLang();
    const failures = Store.getAll('failures');
    const cards = failures.map((f,i)=>`
      <div class="failure-card animate-in animate-in-delay-${(i%2)+1}" id="fail-card-${f.id}">
        <div class="failure-card-header">
          <div class="failure-icon" style="background:${f.iconBg||'var(--color-warning-light)'};">${f.icon||'⚠️'}</div>
          <div style="flex:1;">
            <div style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--color-text-tertiary);">${f.id}</div>
            <div style="font-size:var(--text-md);font-weight:var(--weight-semibold);color:var(--color-text-primary);">${lang==='zh'?(f.nameZh||f.nameEn):(f.nameEn||f.nameZh)}</div>
            ${lang==='zh'&&f.nameEn?`<div style="font-size:var(--text-xs);color:var(--color-text-tertiary);">${f.nameEn}</div>`:''}
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:var(--space-2);">
            <span class="badge badge-priority-${(f.priority||'p0').toLowerCase()}">${f.priority||'P0'}</span>
            <div class="card-actions">
              <button class="action-btn" onclick="FailurePage.openEdit('${f.id}')">✏️</button>
              <button class="action-btn danger" onclick="FailurePage.confirmDelete('${f.id}')">🗑</button>
            </div>
          </div>
        </div>
        <div class="failure-card-body">
          <div class="failure-section-label">${t('fail.mechanism')}</div>
          <div class="failure-text">${(lang==='zh'?f.physical_mechanism?.zh:f.physical_mechanism?.en)||f.physical_mechanism||'—'}</div>
          <div class="failure-section-label">${t('fail.root_cause')}</div>
          <ul style="list-style:none;display:flex;flex-direction:column;gap:var(--space-1);margin-top:var(--space-1);">
            ${((lang==='zh'?f.root_causes?.zh:f.root_causes?.en)||f.root_causes||[]).map(c=>`<li style="display:flex;gap:var(--space-2);font-size:var(--text-sm);color:var(--color-text-secondary);"><span style="color:var(--color-danger);font-weight:bold;flex-shrink:0;">→</span>${c}</li>`).join('')}
          </ul>
          <div class="failure-section-label">${t('fail.correction')}</div>
          <ul style="list-style:none;display:flex;flex-direction:column;gap:var(--space-1);margin-top:var(--space-1);">
            ${((lang==='zh'?f.corrective_actions?.zh:f.corrective_actions?.en)||f.corrective_actions||[]).map(c=>`<li style="display:flex;gap:var(--space-2);font-size:var(--text-sm);color:var(--color-text-secondary);"><span style="color:var(--color-success);font-weight:bold;flex-shrink:0;">✓</span>${c}</li>`).join('')}
          </ul>
        </div>
      </div>`).join('');
    return `<div class="page-inner animate-in">
      <div class="page-header">
        <div class="page-header-top">
          <div>
            <div style="font-size:var(--text-xs);color:var(--color-text-tertiary);margin-bottom:var(--space-2);font-family:var(--font-mono);">09 / FAILURE LIBRARY</div>
            <h1 class="page-title">${t('fail.title')}</h1>
            <p class="page-subtitle">${t('fail.subtitle')}</p>
          </div>
          <div style="display:flex;align-items:center;gap:var(--space-3);flex-shrink:0;">
            <span class="badge badge-active"><span class="badge-dot"></span>Active</span>
            <span style="font-size:var(--text-sm);color:var(--color-text-tertiary);">${failures.length} records</span>
            <button class="btn-add" id="btn-add-failure" onclick="FailurePage.openAdd()">+ ${lang==='zh'?'新建失效模式':'Add Failure'}</button>
          </div>
        </div>
      </div>
      <div class="section"><div class="grid-2">${failures.length>0?cards:'<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-text">No failure modes yet.</div></div>'}</div></div>
    </div>`;
  },
  _formHTML(f={}) {
    const toLines=(arr)=>Array.isArray(arr)?arr.join('\n'):(arr||'');
    const iconOpts=['💥','❄️','🔒','🔴','⚡','🌀','⚠️','🔥','💧','🕳️'];
    return `<div class="form-grid">
      <div class="form-group"><label class="form-label form-label-required">Failure ID</label><input class="form-input" id="f-id" value="${f.id||''}" placeholder="FAIL-005" ${f.id?'readonly':''}></div>
      <div class="form-group"><label class="form-label">Priority</label><select class="form-select" id="f-priority"><option value="P0" ${f.priority==='P0'?'selected':''}>P0</option><option value="P1" ${f.priority==='P1'?'selected':''}>P1</option><option value="P2" ${f.priority==='P2'?'selected':''}>P2</option></select></div>
      <div class="form-group"><label class="form-label form-label-required">中文名称</label><input class="form-input" id="f-nameZh" value="${f.nameZh||''}" placeholder="飞溅"></div>
      <div class="form-group"><label class="form-label form-label-required">English Name</label><input class="form-input" id="f-nameEn" value="${f.nameEn||''}" placeholder="Weld Splash"></div>
      <div class="form-group"><label class="form-label">Icon</label><select class="form-select" id="f-icon">${iconOpts.map(ic=>`<option value="${ic}" ${f.icon===ic?'selected':''}>${ic}</option>`).join('')}</select></div>
      <div class="form-group"></div>
      <div class="form-section-title">Mechanism / 机制</div>
      <div class="form-group form-grid-1"><label class="form-label">物理机制 (中文)</label><textarea class="form-textarea" id="f-mech-zh">${f.physical_mechanism?.zh||f.physical_mechanism||''}</textarea></div>
      <div class="form-group form-grid-1"><label class="form-label">Physical Mechanism (English)</label><textarea class="form-textarea" id="f-mech-en">${f.physical_mechanism?.en||''}</textarea></div>
      <div class="form-section-title">Root Causes / 根因 (每行一条 / one per line)</div>
      <div class="form-group form-grid-1"><label class="form-label">根因 (中文)</label><textarea class="form-textarea" id="f-causes-zh">${toLines(f.root_causes?.zh||f.root_causes)}</textarea></div>
      <div class="form-group form-grid-1"><label class="form-label">Root Causes (English)</label><textarea class="form-textarea" id="f-causes-en">${toLines(f.root_causes?.en)}</textarea></div>
      <div class="form-section-title">Corrective Actions / 纠正措施 (每行一条)</div>
      <div class="form-group form-grid-1"><label class="form-label">纠正措施 (中文)</label><textarea class="form-textarea" id="f-actions-zh">${toLines(f.corrective_actions?.zh||f.corrective_actions)}</textarea></div>
      <div class="form-group form-grid-1"><label class="form-label">Corrective Actions (English)</label><textarea class="form-textarea" id="f-actions-en">${toLines(f.corrective_actions?.en)}</textarea></div>
    </div>`;
  },
  _openForm(title,f={}) {
    UI.modal({title,subtitle:'Failure Card',size:'lg',body:this._formHTML(f),
      confirmText:i18n.getLang()==='zh'?'保存':'Save',onConfirm:()=>this._save(f.id||null)});
  },
  openAdd(){this._openForm(i18n.getLang()==='zh'?'新建失效模式':'Add Failure Mode');},
  openEdit(id){const f=Store.getById('failures',id);if(f)this._openForm(i18n.getLang()==='zh'?'编辑失效模式':'Edit Failure Mode',f);},
  _save(existingId){
    const val=(id)=>document.getElementById(id)?.value?.trim()||'';
    const lines=(id)=>val(id).split('\n').map(s=>s.trim()).filter(Boolean);
    const data={id:val('f-id')||existingId,nameZh:val('f-nameZh'),nameEn:val('f-nameEn'),icon:val('f-icon')||'⚠️',
      iconBg:'var(--color-warning-light)',priority:val('f-priority'),
      physical_mechanism:{zh:val('f-mech-zh'),en:val('f-mech-en')},
      waveform_signature:{zh:'',en:''},
      root_causes:{zh:lines('f-causes-zh'),en:lines('f-causes-en')},
      corrective_actions:{zh:lines('f-actions-zh'),en:lines('f-actions-en')},
    };
    if(!data.nameZh&&!data.nameEn){UI.toast('请填写名称','error');return;}
    if(existingId){Store.update('failures',existingId,data);}else{Store.add('failures',data);}
    UI.closeModal();UI.toast(existingId?'已更新':'已添加','success');Router.resolve();
  },
  confirmDelete(id){
    const lang=i18n.getLang();const f=Store.getById('failures',id);
    UI.confirm({title:lang==='zh'?`删除 ${f?.nameZh||id}？`:`Delete ${f?.nameEn||id}?`,
      desc:lang==='zh'?'此操作无法撤销。':'This cannot be undone.',danger:true,
      onConfirm:()=>{Store.remove('failures',id);UI.toast('已删除','success');Router.resolve();}
    });
  }
};
