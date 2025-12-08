// random-quote.js — Nope Cheats
// Shows a random inspirational quote

(function() {
  const quotes = [
    "Code is like humor. When you have to explain it, it’s bad.",
    "Simplicity is the soul of efficiency.",
    "Programs must be written for people to read, and only incidentally for machines to execute.",
    "Innovation distinguishes between a leader and a follower."
  ];

  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  console.log(`[Nope Cheats] Quote of the run: "${quote}"`);
})();
