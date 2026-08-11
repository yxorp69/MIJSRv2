(function() {
  'use strict';

  const CONFIG = {
    version: '3.0.0',
    defaultKeybind: 'Control+Shift+M',
    localStorageKey: 'mijsr_state',
    cdnBase: 'https://cdn.jsdelivr.net/gh/yxorp69/MIJSRv2@latest'
  };

  let state = {
    open: false,
    width: 400,
    activeTab: 'code',
    keybind: CONFIG.defaultKeybind,
    consoleLogs: [],
    filterLevel: 'all',
    approvedApps: JSON.parse(localStorage.getItem('mijsr_approved') || '[]')
  };

  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG.localStorageKey));
    if (saved) {
      state = { ...state, ...saved };
    }
  } catch (_) {}

  if (!localStorage.getItem('mijsr_first_run')) {
    state.open = false;
    localStorage.setItem('mijsr_first_run', 'true');
  } else {
    state.open = false;
  }

  let sidebar, resizeHandle, panels, tabs, consoleContainer;

  function saveState() {
    try {
      localStorage.setItem(CONFIG.localStorageKey, JSON.stringify(state));
    } catch (_) {}
  }

  function icon(faClass, emoji) {
    if (window.__faFailed) return `<span class="mijsr-emoji">${emoji}</span>`;
    return `<i class="fas ${faClass}"></i>`;
  }

  function loadFontAwesome() {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
      link.onload = () => { window.__faFailed = false; resolve(); };
      link.onerror = () => { window.__faFailed = true; resolve(); };
      document.head.appendChild(link);
      setTimeout(() => {
        if (window.__faFailed === undefined) window.__faFailed = true;
        resolve();
      }, 3000);
    });
  }

  function renderSidebar() {
    if (!sidebar) return;
    sidebar.style.display = state.open ? 'flex' : 'none';
    sidebar.style.width = state.width + 'px';
    document.querySelectorAll('.mijsr-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === state.activeTab);
    });
    document.querySelectorAll('.mijsr-panel').forEach(panel => {
      panel.style.display = panel.id === `mijsrPanel${capitalize(state.activeTab)}` ? 'block' : 'none';
    });
    renderConsole();
    renderApps();
    renderSettings();
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function renderConsole() {
    const container = document.getElementById('mijsrConsoleContainer');
    if (!container) return;
    const filtered = state.consoleLogs.filter(log => state.filterLevel === 'all' || log.level === state.filterLevel);
    container.innerHTML = filtered.map(log => `
      <div class="mijsr-log-entry ${log.level}">
        <span class="mijsr-log-time">${new Date(log.timestamp).toLocaleTimeString()}</span>
        <span class="mijsr-log-level">[${log.level.toUpperCase()}]</span>
        <span class="mijsr-log-message">${escapeHtml(log.message)}</span>
      </div>
    `).join('');
    container.scrollTop = container.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  let appsList = [];

  async function fetchApps() {
    try {
      const resp = await fetch(`${CONFIG.cdnBase}/apps/apps.json`);
      if (!resp.ok) throw new Error('Failed to fetch apps');
      appsList = await resp.json();
      renderApps();
    } catch (e) {
      document.getElementById('mijsrAppsContainer').innerHTML = `<p class="mijsr-error">⚠️ Could not load apps: ${e.message}</p>`;
    }
  }

  function renderApps() {
    const container = document.getElementById('mijsrAppsContainer');
    if (!container) return;
    if (!appsList.length) {
      container.innerHTML = '<p class="mijsr-muted">Loading apps…</p>';
      return;
    }
    container.innerHTML = appsList.map(app => `
      <div class="mijsr-app-card">
        <div class="mijsr-app-info">
          <div class="mijsr-app-name">${escapeHtml(app.name)}</div>
          <div class="mijsr-app-desc">${escapeHtml(app.description || '')}</div>
          <div class="mijsr-app-meta">by ${escapeHtml(app.author || 'unknown')} • v${escapeHtml(app.version || '1.0')}</div>
        </div>
        <button class="mijsr-app-run" data-app="${escapeHtml(app.name)}" data-url="${escapeHtml(app.url)}">${icon('fa-play', '▶️')} Run</button>
      </div>
    `).join('');

    container.querySelectorAll('.mijsr-app-run').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.url;
        const name = btn.dataset.app;
        const app = appsList.find(a => a.name === name);
        if (app) showApprovalModal(app);
      });
    });
  }

  function showApprovalModal(app) {
    const modal = document.getElementById('mijsrModal');
    const content = document.getElementById('mijsrModalContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="mijsr-modal-header">
        <span class="mijsr-modal-title">🔐 Approve App</span>
        <button class="mijsr-modal-close" id="mijsrModalClose">✕</button>
      </div>
      <div class="mijsr-modal-body">
        <p><strong>${escapeHtml(app.name)}</strong> (v${escapeHtml(app.version || '1.0')})</p>
        <p class="mijsr-modal-desc">${escapeHtml(app.description || 'No description provided.')}</p>
        <p class="mijsr-modal-meta">Author: ${escapeHtml(app.author || 'unknown')}</p>
        <p class="mijsr-modal-warning">⚠️ This app will run arbitrary JavaScript. Only approve if you trust the source.</p>
      </div>
      <div class="mijsr-modal-footer">
        <button class="mijsr-btn-secondary" id="mijsrModalCancel">Cancel</button>
        <button class="mijsr-btn-primary" id="mijsrModalApprove">✅ Approve & Run</button>
      </div>
    `;

    modal.style.display = 'flex';

    document.getElementById('mijsrModalClose').addEventListener('click', () => { modal.style.display = 'none'; });
    document.getElementById('mijsrModalCancel').addEventListener('click', () => { modal.style.display = 'none'; });
    document.getElementById('mijsrModalApprove').addEventListener('click', () => {
      modal.style.display = 'none';
      if (!state.approvedApps.includes(app.name)) {
        state.approvedApps.push(app.name);
        localStorage.setItem('mijsr_approved', JSON.stringify(state.approvedApps));
      }
      loadAndRunApp(app.url);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  async function loadAndRunApp(url) {
    try {
      const fullUrl = url.startsWith('http') ? url : `${CONFIG.cdnBase}/apps/${url}`;
      const resp = await fetch(fullUrl);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const code = await resp.text();
      new Function(code)();
      addConsoleLog(`✅ App loaded from ${fullUrl}`, 'log');
    } catch (e) {
      addConsoleLog(`❌ Failed to load app: ${e.message}`, 'error');
    }
  }

  function renderSettings() {
    const container = document.getElementById('mijsrSettingsContainer');
    if (!container) return;
    container.innerHTML = `
      <div class="mijsr-setting-group">
        <label for="mijsrKeybind">Keyboard shortcut</label>
        <input type="text" id="mijsrKeybind" value="${state.keybind}" placeholder="e.g. Ctrl+Shift+M" />
        <p class="mijsr-hint">Press the keys you want, or type them manually.</p>
      </div>
      <div class="mijsr-setting-group">
        <button class="mijsr-btn-danger" id="mijsrDestroy">💣 Destroy MIJSR</button>
        <p class="mijsr-hint">Removes the sidebar and clears all data.</p>
      </div>
    `;

    const input = document.getElementById('mijsrKeybind');
    input.addEventListener('keydown', (e) => {
      e.preventDefault();
      const keys = [];
      if (e.ctrlKey) keys.push('Control');
      if (e.shiftKey) keys.push('Shift');
      if (e.altKey) keys.push('Alt');
      if (e.metaKey) keys.push('Meta');
      if (!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
        keys.push(e.key);
      }
      const combo = keys.join('+');
      input.value = combo;
      state.keybind = combo;
      saveState();
      setupKeyListener();
    });

    document.getElementById('mijsrDestroy').addEventListener('click', () => {
      if (confirm('Destroy MIJSR and clear all data?')) {
        localStorage.removeItem(CONFIG.localStorageKey);
        localStorage.removeItem('mijsr_first_run');
        localStorage.removeItem('mijsr_approved');
        if (sidebar) sidebar.remove();
        document.removeEventListener('keydown', keyListener);
        delete window.MIJSR;
      }
    });
  }

  function addConsoleLog(message, level = 'log') {
    state.consoleLogs.push({ message, level, timestamp: Date.now() });
    if (state.consoleLogs.length > 500) state.consoleLogs.shift();
    saveState();
    if (state.activeTab === 'console') renderConsole();
  }

  function hookConsole() {
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;

    console.log = function(...args) {
      origLog.apply(console, args);
      addConsoleLog(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), 'log');
    };
    console.warn = function(...args) {
      origWarn.apply(console, args);
      addConsoleLog(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), 'warn');
    };
    console.error = function(...args) {
      origError.apply(console, args);
      addConsoleLog(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), 'error');
    };
  }

  let keyListener = null;

  function setupKeyListener() {
    if (keyListener) document.removeEventListener('keydown', keyListener);
    keyListener = (e) => {
      const combo = [];
      if (e.ctrlKey) combo.push('Control');
      if (e.shiftKey) combo.push('Shift');
      if (e.altKey) combo.push('Alt');
      if (e.metaKey) combo.push('Meta');
      if (!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
        combo.push(e.key);
      }
      const pressed = combo.join('+');
      if (pressed === state.keybind) {
        e.preventDefault();
        state.open = !state.open;
        saveState();
        renderSidebar();
      }
    };
    document.addEventListener('keydown', keyListener);
  }

  async function buildUI() {
    loadFontAwesome();

    sidebar = document.createElement('div');
    sidebar.id = 'mijsrSidebar';
    sidebar.style.display = 'none';

    resizeHandle = document.createElement('div');
    resizeHandle.className = 'mijsr-resize-handle';
    sidebar.appendChild(resizeHandle);

    sidebar.innerHTML += `
      <div class="mijsr-header">
        <span class="mijsr-title">📦 MIJSR</span>
        <button class="mijsr-close-btn" id="mijsrToggle">✕</button>
      </div>
      <div class="mijsr-tabs">
        <button class="mijsr-tab-btn active" data-tab="code">${icon('fa-code', '✏️')} Code</button>
        <button class="mijsr-tab-btn" data-tab="apps">${icon('fa-th-large', '📱')} Apps</button>
        <button class="mijsr-tab-btn" data-tab="console">${icon('fa-terminal', '📋')} Console</button>
        <button class="mijsr-tab-btn" data-tab="settings">${icon('fa-cog', '⚙️')} Settings</button>
      </div>
      <div class="mijsr-panels">
        <div id="mijsrPanelCode" class="mijsr-panel">
          <div class="mijsr-panel-header">✏️ Code Editor</div>
          <textarea id="mijsrCodeInput" placeholder="// Write your JavaScript here…" spellcheck="false"></textarea>
          <div class="mijsr-code-actions">
            <button id="mijsrRunCode">▶️ Run</button>
            <button id="mijsrImportCode">📂 Import</button>
            <button id="mijsrExportCode">💾 Export</button>
          </div>
          <div id="mijsrCodeOutput" class="mijsr-code-output"></div>
        </div>
        <div id="mijsrPanelApps" class="mijsr-panel" style="display:none;">
          <div class="mijsr-panel-header">📱 Apps</div>
          <div id="mijsrAppsContainer"><p class="mijsr-muted">Loading apps…</p></div>
        </div>
        <div id="mijsrPanelConsole" class="mijsr-panel" style="display:none;">
          <div class="mijsr-panel-header">
            <span>📋 Console</span>
            <div>
              <select id="mijsrConsoleFilter">
                <option value="all">All</option>
                <option value="log">Log</option>
                <option value="warn">Warn</option>
                <option value="error">Error</option>
              </select>
              <button id="mijsrClearConsole">🗑️ Clear</button>
            </div>
          </div>
          <div id="mijsrConsoleContainer" class="mijsr-console-container"></div>
        </div>
        <div id="mijsrPanelSettings" class="mijsr-panel" style="display:none;">
          <div class="mijsr-panel-header">⚙️ Settings</div>
          <div id="mijsrSettingsContainer"></div>
        </div>
      </div>
      <div id="mijsrModal" class="mijsr-modal" style="display:none;">
        <div id="mijsrModalContent" class="mijsr-modal-content"></div>
      </div>
    `;

    document.body.appendChild(sidebar);

    tabs = sidebar.querySelectorAll('.mijsr-tab-btn');
    panels = sidebar.querySelectorAll('.mijsr-panel');
    consoleContainer = document.getElementById('mijsrConsoleContainer');

    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeTab = btn.dataset.tab;
        saveState();
        renderSidebar();
        if (state.activeTab === 'console') {
          const container = document.getElementById('mijsrConsoleContainer');
          if (container) container.scrollTop = container.scrollHeight;
        }
        if (state.activeTab === 'apps' && !appsList.length) fetchApps();
      });
    });

    document.getElementById('mijsrToggle').addEventListener('click', () => {
      state.open = !state.open;
      saveState();
      renderSidebar();
    });

    document.getElementById('mijsrRunCode').addEventListener('click', () => {
      const code = document.getElementById('mijsrCodeInput').value;
      try {
        const result = new Function(code)();
        const output = document.getElementById('mijsrCodeOutput');
        output.innerHTML = `<div class="mijsr-success">✅ Result: ${escapeHtml(String(result ?? 'undefined'))}</div>`;
      } catch (e) {
        document.getElementById('mijsrCodeOutput').innerHTML = `<div class="mijsr-error">❌ ${escapeHtml(e.message)}</div>`;
      }
    });

    document.getElementById('mijsrImportCode').addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.js,.txt';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          document.getElementById('mijsrCodeInput').value = ev.target.result;
        };
        reader.readAsText(file);
      };
      input.click();
    });

    document.getElementById('mijsrExportCode').addEventListener('click', () => {
      const code = document.getElementById('mijsrCodeInput').value;
      const blob = new Blob([code], { type: 'application/javascript' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'mijsr-script.js';
      a.click();
      URL.revokeObjectURL(a.href);
    });

    document.getElementById('mijsrConsoleFilter').addEventListener('change', (e) => {
      state.filterLevel = e.target.value;
      saveState();
      renderConsole();
    });

    document.getElementById('mijsrClearConsole').addEventListener('click', () => {
      state.consoleLogs = [];
      saveState();
      renderConsole();
    });

    let isResizing = false;
    resizeHandle.addEventListener('mousedown', (e) => {
      isResizing = true;
      document.addEventListener('mousemove', onResize);
      document.addEventListener('mouseup', () => {
        isResizing = false;
        document.removeEventListener('mousemove', onResize);
      });
    });
    function onResize(e) {
      if (!isResizing) return;
      let newWidth = e.clientX - sidebar.getBoundingClientRect().left;
      newWidth = Math.min(Math.max(newWidth, 250), 800);
      state.width = newWidth;
      saveState();
      sidebar.style.width = newWidth + 'px';
    }

    hookConsole();
    setupKeyListener();
    fetchApps();
    renderSidebar();

    window.MIJSR = { state, renderSidebar, addConsoleLog };
    addConsoleLog(`🚀 MIJSR v${CONFIG.version} loaded`, 'log');
    addConsoleLog(`💡 Press ${state.keybind} to toggle sidebar`, 'log');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();