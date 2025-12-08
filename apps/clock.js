// clock.js — Nope Cheats
// Displays the current time and updates every second

(function() {
  const containerId = "mijsr-clock-app";
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.padding = "8px";
    container.style.color = "#0f0";
    container.style.fontFamily = "Consolas, monospace";
    document.body.appendChild(container);
  }

  function updateClock() {
    const now = new Date();
    container.textContent = `[Nope Cheats] Time: ${now.toLocaleTimeString()}`;
  }

  updateClock();
  setInterval(updateClock, 1000);
})();
