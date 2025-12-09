/* inject.js — MIJSRv2 (Mini In-Browser JavaScript Runner v2)
   - Modular, maintainable vanilla JS
   - Loads assets via jsDelivr from the same GitHub release as this file
   - Injects a resizable horizontal sidebar with vertical "binder separator" tabs
   - Tabs: Code, Apps, Console, Settings
*/

(() => {
  "use strict";

  const MIJSRv2 = {
    version: "2.0.0",
    appName: "MIJSRv2",
    cdnBase: null,
    state: {
      isOpen: true,
      widthPx: 420,
      dragging: false,
      dragStartX: 0,
      dragStartWidth: 420,
      captureAllConsole: false,
      consoleFilters: { LOG: true, INFO: true, WARN: true, ERROR: true },
      keybind: "Control+Shift+M",
      appsList: [],
      hijacked: false,
    },
    els: {
      container: null,
      tabsRail: null,
      content: null,
      dragHandle: null,
      code: { textarea: null, importInput: null, runBtn: null },
      apps: { list: null, refreshBtn: null },
      console: {
        logsPane: null,
        captureAllCheckbox: null,
        filterLog: null,
        filterInfo: null,
        filterWarn: null,
        filterError: null,
        clearBtn: null,
      },
      settings: {
        keybindInput: null,
        saveBtn: null,
        destroyBtn: null,
        resetBtn: null,
      },
    },
    logs: [],
  };

  // --- Resolve cdnBase -------------------------------------------------------
  (function resolveCdnBase() {
    const scripts = document.getElementsByTagName("script");
    let src = null;
    for (let i = scripts.length - 1; i >= 0; i--) {
      const s = scripts[i];
      if (s.src && s.src.includes("cdn.jsdelivr.net") && s.src.endsWith("/inject.js")) {
        src = s.src;
        break;
      }
    }
    if (!src) {
      for (let i = scripts.length - 1; i >= 0; i--) {
        const s = scripts[i];
        if (s.src && s.src.endsWith("/inject.js")) {
          src = s.src;
          break;
        }
      }
    }
    try {
      const url = new URL(src);
      const parts = url.pathname.split("/");
      parts.pop();
      MIJSRv2.cdnBase = `${url.origin}${parts.join("/")}/`;
    } catch {
      MIJSRv2.cdnBase = "";
    }
  })();

  // --- Storage ---------------------------------------------------------------
  const Storage = {
    key: "MIJSRv2.settings",
    load() {
      try {
        const raw = localStorage.getItem(this.key);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch {
        return null;
      }
    },
    save(data) {
      try {
        localStorage.setItem(this.key, JSON.stringify(data));
      } catch {}
    },
    reset() {
      try {
        localStorage.removeItem(this.key);
      } catch {}
    },
    applyToState() {
      const s = this.load();
      if (!s) return;
      if (typeof s.isOpen === "boolean") MIJSRv2.state.isOpen = s.isOpen;
      if (typeof s.widthPx === "number") MIJSRv2.state.widthPx = s.widthPx;
      if (typeof s.captureAllConsole === "boolean") MIJSRv2.state.captureAllConsole = s.captureAllConsole;
      if (s.consoleFilters) MIJSRv2.state.consoleFilters = { ...MIJSRv2.state.consoleFilters, ...s.consoleFilters };
      if (typeof s.keybind === "string") MIJSRv2.state.keybind = s.keybind;
      if (typeof s.cdnBase === "string" && s.cdnBase) MIJSRv2.cdnBase = s.cdnBase;
    },
    snapshot() {
      return {
        isOpen: MIJSRv2.state.isOpen,
        widthPx: MIJSRv2.state.widthPx,
        captureAllConsole: MIJSRv2.state.captureAllConsole,
        consoleFilters: MIJSRv2.state.consoleFilters,
        keybind: MIJSRv2.state.keybind,
        cdnBase: MIJSRv2.cdnBase,
      };
    },
  };

  // --- Logger & Console capture ----------------------------------------------
  const Logger = {
    log(type, ...args) {
      const ts = new Date();
      MIJSRv2.logs.push({ type, ts, args, origin: "MIJSRv2" });
      UI.renderLogs();
    },
    wrapBrowserConsole() {
      if (MIJSRv2.state.hijacked) return;
      MIJSRv2.state.hijacked = true;
      const orig = {
        log: console.log.bind(console),
        info: console.info.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console),
      };
      console.log = (...args) => {
        if (MIJSRv2.state.captureAllConsole) MIJSRv2.logs.push({ type: "LOG", ts: new Date(), args, origin: "browser" });
        orig.log(...args);
        UI.renderLogs();
      };
      console.info = (...args) => {
        if (MIJSRv2.state.captureAllConsole) MIJSRv2.logs.push({ type: "INFO", ts: new Date(), args, origin: "browser" });
        orig.info(...args);
        UI.renderLogs();
      };
      console.warn = (...args) => {
        if (MIJSRv2.state.captureAllConsole) MIJSRv2.logs.push({ type: "WARN", ts: new Date(), args, origin: "browser" });
        orig.warn(...args);
        UI.renderLogs();
      };
      console.error = (...args) => {
        if (MIJSRv2.state.captureAllConsole) MIJSRv2.logs.push({ type: "ERROR", ts: new Date(), args, origin: "browser" });
        orig.error(...args);
        UI.renderLogs();
      };
      Logger.log("INFO", "Console capture initialized.");
    },
  };

  // --- Loader ----------------------------------------------------------------
  const Loader = {
    loadCSS() {
      if (!MIJSRv2.cdnBase) return;
      const href = MIJSRv2.cdnBase + "sidebar.css";
      if (document.querySelector(`link[data-mijsr="sidebar.css"]`)) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.setAttribute("data-mijsr", "sidebar.css");
      document.head.appendChild(link);
    },
    async fetchJSON(path) {
      const url = MIJSRv2.cdnBase ? MIJSRv2.cdnBase + path : path;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
      return res.json();
    },
    loadScriptByUrl(url) {
      return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = url;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        document.head.appendChild(s);
      });
    },
  };
})();
  // --- UI -------------------------------------------------------------------
  const UI = {
    init() {
      Loader.loadCSS();
      this.buildSidebar();
      this.buildTabs();
      this.attachGlobalKeybind();
      this.applyOpenCloseState();
      this.applyWidth();
      Logger.wrapBrowserConsole();
      Logger.log("INFO", `${MIJSRv2.appName} v${MIJSRv2.version} initialized.`);
    },

    buildSidebar() {
      const container = document.createElement("div");
      container.className = "mijsr-sidebar";
      const tabsRail = document.createElement("div");
      tabsRail.className = "mijsr-tabs-rail";
      const content = document.createElement("div");
      content.className = "mijsr-content";
      const drag = document.createElement("div");
      drag.className = "mijsr-drag-handle";
      drag.title = "Drag to resize";

      container.appendChild(tabsRail);
      container.appendChild(content);
      container.appendChild(drag);
      document.body.appendChild(container);

      MIJSRv2.els.container = container;
      MIJSRv2.els.tabsRail = tabsRail;
      MIJSRv2.els.content = content;
      MIJSRv2.els.dragHandle = drag;

      drag.addEventListener("mousedown", (e) => {
        MIJSRv2.state.dragging = true;
        MIJSRv2.state.dragStartX = e.clientX;
        MIJSRv2.state.dragStartWidth = MIJSRv2.state.widthPx;
        document.body.classList.add("mijsr-dragging");
      });
      document.addEventListener("mousemove", (e) => {
        if (!MIJSRv2.state.dragging) return;
        const dx = MIJSRv2.state.dragStartX - e.clientX;
        const newWidth = Math.max(280, MIJSRv2.state.dragStartWidth + dx);
        MIJSRv2.state.widthPx = newWidth;
        this.applyWidth();
      });
      document.addEventListener("mouseup", () => {
        if (!MIJSRv2.state.dragging) return;
        MIJSRv2.state.dragging = false;
        document.body.classList.remove("mijsr-dragging");
        Storage.save(Storage.snapshot());
      });
    },

    buildTabs() {
      const tabs = [
        { id: "code", label: "Code" },
        { id: "apps", label: "Apps" },
        { id: "console", label: "Console" },
        { id: "settings", label: "Settings" },
      ];

      tabs.forEach((t) => {
        const btn = document.createElement("button");
        btn.className = "mijsr-tab-btn";
        btn.textContent = t.label;
        btn.dataset.tab = t.id;
        btn.addEventListener("click", () => this.showTab(t.id));
        MIJSRv2.els.tabsRail.appendChild(btn);
      });

      const codePanel = this.buildCodePanel();
      const appsPanel = this.buildAppsPanel();
      const consolePanel = this.buildConsolePanel();
      const settingsPanel = this.buildSettingsPanel();

      MIJSRv2.els.content.appendChild(codePanel);
      MIJSRv2.els.content.appendChild(appsPanel);
      MIJSRv2.els.content.appendChild(consolePanel);
      MIJSRv2.els.content.appendChild(settingsPanel);

      this.showTab("code");
    },

    showTab(id) {
      const panels = MIJSRv2.els.content.querySelectorAll(".mijsr-panel");
      panels.forEach((p) => {
        p.style.display = p.dataset.tab === id ? "block" : "none";
      });
      const buttons = MIJSRv2.els.tabsRail.querySelectorAll(".mijsr-tab-btn");
      buttons.forEach((b) => {
        if (b.dataset.tab === id) b.classList.add("active");
        else b.classList.remove("active");
      });
    },

    buildCodePanel() {
      const panel = document.createElement("div");
      panel.className = "mijsr-panel";
      panel.dataset.tab = "code";

      const h = document.createElement("div");
      h.className = "mijsr-panel-header";
      h.textContent = "Run JavaScript";

      const textarea = document.createElement("textarea");
      textarea.className = "mijsr-code-input";
      textarea.placeholder = "// Write or paste JavaScript code here";

      const controls = document.createElement("div");
      controls.className = "mijsr-controls-row";

      const importLabel = document.createElement("label");
      importLabel.className = "mijsr-import-label";
      importLabel.textContent = "Import file:";
      const importInput = document.createElement("input");
      importInput.type = "file";
      importInput.accept = ".js,text/javascript";
      importInput.addEventListener("change", async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
          const text = await file.text();
          textarea.value = text;
          Logger.log("INFO", `Loaded code from file: ${file.name}`);
        } catch (err) {
          Logger.log("ERROR", "Failed to read file:", err);
        }
      });
      importLabel.appendChild(importInput);

      const runBtn = document.createElement("button");
      runBtn.className = "mijsr-btn primary";
      runBtn.textContent = "Run Code";
      runBtn.addEventListener("click", () => {
        const code = textarea.value || "";
        try {
          Logger.log("INFO", "Executing code...");
          const fn = new Function(code);
          const result = fn();
          Logger.log("LOG", "Execution result:", result);
        } catch (err) {
          Logger.log("ERROR", "Execution error:", err);
        }
      });

      controls.appendChild(importLabel);
      controls.appendChild(runBtn);

      panel.appendChild(h);
      panel.appendChild(controls);
      panel.appendChild(textarea);

      MIJSRv2.els.code.textarea = textarea;
      MIJSRv2.els.code.importInput = importInput;
      MIJSRv2.els.code.runBtn = runBtn;

      return panel;
    },

    buildAppsPanel() {
      const panel = document.createElement("div");
      panel.className = "mijsr-panel";
      panel.dataset.tab = "apps";

      const h = document.createElement("div");
      h.className = "mijsr-panel-header";
      h.textContent = "Apps";

      const desc = document.createElement("div");
      desc.className = "mijsr-panel-desc";
      desc.textContent = "Apps are loaded from /apps/apps.json.";

      const controls = document.createElement("div");
      controls.className = "mijsr-controls-row";

      const refreshBtn = document.createElement("button");
      refreshBtn.className = "mijsr-btn";
      refreshBtn.textContent = "Refresh list";
      refreshBtn.addEventListener("click", () => Apps.loadAppsList());

      const list = document.createElement("div");
      list.className = "mijsr-apps-list";

      controls.appendChild(refreshBtn);
      panel.appendChild(h);
      panel.appendChild(desc);
      panel.appendChild(controls);
      panel.appendChild(list);

      MIJSRv2.els.apps.list = list;
      MIJSRv2.els.apps.refreshBtn = refreshBtn;

      setTimeout(() => Apps.loadAppsList(), 0);

      return panel;
    },
    buildConsolePanel() {
      const panel = document.createElement("div");
      panel.className = "mijsr-panel";
      panel.dataset.tab = "console";

      const h = document.createElement("div");
      h.className = "mijsr-panel-header";
      h.textContent = "Console";

      const controls = document.createElement("div");
      controls.className = "mijsr-controls-col";

      const captureAllWrap = document.createElement("label");
      captureAllWrap.className = "mijsr-checkbox";
      const captureAll = document.createElement("input");
      captureAll.type = "checkbox";
      captureAll.checked = MIJSRv2.state.captureAllConsole;
      captureAll.addEventListener("change", () => {
        MIJSRv2.state.captureAllConsole = captureAll.checked;
        Storage.save(Storage.snapshot());
        Logger.log("INFO", `Capture all browser console: ${MIJSRv2.state.captureAllConsole ? "ON" : "OFF"}`);
      });
      const captureAllSpan = document.createElement("span");
      captureAllSpan.textContent = "Capture all browser logs";
      captureAllWrap.appendChild(captureAll);
      captureAllWrap.appendChild(captureAllSpan);

      const filtersRow = document.createElement("div");
      filtersRow.className = "mijsr-controls-row";

      const makeFilter = (label, key) => {
        const wrap = document.createElement("label");
        wrap.className = "mijsr-checkbox";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = MIJSRv2.state.consoleFilters[key];
        cb.addEventListener("change", () => {
          MIJSRv2.state.consoleFilters[key] = cb.checked;
          Storage.save(Storage.snapshot());
          UI.renderLogs();
        });
        const span = document.createElement("span");
        span.textContent = label;
        wrap.appendChild(cb);
        wrap.appendChild(span);
        return { wrap, cb };
      };

      const fLog = makeFilter("LOG", "LOG");
      const fInfo = makeFilter("INFO", "INFO");
      const fWarn = makeFilter("WARN", "WARN");
      const fError = makeFilter("ERROR", "ERROR");

      filtersRow.appendChild(fLog.wrap);
      filtersRow.appendChild(fInfo.wrap);
      filtersRow.appendChild(fWarn.wrap);
      filtersRow.appendChild(fError.wrap);

      const clearBtn = document.createElement("button");
      clearBtn.className = "mijsr-btn";
      clearBtn.textContent = "Clear logs";
      clearBtn.addEventListener("click", () => {
        MIJSRv2.logs = [];
        UI.renderLogs();
      });

      const logsPane = document.createElement("div");
      logsPane.className = "mijsr-logs-pane";

      controls.appendChild(captureAllWrap);
      controls.appendChild(filtersRow);
      controls.appendChild(clearBtn);

      panel.appendChild(h);
      panel.appendChild(controls);
      panel.appendChild(logsPane);

      MIJSRv2.els.console.logsPane = logsPane;
      MIJSRv2.els.console.captureAllCheckbox = captureAll;
      MIJSRv2.els.console.filterLog = fLog.cb;
      MIJSRv2.els.console.filterInfo = fInfo.cb;
      MIJSRv2.els.console.filterWarn = fWarn.cb;
      MIJSRv2.els.console.filterError = fError.cb;
      MIJSRv2.els.console.clearBtn = clearBtn;

      UI.renderLogs();

      return panel;
    },

    renderLogs() {
      const pane = MIJSRv2.els.console.logsPane;
      if (!pane) return;
      const { LOG, INFO, WARN, ERROR } = MIJSRv2.state.consoleFilters;
      pane.innerHTML = "";
      MIJSRv2.logs.forEach((entry) => {
        if (
          (entry.type === "LOG" && !LOG) ||
          (entry.type === "INFO" && !INFO) ||
          (entry.type === "WARN" && !WARN) ||
          (entry.type === "ERROR" && !ERROR)
        ) {
          return;
        }
        const row = document.createElement("div");
        row.className = `mijsr-log-row ${entry.type.toLowerCase()}`;
        const ts = entry.ts.toLocaleTimeString();
        const pre = document.createElement("pre");
        pre.className = "mijsr-log-text";
        pre.textContent = `[${ts}] ${entry.origin} ${entry.type}: ${serializeArgs(entry.args)}`;
        row.appendChild(pre);
        pane.appendChild(row);
      });

      function serializeArgs(args) {
        try {
          return args
            .map((a) =>
              typeof a === "string"
                ? a
                : a instanceof Error
                ? `${a.name}: ${a.message}`
                : JSON.stringify(a)
            )
            .join(" ");
        } catch {
          return args.map((a) => String(a)).join(" ");
        }
      }
    },

    buildSettingsPanel() {
      const panel = document.createElement("div");
      panel.className = "mijsr-panel";
      panel.dataset.tab = "settings";

      const h = document.createElement("div");
      h.className = "mijsr-panel-header";
      h.textContent = "Settings";

      const col = document.createElement("div");
      col.className = "mijsr-controls-col";

      const kbWrap = document.createElement("div");
      kbWrap.className = "mijsr-controls-row";
      const kbLabel = document.createElement("label");
      kbLabel.textContent = "Toggle keybind (e.g., Control+Shift+M):";
      const kbInput = document.createElement("input");
      kbInput.type = "text";
      kbInput.value = MIJSRv2.state.keybind;

      const cdnWrap = document.createElement("div");
      cdnWrap.className = "mijsr-controls-row";
      const cdnLabel = document.createElement("label");
      cdnLabel.textContent = "cdnBase override (optional):";
      const cdnInput = document.createElement("input");
      cdnInput.type = "text";
      cdnInput.placeholder = "https://cdn.jsdelivr.net/gh/OWNER/REPO@TAG/";
      cdnInput.value = MIJSRv2.cdnBase || "";

      const saveBtn = document.createElement("button");
      saveBtn.className = "mijsr-btn primary";
      saveBtn.textContent = "Save settings";
      saveBtn.addEventListener("click", () => {
        MIJSRv2.state.keybind = kbInput.value.trim() || "Control+Shift+M";
        MIJSRv2.cdnBase = cdnInput.value.trim() || MIJSRv2.cdnBase;
        Storage.save(Storage.snapshot());
        Loader.loadCSS();
        Logger.log("INFO", "Settings saved.");
      });

      const destroyBtn = document.createElement("button");
      destroyBtn.className = "mijsr-btn danger";
      destroyBtn.textContent = "Destroy sidebar";
      destroyBtn.addEventListener("click", () => {
        UI.destroy();
        Logger.log("WARN", "Sidebar destroyed.");
      });

      const resetBtn = document.createElement("button");
      resetBtn.className = "mijsr-btn";
      resetBtn.textContent = "Reset to defaults";
      resetBtn.addEventListener("click", () => {
        Storage.reset();
        Logger.log("INFO", "Settings reset. Reinitializing...");
        UI.destroy(false);
        MIJSRv2.state = {
          isOpen: true,
          widthPx: 420,
          dragging: false,
          dragStartX: 0,
          dragStartWidth: 420,
          captureAllConsole: false,
          consoleFilters: { LOG: true, INFO: true, WARN: true, ERROR: true },
          keybind: "Control+Shift+M",
          appsList: [],
          hijacked: true,
        };
        UI.init();
      });

      kbWrap.appendChild(kbLabel);
      kbWrap.appendChild(kbInput);

      cdnWrap.appendChild(cdnLabel);
      cdnWrap.appendChild(cdnInput);

      col.appendChild(kbWrap);
      col.appendChild(cdnWrap);
      col.appendChild(saveBtn);
      col.appendChild(destroyBtn);
      col.appendChild(resetBtn);

      panel.appendChild(h);
      panel.appendChild(col);

      MIJSRv2.els.settings.keybindInput = kbInput;
      MIJSRv2.els.settings.saveBtn = saveBtn;
      MIJSRv2.els.settings.destroyBtn = destroyBtn;
      MIJSRv2.els.settings.resetBtn = resetBtn;

      return panel;
    },

    attachGlobalKeybind() {
      document.addEventListener("keydown", (e) => {
        const desired = MIJSRv2.state.keybind;
        const parts = [];
        if (e.ctrlKey) parts.push("Control");
        if (e.shiftKey) parts.push("Shift");
        if (e.altKey) parts.push("Alt");
        if (e.metaKey) parts.push("Meta");
        const keyName = normalizeKey(e.key);
        if (keyName) parts.push(keyName);
        const combo = parts.join("+");
        if (combo === desired) {
          e.preventDefault();
          UI.toggleOpenClose();
        }
      });

      function normalizeKey(k) {
        if (!k) return "";
        const map = { " ": "Space" };
        const std = map[k] || k;
        if (std.length === 1) return std.toUpperCase();
        return std;
      }
    },

    toggleOpenClose() {
      MIJSRv2.state.isOpen = !MIJSRv2.state.isOpen;
      this.applyOpenCloseState();
      Storage.save(Storage.snapshot());
    },

    applyOpenCloseState() {
      const c = MIJSRv2.els.container;
      if (!c) return;
      if (MIJSRv2.state.isOpen) c.classList.remove("closed");
      else c.classList.add("closed");
    },

    applyWidth() {
      const c = MIJSRv2.els.container;
      if (!c) return;
      c.style.width = `${MIJSRv2.state.widthPx}px`;
    },

    destroy(removeSettings = true) {
      const c = MIJSRv2.els.container;
      if (c && c.parentNode) c.parentNode.removeChild(c);
      MIJSRv2.els = {
        container: null,
        tabsRail: null,
        content: null,
        dragHandle: null,
        code: { textarea: null, importInput: null, runBtn: null },
        apps: { list: null, refreshBtn: null },
        console: {
          logsPane: null,
          captureAllCheckbox: null,
          filterLog: null,
          filterInfo: null,
          filterWarn: null,
          filterError: null,
          clearBtn: null,
        },
        settings: { keybindInput: null, saveBtn: null, destroyBtn: null, resetBtn: null },
      };
      if (removeSettings) Storage.reset();
    },
  };

  // --- Apps ------------------------------------------------------------------
  const Apps = {
    async loadAppsList() {
      try {
        Logger.log("INFO", "Loading apps.json...");
        const data = await Loader.fetchJSON("apps/apps.json");
        if (!Array.isArray(data)) throw new Error("apps.json must be an array of app metadata objects.");
        MIJSRv2.state.appsList = data;
        UI.renderAppsList();
        Logger.log("LOG", `Loaded ${data.length} apps.`);
      } catch (err) {
        Logger.log("ERROR", "Failed to load apps.json:", err);
      }
    },

    async runApp(app) {
      try {
        const url = resolveAppUrl(app);
        Logger.log("INFO", `Loading app script: ${url}`);
        await Loader.loadScriptByUrl(url);
        Logger.log("LOG", `App "${app.name}" loaded.`);
      } catch (err) {
        Logger.log("ERROR", `Failed to run app "${app.name}":`, err);
      }

      function resolveAppUrl(appMeta) {
        if (appMeta.url.startsWith("http://") || appMeta.url.startsWith("https://")) {
          return appMeta.url;
        }
        return MIJSRv2.cdnBase ? MIJSRv2.cdnBase + appMeta.url.replace(/^\//, "") : appMeta.url;
      }
    },
  };

  UI.renderAppsList = function renderAppsList() {
    const list = MIJSRv2.els.apps.list;
    if (!list) return;
    list.innerHTML = "";

    if (!MIJSRv2.state.appsList.length) {
      const empty = document.createElement("div");
      empty.className = "mijsr-empty";
      empty.textContent = "No apps found. Ensure /apps/apps.json is accessible via jsDelivr.";
      list.appendChild(empty);
      return;
    }

    MIJSRv2.state.appsList.forEach((app) => {
      const item = document.createElement("div");
      item.className = "mijsr-app-item";

      const left = document.createElement("div");
      left.className = "mijsr-app-left";

      const meta = document.createElement("div");
      meta.className = "mijsr-app-meta";

      const title = document.createElement("div");
      title.className = "mijsr-app-title";
      title.textContent = `${app.name} (${app.version || "v?"})`;

      const byline = document.createElement("div");
      byline.className = "mijsr-app-byline";
      byline.textContent = app.author ? `By ${app.author}` : "Unknown author";

      const desc = document.createElement("div");
      desc.className = "mijsr-app-desc";
      desc.textContent = app.description || "";

      meta.appendChild(title);
      meta.appendChild(byline);
      meta.appendChild(desc);

      left.appendChild(meta);

      const right = document.createElement("div");
      right.className = "mijsr-app-right";

      const runBtn = document.createElement("button");
      runBtn.className = "mijsr-btn primary";
      runBtn.textContent = "Run";
      runBtn.addEventListener("click", () => Apps.runApp(app));

      right.appendChild(runBtn);

      item.appendChild(left);
      item.appendChild(right);
      list.appendChild(item);
    });
  };

  // --- Initialize ------------------------------------------------------------
  Storage.applyToState();
  UI.init();
})();
