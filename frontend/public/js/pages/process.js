/* PRWP Process Template Page — with Store + CRUD */
const ProcessPage = {
  render() {
    const t = i18n.t.bind(i18n);
    const lang = i18n.getLang();
    const templates = Store.getAll('templates');
    const cards = templates.map((tpl,i)=>`
      <div class="template-card animate-in animate-in-delay-${(i%3)+1}" id="tpl-card-${tpl.id}">
        <div class="template-card-top">
          <div class="template-gradient" style="background:${tpl.color||'#0071E3'};"></div>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;position:relative;">
            <div>
              <div class="template-card-id">${tpl.id}</div>
              <div class="template-card-name">${lang==='zh'?(tpl.nameZh||tpl.nameEn):(tpl.nameEn||tpl.nameZh)}</div>
              ${lang==='zh'&&tpl.nameEn?`<div class="template-card-name-en" style="color:var(--color-text-secondary);">${tpl.nameEn}</div>`:''}
            </div>
            <div class="card-actions" style="display:flex;">
              <button class="action-btn" onclick="ProcessPage.openEdit('${tpl.id}')">✏️</button>
              <button class="action-btn danger" onclick="ProcessPage.confirmDelete('${tpl.id}')">🗑</button>
            </div>
          </div>
        </div>
        <div class="template-card-body">
          <div style="margin-bottom:var(--space-4);">
            <div style="font-size:var(--text-xs);color:var(--color-text-tertiary);margin-bottom:var(--space-2);text-transform:uppercase;letter-spacing:0.5px;">${t('proc.control_mode')}</div>
            <div style="font-size:var(--text-sm);font-weight:var(--weight-medium);color:var(--color-accent);">${tpl.control_mode||'—'}</div>
          </div>
          <div class="template-params">
            <div class="template-param"><div class="template-param-label">Current</div><div class="template-param-value" style="font-family:var(--font-mono);font-size:var(--text-xs);">${tpl.key_parameters?.current_range||'—'}</div></div>
            <div class="template-param"><div class="template-param-label">Time</div><div class="template-param-value" style="font-family:var(--font-mono);font-size:var(--text-xs);">${tpl.key_parameters?.weld_time||'—'}</div></div>
            <div class="template-param"><div class="template-param-label">Pressure</div><div class="template-param-value" style="font-family:var(--font-mono);font-size:var(--text-xs);">${tpl.key_parameters?.pressure||'—'}</div></div>
            <div class="template-param"><div class="template-param-label">Frequency</div><div class="template-param-value" style="font-family:var(--font-mono);font-size:var(--text-xs);">${tpl.key_parameters?.frequency||'—'}</div></div>
          </div>
          <div style="margin-top:var(--space-4);">
            <div style="font-size:var(--text-xs);color:var(--color-text-tertiary);margin-bottom:var(--space-2);text-transform:uppercase;letter-spacing:0.5px;">${t('proc.applies_to')}</div>
            <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);">${((lang==='zh'?tpl.applicable_materials:tpl.applicable_en)||[]).map(m=>`<span class="tag">${m}</span>`).join('')}</div>
          </div>
          <div style="margin-top:var(--space-4);padding:var(--space-3);background:var(--color-bg-primary);border-radius:var(--radius-md);">
            <div style="font-size:var(--text-sm);color:var(--color-text-secondary);line-height:1.6;">${(lang==='zh'?tpl.description?.zh:tpl.description?.en)||tpl.description||'—'}</div>
          </div>
        </div>
      </div>`).join('');
    return `<div class="page-inner animate-in">
      <div class="page-header">
        <div class="page-header-top">
          <div>
            <div style="font-size:var(--text-xs);color:var(--color-text-tertiary);margin-bottom:var(--space-2);font-family:var(--font-mono);">03 / PROCESS TEMPLATE LIBRARY</div>
            <h1 class="page-title">${t('proc.title')}</h1>
            <p class="page-subtitle">${t('proc.subtitle')}</p>
          </div>
          <div style="display:flex;align-items:center;gap:var(--space-3);flex-shrink:0;">
            <span class="badge badge-active"><span class="badge-dot"></span>Active</span>
            <span style="font-size:var(--text-sm);color:var(--color-text-tertiary);">${templates.length} records</span>
            <button class="btn-add" id="btn-add-process" onclick="ProcessPage.openAdd()">+ ${lang==='zh'?'新建模板':'Add Template'}</button>
          </div>
        </div>
      </div>
      <div class="section"><div class="grid-3">${templates.length>0?cards:'<div class="empty-state"><div class="empty-state-icon">📐</div><div class="empty-state-text">No templates yet.</div></div>'}</div></div>
    </div>`;
  },
  _formHTML(tpl={}) {
    const kp=tpl.key_parameters||{};
    const toLines=(arr)=>Array.isArray(arr)?arr.join('\n'):(arr||'');
    const modeOpts=['Current Control / 电流控制','Dynamic R Control / 动态电阻控制','Multi-Pulse / 多脉冲','High-Freq Current Control / 高频电流控制','Force + Current Coordinated / 力-电协调控制'];
    return `<div class="form-grid">
      <div class="form-group"><label class="form-label form-label-required">Template ID</label><input class="form-input" id="f-id" value="${tpl.id||''}" placeholder="TPL-006" ${tpl.id?'readonly':''}></div>
      <div class="form-group"><label class="form-label">Color</label><input class="form-input" id="f-color" value="${tpl.color||'#0071E3'}" type="color" style="height:40px;padding:4px;"></div>
      <div class="form-group"><label class="form-label form-label-required">中文名称</label><input class="form-input" id="f-nameZh" value="${tpl.nameZh||''}" placeholder="高导热模板"></div>
      <div class="form-group"><label class="form-label form-label-required">English Name</label><input class="form-input" id="f-nameEn" value="${tpl.nameEn||''}" placeholder="High Conductivity Template"></div>
      <div class="form-group form-grid-1"><label class="form-label">Control Mode</label><select class="form-select" id="f-mode">${modeOpts.map(v=>`<option value="${v}" ${tpl.control_mode===v?'selected':''}>${v}</option>`).join('')}</select></div>
      <div class="form-section-title">Key Parameters</div>
      <div class="form-group"><label class="form-label">Current Range</label><input class="form-input" id="f-current" value="${kp.current_range||''}" placeholder="3–8 kA"></div>
      <div class="form-group"><label class="form-label">Weld Time</label><input class="form-input" id="f-time" value="${kp.weld_time||''}" placeholder="20–80 ms"></div>
      <div class="form-group"><label class="form-label">Pressure</label><input class="form-input" id="f-pressure" value="${kp.pressure||''}" placeholder="300–600 N"></div>
      <div class="form-group"><label class="form-label">Frequency</label><input class="form-input" id="f-freq" value="${kp.frequency||''}" placeholder="1000 Hz"></div>
      <div class="form-section-title">Materials & Description</div>
      <div class="form-group form-grid-1"><label class="form-label">适用材料 (中文，每行一条)</label><textarea class="form-textarea" id="f-mats-zh">${toLines(tpl.applicable_materials)}</textarea></div>
      <div class="form-group form-grid-1"><label class="form-label">Applicable Materials (English, one per line)</label><textarea class="form-textarea" id="f-mats-en">${toLines(tpl.applicable_en)}</textarea></div>
      <div class="form-group form-grid-1"><label class="form-label">Sensor Requirements (one per line)</label><textarea class="form-textarea" style="min-height:60px;" id="f-sensors">${toLines(tpl.sensor_requirements)}</textarea></div>
      <div class="form-group"><label class="form-label">Recommended Electrode</label><input class="form-input" id="f-electrode" value="${tpl.recommended_electrode||''}" placeholder="CuCrZr"></div>
      <div class="form-group"></div>
      <div class="form-group form-grid-1"><label class="form-label">描述 (中文)</label><textarea class="form-textarea" id="f-desc-zh">${tpl.description?.zh||tpl.description||''}</textarea></div>
      <div class="form-group form-grid-1"><label class="form-label">Description (English)</label><textarea class="form-textarea" id="f-desc-en">${tpl.description?.en||''}</textarea></div>
    </div>`;
  },
  _openForm(title,tpl={}) {
    UI.modal({title,subtitle:'Process Template',size:'lg',body:this._formHTML(tpl),
      confirmText:i18n.getLang()==='zh'?'保存':'Save',onConfirm:()=>this._save(tpl.id||null)});
  },
  openAdd(){this._openForm(i18n.getLang()==='zh'?'新建工艺模板':'Add Process Template');},
  openEdit(id){const t=Store.getById('templates',id);if(t)this._openForm(i18n.getLang()==='zh'?'编辑工艺模板':'Edit Template',t);},
  _save(existingId){
    const val=(id)=>document.getElementById(id)?.value?.trim()||'';
    const lines=(id)=>val(id).split('\n').map(s=>s.trim()).filter(Boolean);
    const data={id:val('f-id')||existingId,nameZh:val('f-nameZh'),nameEn:val('f-nameEn'),color:val('f-color'),
      control_mode:val('f-mode'),
      key_parameters:{current_range:val('f-current'),weld_time:val('f-time'),pressure:val('f-pressure'),frequency:val('f-freq')},
      applicable_materials:lines('f-mats-zh'),applicable_en:lines('f-mats-en'),
      sensor_requirements:lines('f-sensors'),recommended_electrode:val('f-electrode'),
      description:{zh:val('f-desc-zh'),en:val('f-desc-en')},
    };
    if(!data.nameZh&&!data.nameEn){UI.toast('请填写名称','error');return;}
    if(existingId){Store.update('templates',existingId,data);}else{Store.add('templates',data);}
    UI.closeModal();UI.toast(existingId?'已更新':'已添加','success');Router.resolve();
  },
  confirmDelete(id){
    const lang=i18n.getLang();const tpl=Store.getById('templates',id);
    UI.confirm({title:lang==='zh'?`删除 ${tpl?.nameZh||id}？`:`Delete ${tpl?.nameEn||id}?`,
      desc:lang==='zh'?'此操作无法撤销。':'This cannot be undone.',danger:true,
      onConfirm:()=>{Store.remove('templates',id);UI.toast('已删除','success');Router.resolve();}
    });
  }
};
