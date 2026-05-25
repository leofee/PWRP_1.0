/* PRWP Interface Library Page — with Store + CRUD */
const InterfacePage = {
  render() {
    const t = i18n.t.bind(i18n);
    const lang = i18n.getLang();
    const interfaces = Store.getAll('interfaces');
    const diffDots=(score)=>Array.from({length:5},(_,i)=>`<div style="width:12px;height:12px;border-radius:50%;background:${i<score?'var(--color-danger)':'var(--color-bg-tertiary)'}"></div>`).join('');
    const cards = interfaces.map((ifc,i)=>`
      <div class="interface-card animate-in animate-in-delay-${(i%2)+1}" id="ifc-card-${ifc.id}">
        <div style="padding:var(--space-4) var(--space-5) 0;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-3);">
            <span style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--color-text-tertiary);">${ifc.id}</span>
            <div style="display:flex;align-items:center;gap:var(--space-2);">
              <span class="badge badge-priority-${(ifc.priority||'p1').toLowerCase()}">${ifc.priority||'P1'}</span>
              <div class="card-actions" style="display:flex;">
                <button class="action-btn" onclick="InterfacePage.openEdit('${ifc.id}')">✏️</button>
                <button class="action-btn danger" onclick="InterfacePage.confirmDelete('${ifc.id}')">🗑</button>
              </div>
            </div>
          </div>
        </div>
        <div class="interface-pair">
          <div class="interface-material">
            <div class="interface-material-name">${ifc.material_a?.name||'—'}</div>
            <div class="interface-material-label">${lang==='zh'?(ifc.material_a?.nameZh||ifc.material_a?.name||''):(ifc.material_a?.name||'')}</div>
          </div>
          <div class="interface-arrow">⇄</div>
          <div class="interface-material">
            <div class="interface-material-name">${ifc.material_b?.name||'—'}</div>
            <div class="interface-material-label">${lang==='zh'?(ifc.material_b?.nameZh||ifc.material_b?.name||''):(ifc.material_b?.name||'')}</div>
          </div>
        </div>
        <div class="interface-card-body">
          <div style="font-size:var(--text-xs);color:var(--color-text-tertiary);margin-bottom:var(--space-3);">${(lang==='zh'?ifc.interface_type?.zh:ifc.interface_type?.en)||ifc.interface_type||'—'}</div>
          <div class="interface-metrics">
            <div class="metric-item"><div style="display:flex;gap:3px;justify-content:center;margin-bottom:4px;">${diffDots(ifc.difficulty_score||3)}</div><div class="metric-label">${t('ifc.heat_diff')}</div></div>
            <div class="metric-item"><div class="metric-value" style="font-size:var(--text-sm);">${(ifc.oxide_risk||'—').split('/')[0].trim()}</div><div class="metric-label">${t('ifc.oxide_risk')}</div></div>
            <div class="metric-item"><div class="metric-value" style="font-size:var(--text-sm);">${(ifc.current_path_stability||'—').split('/')[0].trim()}</div><div class="metric-label">${t('ifc.current_stable')}</div></div>
          </div>
          <div class="field-list">
            <div class="field-row"><span class="field-key">${t('ifc.rec_process')}</span><span class="field-value field-value-mono" style="font-size:var(--text-xs);">${ifc.recommended_process||'—'}</span></div>
          </div>
          <div style="margin-top:var(--space-3);font-size:var(--text-xs);color:var(--color-text-tertiary);line-height:1.6;">${(lang==='zh'?ifc.notes?.zh:ifc.notes?.en)||ifc.notes||''}</div>
        </div>
      </div>`).join('');
    return `<div class="page-inner animate-in">
      <div class="page-header">
        <div class="page-header-top">
          <div>
            <div style="font-size:var(--text-xs);color:var(--color-text-tertiary);margin-bottom:var(--space-2);font-family:var(--font-mono);">02 / INTERFACE LIBRARY</div>
            <h1 class="page-title">${t('ifc.title')}</h1>
            <p class="page-subtitle">${t('ifc.subtitle')}</p>
          </div>
          <div style="display:flex;align-items:center;gap:var(--space-3);flex-shrink:0;">
            <span class="badge badge-active"><span class="badge-dot"></span>Active</span>
            <span style="font-size:var(--text-sm);color:var(--color-text-tertiary);">${interfaces.length} records</span>
            <button class="btn-add" id="btn-add-interface" onclick="InterfacePage.openAdd()">+ ${lang==='zh'?'新建界面':'Add Interface'}</button>
          </div>
        </div>
      </div>
      <div class="section"><div class="grid-2">${interfaces.length>0?cards:'<div class="empty-state"><div class="empty-state-icon">🔗</div><div class="empty-state-text">No interfaces yet.</div></div>'}</div></div>
    </div>`;
  },
  _formHTML(ifc={}) {
    const opts=(vals,cur)=>vals.map(v=>`<option value="${v}" ${cur===v?'selected':''}>${v}</option>`).join('');
    const rOpts=['Very High / 极高','High / 高','Medium / 中','Low / 低','Very Low / 极低'];
    const sOpts=['High / 高','Medium / 中','Low-Medium / 中低','Low / 低'];
    return `<div class="form-grid">
      <div class="form-group"><label class="form-label form-label-required">Interface ID</label><input class="form-input" id="f-id" value="${ifc.id||''}" placeholder="IFC-004" ${ifc.id?'readonly':''}></div>
      <div class="form-group"><label class="form-label">Priority</label><select class="form-select" id="f-priority">${opts(['P0','P1','P2'],ifc.priority||'P1')}</select></div>
      <div class="form-section-title">Material A</div>
      <div class="form-group"><label class="form-label form-label-required">Material A Name</label><input class="form-input" id="f-a-name" value="${ifc.material_a?.name||''}" placeholder="AgSnO₂"></div>
      <div class="form-group"><label class="form-label">Material A 中文名</label><input class="form-input" id="f-a-nameZh" value="${ifc.material_a?.nameZh||''}" placeholder="氧化锡银"></div>
      <div class="form-section-title">Material B</div>
      <div class="form-group"><label class="form-label form-label-required">Material B Name</label><input class="form-input" id="f-b-name" value="${ifc.material_b?.name||''}" placeholder="Cu+Ag"></div>
      <div class="form-group"><label class="form-label">Material B 中文名</label><input class="form-input" id="f-b-nameZh" value="${ifc.material_b?.nameZh||''}" placeholder="铜镀银"></div>
      <div class="form-section-title">Interface Properties</div>
      <div class="form-group form-grid-1"><label class="form-label">界面类型 (中文)</label><input class="form-input" id="f-type-zh" value="${ifc.interface_type?.zh||ifc.interface_type||''}" placeholder="触点-导体界面"></div>
      <div class="form-group form-grid-1"><label class="form-label">Interface Type (English)</label><input class="form-input" id="f-type-en" value="${ifc.interface_type?.en||''}" placeholder="Contact-Conductor Interface"></div>
      <div class="form-group"><label class="form-label">Difficulty Score (1–5)</label><div id="f-diff-wrap"></div></div>
      <div class="form-group"><label class="form-label">Oxide Risk</label><select class="form-select" id="f-oxide">${opts(rOpts,ifc.oxide_risk||'Medium / 中')}</select></div>
      <div class="form-group"><label class="form-label">Current Path Stability</label><select class="form-select" id="f-stability">${opts(sOpts,ifc.current_path_stability||'Medium / 中')}</select></div>
      <div class="form-group"><label class="form-label">Recommended Process</label><input class="form-input" id="f-process" value="${ifc.recommended_process||''}" placeholder="DynamicResistanceControl"></div>
      <div class="form-group form-grid-1"><label class="form-label">备注 (中文)</label><textarea class="form-textarea" id="f-notes-zh">${ifc.notes?.zh||ifc.notes||''}</textarea></div>
      <div class="form-group form-grid-1"><label class="form-label">Notes (English)</label><textarea class="form-textarea" id="f-notes-en">${ifc.notes?.en||''}</textarea></div>
    </div>`;
  },
  _getDiff:null,
  _openForm(title,ifc={}) {
    UI.modal({title,subtitle:'Interface Card',size:'lg',body:this._formHTML(ifc),
      confirmText:i18n.getLang()==='zh'?'保存':'Save',onConfirm:()=>this._save(ifc.id||null)});
    setTimeout(()=>{const w=document.getElementById('f-diff-wrap');if(w){const r=UI.ratingInput(w,ifc.difficulty_score||3);this._getDiff=r.getValue;}},50);
  },
  openAdd(){this._openForm(i18n.getLang()==='zh'?'新建界面卡':'Add Interface Card');},
  openEdit(id){const ifc=Store.getById('interfaces',id);if(ifc)this._openForm(i18n.getLang()==='zh'?'编辑界面卡':'Edit Interface',ifc);},
  _save(existingId){
    const val=(id)=>document.getElementById(id)?.value?.trim()||'';
    const data={id:val('f-id')||existingId,priority:val('f-priority'),
      material_a:{name:val('f-a-name'),nameZh:val('f-a-nameZh')},
      material_b:{name:val('f-b-name'),nameZh:val('f-b-nameZh')},
      interface_type:{zh:val('f-type-zh'),en:val('f-type-en')},
      difficulty_score:this._getDiff?this._getDiff():3,
      oxide_risk:val('f-oxide'),current_path_stability:val('f-stability'),
      recommended_process:val('f-process'),known_failures:[],
      notes:{zh:val('f-notes-zh'),en:val('f-notes-en')},
    };
    if(!data.material_a.name||!data.material_b.name){UI.toast('请填写材料名称','error');return;}
    if(existingId){Store.update('interfaces',existingId,data);}else{Store.add('interfaces',data);}
    UI.closeModal();UI.toast(existingId?'已更新':'已添加','success');Router.resolve();
  },
  confirmDelete(id){
    const lang=i18n.getLang();const ifc=Store.getById('interfaces',id);
    UI.confirm({title:lang==='zh'?`删除界面 ${ifc?.id}？`:`Delete Interface ${ifc?.id}?`,
      desc:lang==='zh'?'此操作无法撤销。':'This cannot be undone.',danger:true,
      onConfirm:()=>{Store.remove('interfaces',id);UI.toast('已删除','success');Router.resolve();}
    });
  }
};
