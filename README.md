::: {align="center"}
# **MIJSRv2**

### *by Nope Cheats*

`<br>`{=html}

```{=html}
<!-- Badges -->
```
`<a href="https://github.com/yxorp69/MIJSRv2/releases">`{=html}
`<img src="https://img.shields.io/github/v/release/yxorp69/MIJSRv2?label=Release&style=for-the-badge">`{=html}
`</a>`{=html}
`<a href="https://cdn.jsdelivr.net/gh/yxorp69/MIJSRv2/">`{=html}
`<img src="https://img.shields.io/jsdelivr/gh/hm/yxorp69/MIJSRv2?label=jsDelivr&style=for-the-badge">`{=html}
`</a>`{=html}
`<a href="https://github.com/yxorp69/MIJSRv2/blob/main/LICENSE">`{=html}
`<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge">`{=html}
`</a>`{=html}
:::

------------------------------------------------------------------------

## 📘 Introduction

**MIJSRv2 (Mini In-Browser JavaScript Runner v2)** is a lightweight,
modular, and fully resizable **in-browser JavaScript runner** designed
to be injected into **any webpage**.\
It features a clean sidebar interface with **vertical binder-style
tabs**, modular loading, persistent settings, and a flexible app system
powered by `/apps/apps.json`.

MIJSRv2 offers a streamlined way to write, run, and experiment with
JavaScript directly inside the browser---perfect for debugging,
developing micro-tools, or extending webpages with custom scripts.

------------------------------------------------------------------------

## 📑 Table of Contents

-   [Features](#-features)
-   [Installation / Injection](#-installation--injection)
-   [Usage](#-usage)
-   [Example Apps](#-example-apps)
-   [Development Notes](#-development-notes)
-   [License](#-license)
-   [Future Enhancements](#-future-enhancements)

------------------------------------------------------------------------

## ⭐ Features

-   📏 **Resizable sidebar** with vertical binder-style tab navigation\
-   ✏️ **Code Tab**
    -   Write or paste custom JavaScript\
    -   Import external `.js` files\
    -   Run code instantly\
-   📦 **Apps Tab**
    -   Dynamically loads apps listed in `/apps/apps.json`\
    -   Apps run in isolated execution contexts\
-   🖥️ **Console Tab**
    -   MIJSRv2 internal log output\
    -   Optional browser console capture\
    -   Timestamped logs and filtering\
-   ⚙️ **Settings Tab**
    -   Change toggle keybind\
    -   Destroy/reset sidebar\
    -   Override CDN base URL\
    -   Persistent settings via `localStorage`\
-   🧩 **Modular Assets**
    -   `inject.js`\
    -   `sidebar.css`\
    -   `/apps/apps.json`\
    -   `/apps/*.js`

------------------------------------------------------------------------

## 🚀 Installation / Injection

MIJSRv2 can be injected into **any webpage** using one of two methods.

### **A. Bookmarklet**

``` js
javascript:(()=>{let s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/yxorp69/MIJSRv2/inject.js';document.body.appendChild(s);})();
```

### **B. Console Command**

``` js
(()=>{let s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/yxorp69/MIJSRv2/inject.js';document.body.appendChild(s);})();
```

------------------------------------------------------------------------

## 🧭 Usage

### 🔑 **Toggle Sidebar**

Default keybind: **Ctrl+Shift+M**

------------------------------------------------------------------------

### 📄 **Code Tab**

-   Write/paste JS\
-   Import `.js` files\
-   Run code instantly

------------------------------------------------------------------------

### 📁 **Apps Tab**

-   Loaded via `/apps/apps.json`\
-   Approve app → click **Run**\
-   Executes `/apps/*.js` in isolated context

------------------------------------------------------------------------

### 🖥️ **Console Tab**

-   Shows MIJSRv2 logs\
-   Optional browser console capture\
-   Filters: info / warn / error / debug\
-   Timestamped output

------------------------------------------------------------------------

### ⚙️ **Settings Tab**

-   Change keybind\
-   Reset / destroy sidebar\
-   Override `cdnBase`\
-   Settings persist using `localStorage`

------------------------------------------------------------------------

## 🧪 Example Apps

  App Name       Description
  -------------- -----------------------------
  Hello World    Prints a message to console
  Clock          Live digital clock
  Random Quote   Displays a random quote

Apps config: `/apps/apps.json`\
App scripts: `/apps/*.js`

------------------------------------------------------------------------

## 🛠️ Development Notes

-   All assets load via **jsDelivr** (latest release).\
-   Apps must be **self-contained** and run on load.\
-   Recommended log prefix:

``` js
console.log("[Nope Cheats] App loaded.");
```

------------------------------------------------------------------------

## 📜 License

**MIT License**\
© *Nope Cheats*

------------------------------------------------------------------------

## 🧩 Future Enhancements

-   More Shields.io badges\
-   Branded images / logo banner\
-   Screenshots or demo video\
-   Optional plugin ecosystem
