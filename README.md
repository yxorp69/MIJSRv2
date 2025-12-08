# MIJSRv2 by Nope Cheats

## A modular, resizable in-browser JavaScript runner with sidebar tabs for code execution, apps, console logging, and settings.

### Features

* Resizable Sidebar with vertical binder-style tabs  
* Code Tab: Write, import, and run custom JavaScript  
* Apps Tab: Load apps dynamically from `/apps/apps.json`  
* Console Tab: Filter logs, capture browser console, timestamped output  
* Settings Tab: Keybind toggle, destroy/reset sidebar, persistent settings via localStorage  
* Modular Assets:  
  * `inject.js` → main injection script  
  * `sidebar.css` → styling  
  * `/apps/apps.json` → app metadata  
  * `/apps/\*.js` → app scripts

### Installation / Injection Options

MIJSRv2 can be injected into any webpage. Two quick methods:

1. Bookmarklet Create a new bookmark in your browser and set the URL to:

`javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/yxorp69/MIJSRv2@latest/inject.js';document.body.appendChild(s);})();`

Click the bookmark on any page to inject MIJSRv2.

2. Console Command Open your browser’s developer console and paste:

`var s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/gh/yxorp69/MIJSRv2@latest/inject.js'; document.body.appendChild(s);`

This will load the sidebar immediately.

### Usage

1. Toggle Sidebar  
   * Default keybind: Ctrl+Shift+M  
   * Change it in Settings Tab.  
2. Code Tab  
   * Write or paste JavaScript in the textarea.  
   * Import .js files via the file input.  
   * Click Run Code to execute.  
3. Apps Tab  
   * Loads /apps/apps.json.  
   * Each app entry shows metadata (name, description, author, version).  
   * Approve apps with the checkbox before running.  
   * Click Run to load the app script.  
4. Console Tab  
   * Displays MIJSRv2 logs with timestamps.  
   * Optionally capture all browser logs.  
   * Filter by log type (LOG, INFO, WARN, ERROR).  
   * Clear logs with the button.  
5. Settings Tab  
   * Change toggle keybind.  
   * Override cdnBase if needed.  
   * Destroy sidebar or reset to defaults.  
   * Settings persist via localStorage.

### Example Apps

* Hello World → Prints a message to console.  
* Clock → Displays live time.  
* Random Quote → Shows a random inspirational quote.

See /apps/apps.json and /apps/\*.js for implementation.

License Released under MIT License. © Nope Cheats

