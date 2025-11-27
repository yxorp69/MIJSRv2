// inject.js
(async function () {
  const GITHUB_REPO = 'yxorp69/MIJSRv2';
  const BASE_URL = `https://cdn.jsdelivr.net/gh/${GITHUB_REPO}@main`;
  const SIDEBAR_CSS = `${BASE_URL}/sidebar.css`;
  const APPS_JSON = `${BASE_URL}/apps/apps.json`;

  // Load external CSS
  function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    document.head.appendChild(link);
  }

  // Sidebar creation
  function createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = 'mijsr-sidebar';
    sidebar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      max-width: 400px;
      min-width: 200px;
      width: ${localStorage.getItem('mijsr-width') || '300px'};
      background-color: #f5f5f5;
      border-right: 1px solid #ccc;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      z-index: 9999;
      display: flex;
      flex-direction: row;
    `;

    const resizer = document.createElement('div');
    resizer.id = 'mijsr-resizer';
    resizer.style.cssText = `
      width: 5px;
      cursor: col-resize;
      background-color: rgba(0, 0, 0, 0.2);
    `;

    const content = document.createElement('div');
    content.id = 'mijsr-content';
    content.style.cssText = `flex: 1; display: flex; flex-direction: column; overflow: auto;`;

    sidebar.appendChild(resizer);
    sidebar.appendChild(content);
    document.body.appendChild(sidebar);

    let startX, startWidth;
    resizer.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      startWidth = sidebar.offsetWidth;
      document.documentElement.addEventListener('mousemove', resize);
      document.documentElement.addEventListener('mouseup', stopResize);
    });

    function resize(e) {
      const newWidth = startWidth + (e.clientX - startX);
      if (newWidth >= 200 && newWidth <= 400) {
        sidebar.style.width = `${newWidth}px`;
        localStorage.setItem('mijsr-width', `${newWidth}px`);
      }
    }

    function stopResize() {
      document.documentElement.removeEventListener('mousemove', resize);
      document.documentElement.removeEventListener('mouseup', stopResize);
    }
  }

  // Tabs
  function createTabs() {
    const tabs = ['Code', 'Apps', 'Console', 'Settings'];
    const tabsContainer = document.createElement('div');
    tabsContainer.id = 'mijsr-tabs';
    tabsContainer.style.cssText = `
      width: 40px;
      background-color: #ddd;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-right: 1px solid #ccc;
    `;

    tabs.forEach((tabName) => {
      const tab = document.createElement('div');
      tab.className = 'mijsr-tab';
      tab.innerText = tabName;
      tab.style.cssText = `
        padding: 10px;
        cursor: pointer;
        text-align: center;
      `;
      tab.addEventListener('click', () => activateTab(tabName));
      tabsContainer.appendChild(tab);
    });

    const content = document.querySelector('#mijsr-content');
    content.appendChild(tabsContainer);
    content.insertAdjacentHTML('beforeend', `<div id="mijsr-tab-content"></div>`);
  }

  // Tab activation
  function activateTab(tabName) {
    const contentArea = document.querySelector('#mijsr-tab-content');
    contentArea.innerHTML = '';
    switch (tabName) {
      case 'Code': renderCodeTab(contentArea); break;
      case 'Apps': renderAppsTab(contentArea); break;
      case 'Console': renderConsoleTab(contentArea); break;
      case 'Settings': renderSettingsTab(contentArea); break;
      default: console.log(`Unknown tab: ${tabName}`);
    }
  }

  // Code Tab
  function renderCodeTab(container) {
    container.innerHTML = `
      <textarea id="mijsr-code-input" placeholder="Write your JavaScript here" style="width: 100%; height: 80%;"></textarea>
      <input type="file" id="mijsr-code-file" />
      <button id="mijsr-run-code">Run Code</button>
    `;

    const fileInput = container.querySelector('#mijsr-code-file');
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          container.querySelector('#mijsr-code-input').value = event.target.result;
        };
        reader.readAsText(file);
      }
    });

    container.querySelector('#mijsr-run-code').addEventListener('click', () => {
      try {
        const code = container.querySelector('#mijsr-code-input').value;
        new Function(code)();
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Apps Tab
  async function renderAppsTab(container) {
    try {
      const response = await fetch(APPS_JSON);
      const apps = await response.json();
      container.innerHTML = apps.map(app => `
        <div class="mijsr-app" style="border-bottom:1px solid #ccc; padding:5px;">
          ${app.icon ? `<img src="${app.icon}" alt="${app.name} icon" style="width:24px;height:24px;vertical-align:middle;margin-right:5px;">` : ''}
          <strong>${app.name}</strong> <small>(v${app.version || '1.0'})</small><br>
          <em>by ${app.author || 'Unknown'}</em>
          <p>${app.description}</p>
          <button onclick="window.mijsrLoadApp('${app.url}')">Run</button>
        </div>
      `).join('');
    } catch (error) {
      container.innerText = 'Error loading apps.json';
      console.error(error);
    }
  }

  window.mijsrLoadApp = function(url) {
    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
  };

  // Console Tab
  function renderConsoleTab(container) {
    container.innerHTML = `
      <div id="mijsr-console-logs" style="height: 80%; overflow: auto; background: #333; color: #fff; padding: 5px;"></div>
      <label><input type="checkbox" id="mijsr-capture-all" /> Capture all logs</label>
      <div>
        <label><input type="checkbox" id="mijsr-filter-error" checked /> ERROR</label>
        <label><input type="checkbox" id="mijsr-filter-warn" checked /> WARN</label>
        <label><input type="checkbox" id="mijsr-filter-info" checked /> INFO</label>
        <label><input type="checkbox" id="mijsr-filter-log" checked /> LOG</label>
      </div>
    `;

    const logContainer = container.querySelector('#mijsr-console-logs');
    const captureAll = container.querySelector('#mijsr-capture-all');

    const original = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info
    };

    function addLog(type, msg) {
      const timestamp = new Date().toLocaleTimeString();
      const filter = container.querySelector(`#mijsr-filter-${type}`);
      if (filter && filter.checked) {
        logContainer.innerHTML += `<div>[${type.toUpperCase()}] (${timestamp}) ${msg}</div>`;
      }
    }

    ['log','warn','error','info'].forEach(type => {
      console[type] = function(...args) {
        if (captureAll.checked || type === 'log') {
          addLog(type, args.join(' '));
        }
        original[type](...args);
      };
    });
  }

  // Settings Tab
  function renderSettingsTab(container) {
    const currentKey = localStorage.getItem('mijsr-keybind') || 'F2';
    container.innerHTML = `
      <label>Toggle Keybind: <input id="mijsr-keybind" value="${currentKey}" /></label>
      <button id="mijsr-save-keybind">Save Keybind</button>
      <button id="mijsr-destroy">Destroy Sidebar</button>
      <button id="mijsr-reset">Reset Defaults</button>
    `;

    container.querySelector('#mijsr-save-keybind').addEventListener('click', () => {
      const
