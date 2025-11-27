// inject.js
(async function () {
  const GITHUB_REPO = 'yxorp69/MIJSRv2';
  const BASE_URL = `https://cdn.jsdelivr.net/gh/${GITHUB_REPO}`;
  const SIDEBAR_CSS = `${BASE_URL}/sidebar.css`;
  const APPS_JSON = `${BASE_URL}/apps/apps.json`;

  // Load external CSS into the document
  function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    document.head.appendChild(link);
  }

  // Create a resizable horizontal sidebar
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
      width: 300px;
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
      }
    }

    function stopResize() {
      document.documentElement.removeEventListener('mousemove', resize);
      document.documentElement.removeEventListener('mouseup', stopResize);
    }
  }

  // Create tabs with dynamic rendering for each section
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

  // Event handler to activate and render content for each tab
  function activateTab(tabName) {
    const contentArea = document.querySelector('#mijsr-tab-content');
    contentArea.innerHTML = '';
    switch (tabName) {
      case 'Code':
        renderCodeTab(contentArea);
        break;
      case 'Apps':
        renderAppsTab(contentArea);
        break;
      case 'Console':
        renderConsoleTab(contentArea);
        break;
      case 'Settings':
        renderSettingsTab(contentArea);
        break;
      default:
        console.log(`Unknown tab: ${tabName}`);
    }
  }

  function renderCodeTab(container) {
    container.innerHTML = `
      <textarea id="mijsr-code-input" placeholder="Write your JavaScript here" style="width: 100%; height: 100%;"></textarea>
      <input type="file" id="mijsr-code-file" />
    `;

    const fileInput = container.querySelector('#mijsr-code-file');
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const codeArea = container.querySelector('#mijsr-code-input');
          codeArea.value = event.target.result;
        };
        reader.readAsText(file);
      }
    });
  }

  async function renderAppsTab(container) {
    try {
      const response = await fetch(APPS_JSON);
      const apps = await response.json();
      container.innerHTML = apps
        .map(
          (app) => `
        <div class="mijsr-app">
          <strong>${app.name}</strong>
          <p>${app.description}</p>
          <button onclick="loadApp('${app.url}')">Run</button>
        </div>
      `
        )
        .join('');
    } catch (error) {
      container.innerText = 'Error loading apps.json';
      console.error(error);
    }
  }

  function renderConsoleTab(container) {
    container.innerHTML = `
      <div id="mijsr-console-logs" style="height: 80%; overflow: auto; background: #333; color: #fff; padding: 5px;"></div>
      <label><input type="checkbox" id="mijsr-capture-all" /> Capture all logs</label>
      <div id="mijsr-log-filters"></div>
    `;

    const logContainer = container.querySelector('#mijsr-console-logs');
    console.log = (msg) => {
      const timestamp = new Date().toLocaleTimeString();
      logContainer.innerHTML += `<div>(${timestamp}) ${msg}</div>`;
    };
  }

  function renderSettingsTab(container) {
    container.innerHTML = `
      <button id="mijsr-destroy">Destroy Sidebar</button>
    `;

    const destroyButton = container.querySelector('#mijsr-destroy');
    destroyButton.addEventListener('click', () => {
      document.querySelector('#mijsr-sidebar').remove();
    });
  }

  // Initialize the script
  (function initialize() {
    if (document.querySelector('#mijsr-sidebar')) return; // Prevent duplicate injection
    loadCSS(SIDEBAR_CSS);
    createSidebar();
    createTabs();
    activateTab('Code'); // Default active tab
  })();
})();