::: {align="center"}
# **MIJSRv2**

### *by Nope Cheats*

`<br>`{=html}

```{=html}
<!-- Badges -->
```
```{=html}
<p align="center">
```
`<a href="https://github.com/yxorp69/MIJSRv2/releases">`{=html}
`<img src="https://img.shields.io/github/v/release/yxorp69/MIJSRv2?style=for-the-badge" />`{=html}
`</a>`{=html}
`<a href="https://github.com/yxorp69/MIJSRv2/blob/main/LICENSE">`{=html}
`<img src="https://img.shields.io/github/license/yxorp69/MIJSRv2?style=for-the-badge" />`{=html}
`</a>`{=html}
`<a href="https://cdn.jsdelivr.net/gh/yxorp69/MIJSRv2@latest/inject.js">`{=html}
`<img src="https://img.shields.io/badge/jsDelivr-CDN-blue?style=for-the-badge" />`{=html}
`</a>`{=html}
`<a href="https://github.com/yxorp69/MIJSRv2/stargazers">`{=html}
`<img src="https://img.shields.io/github/stars/yxorp69/MIJSRv2?style=for-the-badge" />`{=html}
`</a>`{=html}
`<a href="https://github.com/yxorp69/MIJSRv2/network">`{=html}
`<img src="https://img.shields.io/github/forks/yxorp69/MIJSRv2?style=for-the-badge" />`{=html}
`</a>`{=html}
`<a href="https://github.com/yxorp69/MIJSRv2/issues">`{=html}
`<img src="https://img.shields.io/github/issues/yxorp69/MIJSRv2?style=for-the-badge" />`{=html}
`</a>`{=html}
```{=html}
</p>
```
:::

------------------------------------------------------------------------

## 📌 Overview

**MIJSRv2 (Mini In-Browser JavaScript Runner v2)** is a lightweight,
modular, and fully resizable in-browser JavaScript execution sidebar
designed to be injected into *any website*. It includes dedicated tabs
for code execution, apps, console logging, and settings --- all wrapped
in a clean, organized UI.

Perfect for development, debugging, quick experiments, or running custom
tools on the fly.

------------------------------------------------------------------------

## 🚀 Features

-   **Resizable sidebar** with smooth drag-to-resize support.\
-   **Vertical binder-style navigation tabs** for clean organization.\
-   **Code Tab**
    -   Write, import, and execute custom JavaScript.
    -   Lightweight code runner with instant output and isolation.
-   **Apps Tab**
    -   Dynamically loads apps from `/apps/apps.json`.
    -   Runs standalone JavaScript tools.
-   **Console Tab**
    -   Timestamped logs.
    -   Optional browser console capture.
    -   Log filtering (log, warn, error, system).
    -   Clear logs instantly.
-   **Settings Tab**
    -   Change toggle keybind (default: `Ctrl+Shift+M`).
    -   Modify CDN base URL.
    -   Destroy/reset the sidebar.
    -   LocalStorage persistence for all user settings.
-   **Modular Assets**
    -   `inject.js` --- Main injector script.
    -   `sidebar.css` --- UI styling.
    -   `/apps/apps.json` --- App registry.
    -   `/apps/*.js` --- Individual standalone apps.

------------------------------------------------------------------------

## 📥 Installation / Injection

MIJSRv2 can be injected into **any webpage** using one of two simple
methods.

### **1. Bookmarklet**

Create a new bookmark and set the URL to:

``` js
javascript:(()=>{let s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/yxorp69/MIJSRv2@latest/inject.js';document.body.appendChild(s);})();
```

### **2. Console Command**

Paste this into your browser's developer console:

``` js
javascript:(()=>{let s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/yxorp69/MIJSRv2@latest/inject.js';document.body.appendChild(s);})();
```

------------------------------------------------------------------------

## 🕹️ Usage

### **Toggle the Sidebar**

Press **`Ctrl+Shift+M`** (default) to open or close MIJSRv2.\
This keybind can be changed in **Settings → Keybind**.

------------------------------------------------------------------------

### **Code Tab**

-   Write or paste JavaScript directly.
-   Import `.js` files from your device.
-   Click **Run** to execute immediately inside the target page.

------------------------------------------------------------------------

### **Apps Tab**

-   Loads available apps from `/apps/apps.json`.
-   Apps must be **approved** before execution (safe-loading system).
-   Click **Run App** to launch.

------------------------------------------------------------------------

### **Console Tab**

-   Shows MIJSRv2's internal logs.
-   Can optionally capture all browser console events.
-   Filter by:
    -   `log`
    -   `warn`
    -   `error`
    -   `system`
-   Clear logs with one click.

------------------------------------------------------------------------

### **Settings Tab**

-   Change the sidebar toggle keybind.
-   Override the CDN base for custom hosting.
-   Destroy the sidebar instance.
-   Reset all settings to default.
-   Everything saves automatically thanks to **localStorage
    persistence**.

------------------------------------------------------------------------

## 📂 Example Apps

Starter apps included in `/apps`:

-   **Hello World** --- Prints a friendly message in the console.
-   **Clock** --- Displays the current time updating live.
-   **Random Quote** --- Shows a random motivational quote.

Apps are registered in:

    /apps/apps.json

And implemented as self-contained scripts in:

    /apps/*.js

------------------------------------------------------------------------

## 🛠️ Development Notes

-   All assets load from **jsDelivr** and always pull from the latest
    GitHub release.
-   Apps should be **standalone**, meaning they run immediately when
    executed.
-   Use `[Nope Cheats]` tags in logs for consistent branding and cleaner
    debugging.

------------------------------------------------------------------------

## 📜 License

Released under the **MIT License**.\
© Nope Cheats

------------------------------------------------------------------------

## 📸 (Optional) Screenshots / Demo

> **Coming soon...**\
> Add screenshots, GIFs, or video demos here once the UI is finalized.

------------------------------------------------------------------------
