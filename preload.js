const { ipcRenderer } = require("electron");

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  refreshClickableElements();
});

window.addEventListener("DOMNodeInserted", () => {
  refreshClickableElements();
});

// refreshClickableElements finds all DOM elements which can be clicked
// and adds listeners to detect mouse enter and leave events. When the user
// is hovering over a clickable element, we will get Electron to stop
// ignoring mouse events by default. When a mouse leaves a clickable element,
// we'll set the app to ignore mouse clicks once more (to let the user
// interact with background applications)
function refreshClickableElements() {
  const clickableElements = document.getElementsByClassName("clickable");
  const listeningAttr = "listeningForMouse";
  for (const ele of clickableElements) {
    // If the listeners are already set up for this element, skip it.
    if (ele.getAttribute(listeningAttr)) {
      continue;
    }
    ele.addEventListener("mouseenter", () => {
      ipcRenderer.invoke("set-ignore-mouse-events", false);
    });
    ele.addEventListener("mouseleave", () => {
      ipcRenderer.invoke("set-ignore-mouse-events", true, { forward: true });
    });
    ele.setAttribute(listeningAttr, true);
  }
}

