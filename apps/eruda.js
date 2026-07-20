// 1. Create a new script element
const script = document.createElement('script');

// 2. Set the source to the Eruda CDN library
script.src = "https://cdn.jsdelivr.net/npm/eruda";

// 3. Define what happens once the script finishes loading
script.onload = function() {
    eruda.init();
};

// 4. Inject the script into the webpage to execute it
document.body.appendChild(script);