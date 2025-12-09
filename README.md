<div align="center">

# MIJSRv2  
### *by Nope Cheats*

[![GitHub release](https://img.shields.io/github/v/release/yxorp69/MIJSRv2?style=for-the-badge)](https://github.com/yxorp69/MIJSRv2/releases)
[![License](https://img.shields.io/github/license/yxorp69/MIJSRv2?style=for-the-badge)](https://github.com/yxorp69/MIJSRv2/blob/main/LICENSE)
[![jsDelivr](https://img.shields.io/badge/jsDelivr-CDN-blue?style=for-the-badge)](https://cdn.jsdelivr.net/gh/yxorp69/MIJSRv2@latest/inject.js)
[![GitHub stars](https://img.shields.io/github/stars/yxorp69/MIJSRv2?style=for-the-badge)](https://github.com/yxorp69/MIJSRv2/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yxorp69/MIJSRv2?style=for-the-badge)](https://github.com/yxorp69/MIJSRv2/network)
[![GitHub issues](https://img.shields.io/github/issues/yxorp69/MIJSRv2?style=for-the-badge)](https://github.com/yxorp69/MIJSRv2/issues)

</div>

---

## 📌 Overview

**MIJSRv2 (Mini In-Browser JavaScript Runner v2)** is a lightweight, modular, and resizable in-browser JavaScript runner designed to be injected into any webpage.  
It includes tabs for code execution, apps, console logging, and settings—all in a compact, customizable sidebar.

---

## 🚀 Features

- Resizable sidebar with binder-style vertical tabs.
- **Code Tab** — write, import, and run JavaScript.
- **Apps Tab** — dynamically loads apps from `/apps/apps.json`.
- **Console Tab**
  - Timestamped logs  
  - Browser console capture  
  - Log filtering  
- **Settings Tab**
  - Change keybind  
  - Destroy/reset UI  
  - Persistent settings (localStorage)  
- Modular structure:
  - `inject.js`
  - `sidebar.css`
  - `/apps/apps.json`
  - `/apps/*.js`

---

## 📥 Installation / Injection

### **Bookmarklet**

```
javascript:(function(){var s=document.createElement(‘script’);s.src=‘https://cdn.jsdelivr.net/gh/yxorp69/MIJSRv2@latest/inject.js’;document.body.appendChild(s);})();
```

### **Console Command**

```
var s=document.createElement(‘script’); s.src=‘https://cdn.jsdelivr.net/gh/yxorp69/MIJSRv2@latest/inject.js’; document.body.appendChild(s);
```

---

## 🕹️ Usage

### **Toggle Sidebar**
Default keybind: **Ctrl + Shift + M**

### **Tabs**

#### Code Tab
- Write or paste JS  
- Import `.js` files  
- Run immediately  

#### Apps Tab
- Loads apps from `/apps/apps.json`  
- Approve → Run  

#### Console Tab
- View MIJSRv2 logs  
- Capture browser logs  
- Filter + clear logs  

#### Settings Tab
- Change keybind  
- Override CDN base  
- Destroy/reset  
- Auto-saves via localStorage  

---

## 📂 Example Apps

- **Hello World** — logs a greeting  
- **Clock** — live time display  
- **Random Quote** — shows a random quote  

Apps live in:

```
/apps/apps.json
/apps/*.js
```

---

## 🛠️ Development Notes

- All assets load from jsDelivr using the latest GitHub release.
- Apps should be standalone scripts.
- Use `[Nope Cheats]` log branding.

---

## 📜 License

MIT License  
© Nope Cheats

---

## 📸 Screenshots (Coming Soon)

_Add UI images or GIFs here later._
