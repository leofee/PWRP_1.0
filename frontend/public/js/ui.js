/* ============================================================
   PRWP UI Helpers — Modal, Toast, Confirm, TagsInput
   ============================================================ */

const UI = (() => {

  /* ---- Toast ---- */
  const _ensureToastContainer = () => {
    let c = document.getElementById('toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'toast-container';
      c.className = 'toast-container';
      document.body.appendChild(c);
    }
    return c;
  };

  const toast = (message, type = 'default', duration = 3000) => {
    const container = _ensureToastContainer();
    const icons = { success: '✓', error: '✕', default: 'ℹ' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${icons[type] || icons.default}</span><span>${message}</span>`;
    container.appendChild(el);
    setTimeout(() => {
      el.style.animation = 'toastOut 0.25s var(--ease-out) forwards';
      setTimeout(() => el.remove(), 260);
    }, duration);
  };

  /* ---- Modal ---- */
  let _modalEl = null;

  const modal = ({ title, subtitle = '', body, size = '', onConfirm, confirmText = '保存 / Save',
                   cancelText = '取消 / Cancel', showCancel = true, showConfirm = true }) => {
    closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-overlay';

    overlay.innerHTML = `
      <div class="modal ${size ? 'modal-' + size : ''}" id="modal-box" role="dialog">
        <div class="modal-header">
          <div>
            <div class="modal-title">${title}</div>
            ${subtitle ? `<div class="modal-subtitle">${subtitle}</div>` : ''}
          </div>
          <button class="modal-close" id="modal-close-btn" aria-label="Close">✕</button>
        </div>
        <div class="modal-body" id="modal-body">
          ${typeof body === 'string' ? body : ''}
        </div>
        ${(showCancel || showConfirm) ? `
        <div class="modal-footer">
          ${showCancel ? `<button class="btn btn-secondary" id="modal-cancel">${cancelText}</button>` : ''}
          ${showConfirm ? `<button class="btn btn-primary" id="modal-confirm">${confirmText}</button>` : ''}
        </div>
        ` : ''}
      </div>
    `;

    document.body.appendChild(overlay);
    _modalEl = overlay;

    // Inject non-string body
    if (body && typeof body !== 'string') {
      document.getElementById('modal-body').appendChild(body);
    }

    // Events
    overlay.querySelector('#modal-close-btn').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

    if (showCancel) {
      overlay.querySelector('#modal-cancel')?.addEventListener('click', closeModal);
    }
    if (showConfirm && onConfirm) {
      overlay.querySelector('#modal-confirm')?.addEventListener('click', () => {
        onConfirm(overlay);
      });
    }

    // Keyboard
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', onKey);
    overlay._cleanup = () => document.removeEventListener('keydown', onKey);

    return overlay;
  };

  const closeModal = () => {
    if (_modalEl) {
      _modalEl._cleanup?.();
      _modalEl.remove();
      _modalEl = null;
    }
  };

  /* ---- Confirm Dialog ---- */
  const confirm = ({ title, desc, onConfirm, danger = false }) => {
    modal({
      title: '',
      body: `
        <div class="confirm-icon">${danger ? '⚠️' : '❓'}</div>
        <div class="confirm-title">${title}</div>
        <div class="confirm-desc">${desc}</div>
      `,
      size: 'sm',
      confirmText: danger ? '确认删除 / Delete' : '确认 / Confirm',
      onConfirm: () => { closeModal(); onConfirm(); },
    });
    document.querySelector('.modal')?.classList.add('confirm-modal');
  };

  /* ---- Tags Input ---- */
  const tagsInput = (container, initialTags = [], placeholder = '输入后按 Enter') => {
    let tags = [...initialTags];

    const render = () => {
      container.innerHTML = `
        <div class="tags-input-wrapper" id="tags-wrapper">
          ${tags.map((tag, i) => `
            <span class="tags-input-tag">
              ${tag}
              <span class="tags-input-tag-remove" data-idx="${i}">×</span>
            </span>
          `).join('')}
          <input class="tags-input-field" placeholder="${tags.length === 0 ? placeholder : ''}">
        </div>
        <div class="tags-input-hint">按 Enter 或逗号添加标签 / Press Enter or comma to add</div>
      `;

      container.querySelectorAll('.tags-input-tag-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          tags.splice(parseInt(btn.dataset.idx), 1);
          render();
        });
      });

      const input = container.querySelector('.tags-input-field');
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          const val = input.value.trim().replace(/,$/, '');
          if (val && !tags.includes(val)) { tags.push(val); render(); }
          else input.value = '';
        } else if (e.key === 'Backspace' && input.value === '' && tags.length > 0) {
          tags.pop(); render();
        }
      });

      container.querySelector('#tags-wrapper').addEventListener('click', () => input.focus());
    };

    render();
    return { getTags: () => tags, setTags: (t) => { tags = [...t]; render(); } };
  };

  /* ---- Rating Input ---- */
  const ratingInput = (container, initial = 3, max = 5) => {
    let value = initial;
    const render = () => {
      const labels = ['', '极低', '低', '中', '高', '极高'];
      container.innerHTML = `
        <div class="rating-input">
          ${Array.from({length: max}, (_, i) => `
            <button type="button" class="rating-dot-btn ${i < value ? 'active' : ''}" data-v="${i+1}"></button>
          `).join('')}
          <span class="rating-label">${value}/${max} ${labels[value] || ''}</span>
        </div>
      `;
      container.querySelectorAll('.rating-dot-btn').forEach(btn => {
        btn.addEventListener('click', () => { value = parseInt(btn.dataset.v); render(); });
      });
    };
    render();
    return { getValue: () => value };
  };

  /* ---- File Download ---- */
  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---- File Upload ---- */
  const uploadJSON = (onLoad) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          onLoad(data);
        } catch {
          toast('JSON 格式错误 / Invalid JSON format', 'error');
        }
      };
      reader.readAsText(file);
    });
    input.click();
  };

  /* ---- Admin Password ---- */
  const _PWD_KEY = 'prwp_admin_pwd';
  const _DEFAULT_PWD = '88888888';
  const getAdminPwd = () => localStorage.getItem(_PWD_KEY) || _DEFAULT_PWD;
  const setAdminPwd = (pwd) => localStorage.setItem(_PWD_KEY, pwd);

  const passwordConfirm = ({ title = '管理员验证', desc = '请输入管理员密码以继续', onSuccess }) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal modal-sm" role="dialog">
        <div class="modal-header">
          <div><div class="modal-title">🔐 ${title}</div></div>
          <button class="modal-close" id="pwd-close-btn">✕</button>
        </div>
        <div class="modal-body" style="text-align:center;">
          <div style="font-size:40px;margin-bottom:var(--space-3);">🔐</div>
          <div style="font-size:var(--text-sm);color:var(--color-text-secondary);margin-bottom:var(--space-4);">${desc}</div>
          <input class="form-input" id="pwd-input" type="password" placeholder="管理员密码" autocomplete="new-password" style="text-align:center;letter-spacing:4px;">
          <div id="pwd-error" style="color:var(--color-danger);font-size:var(--text-sm);margin-top:var(--space-2);min-height:20px;"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="pwd-cancel">取消</button>
          <button class="btn btn-primary" id="pwd-ok" style="background:var(--color-danger);">确认删除</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('#pwd-input');
    const errorEl = overlay.querySelector('#pwd-error');
    const close = () => overlay.remove();

    overlay.querySelector('#pwd-close-btn').addEventListener('click', close);
    overlay.querySelector('#pwd-cancel').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    const attempt = () => {
      if (input.value === getAdminPwd()) {
        close();
        onSuccess();
      } else {
        errorEl.textContent = '密码错误，请重试 / Wrong password';
        input.value = '';
        input.focus();
        input.classList.add('input-shake');
        setTimeout(() => input.classList.remove('input-shake'), 400);
      }
    };

    overlay.querySelector('#pwd-ok').addEventListener('click', attempt);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') attempt(); });
    setTimeout(() => input.focus(), 100);
  };

  /* ---- Search Box ---- */
  const searchBox = ({ container, placeholder = '搜索...', getData, getLabel, onSelect }) => {
    container.innerHTML = `
      <div class="search-box-wrap">
        <span class="search-box-icon">🔍</span>
        <input class="search-box-input" id="search-input" placeholder="${placeholder}" autocomplete="off">
        <button class="search-box-clear" id="search-clear" style="display:none;">✕</button>
        <div class="search-dropdown" id="search-dropdown"></div>
      </div>`;

    const input = container.querySelector('#search-input');
    const clearBtn = container.querySelector('#search-clear');
    const dropdown = container.querySelector('#search-dropdown');

    const hideDropdown = () => { dropdown.innerHTML = ''; dropdown.classList.remove('open'); };

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      clearBtn.style.display = q ? 'flex' : 'none';
      if (!q) { hideDropdown(); return; }

      const matches = getData().filter(item =>
        getLabel(item).toLowerCase().includes(q)
      ).slice(0, 8);

      if (!matches.length) {
        dropdown.innerHTML = '<div class="search-no-result">无匹配结果</div>';
      } else {
        dropdown.innerHTML = matches.map(item => {
          const label = getLabel(item);
          const hi = label.replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>');
          return `<div class="search-item" data-id="${item.id}">${hi}</div>`;
        }).join('');
        dropdown.querySelectorAll('.search-item').forEach(el => {
          el.addEventListener('click', () => {
            input.value = '';
            clearBtn.style.display = 'none';
            hideDropdown();
            onSelect(matches.find(m => m.id === el.dataset.id));
          });
        });
      }
      dropdown.classList.add('open');
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.style.display = 'none';
      hideDropdown();
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) hideDropdown();
    }, true);
  };

  return { toast, modal, closeModal, confirm, tagsInput, ratingInput, downloadJSON, uploadJSON,
           getAdminPwd, setAdminPwd, passwordConfirm, searchBox };
})();
