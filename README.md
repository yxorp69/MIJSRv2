<div align="center">

# MIJSRv2 
### by Hermes Enterprise

[![GitHub release](https://img.shields.io/github/v/release/yxorp69/MIJSRv2?style=for-the-badge)](https://github.com/yxorp69/MIJSRv2/releases)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](LICENSE)
[![jsDelivr](https://img.shields.io/badge/jsDelivr-CDN-blue?style=for-the-badge)](https://cdn.jsdelivr.net/gh/yxorp69/MIJSRv2@latest/inject.js)
[![GitHub stars](https://img.shields.io/github/stars/yxorp69/MIJSRv2?style=for-the-badge)](https://github.com/yxorp69/MIJSRv2/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yxorp69/MIJSRv2?style=for-the-badge)](https://github.com/yxorp69/MIJSRv2/network)
[![GitHub issues](https://img.shields.io/github/issues/yxorp69/MIJSRv2?style=for-the-badge)](https://github.com/yxorp69/MIJSRv2/issues)

</div>

---

## 📌 What is MIJSRv2?

**MIJSRv2** is a lightweight, in‑browser JavaScript tool that you can inject into any webpage. 
It appears as a **resizable sidebar** with a clean, modern dark interface – perfect for testing scripts, running curated mini‑apps, or debugging on the fly.

---

## ✨ Features

- **Modern, user‑friendly UI** – warm dark theme, rounded cards, and clear typography.
- **Code Editor** – write, import, and run JavaScript instantly.
- **Curated App Store** – browse and run a selection of pre‑approved apps (Hello World, Clock, Random Quote, and more). 
Each app shows a **confirmation modal** before running, so you stay in control.
- **Console** – view your logs with timestamps, filter by level (Log / Warn / Error), and clear with one click.
- **Custom Keybind** – change the toggle shortcut (default `Ctrl+Shift+M`).
- **Persistent Settings** – your preferences are saved automatically.
- **Font Awesome Icons** – with automatic emoji fallback (works even if the CDN is blocked).

---

## 📥 How to Inject

### **Bookmarklet** (drag this to your bookmarks bar or copy into a bookmark)

```javascript
javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/yxorp69/MIJSRv2@latest/inject.js';document.body.appendChild(s);})();
```

### **Console Command** (paste in your browser's dev tools)

```javascript
var s = document.createElement('script');
s.src = 'https://cdn.jsdelivr.net/gh/yxorp69/MIJSRv2@latest/inject.js';
document.body.appendChild(s);
```
> [!NOTE]
> The CDN may take a few minutes to reflect the latest version after a release.

---

## 🎮 How to Use

1. Inject the script using the bookmarklet or console.
2. The sidebar is closed by default – press Ctrl+Shift+M (or your custom keybind) to open it.
3. Explore the tabs:
   - **Code** – write or paste your JavaScript, then click Run.
   - **Import** – load a .js file from your computer.
   - **Export** – save your current code as a file.
   - **Apps** – browse the apps I’ve included; click Run to see a confirmation modal, then Approve & Run to execute.
   - **Console** – see all logs (including from the page). Use the filter dropdown to focus on specific message types, or hit Clear to reset.
   - **Settings** – change your keybind or destroy MIJSR completely (clears all stored data).
4. Resize the sidebar by dragging the left edge.

---

## 📦 Included Apps

These apps are maintained and distributed by me.

- **Hello World** – logs a friendly greeting.
- **Clock** – shows the current time.
- **Random Quote** – displays a motivational quote.
- And many more!

💡 Want to suggest a new app? Open an issue or submit a pull request – I review and approve all additions personally.

---

## 📜 License

This project is licensed under the GNU General Public License v3.0 – see the [LICENSE](LICENSE) file for details.
All rights to the project and its curated content belong to @Hermes-Enterprise and @yxorp69.

---

## 🤝 Contributing

Contributions are welcome! If you have a bug report, feature request, or a new app suggestion, please open an issue or submit a pull request.
All contributions are subject to my approval.

---

## 🙋 Need Help?

Open an issue on GitHub – I’ll get back to you as soon as I can.

---

Enjoy using MIJSRv2!
