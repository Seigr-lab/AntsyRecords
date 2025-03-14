// ✅ windowManager.js - Modular Window Controller
console.log("✅ Window Manager Loaded");

// ✅ Import required modules
import { makeDraggable } from "./dragManager.js";
import { makeResizable } from "./resizeHandler.js";
import { loadCatalogContent } from "./catalogWindow.js";
import { loadAboutContent } from "./aboutWindow.js";
import { loadSettingsContent } from "./settingsWindow.js"; // ✅ FIXED: Properly Import Settings Content

// ✅ Track open windows
const openWindows = {};
let highestZIndex = 100;

// ✅ Ensure all windows initialize correctly (🔥 FIXED: This is exported properly)
export function initializeWindows() {
    console.log("✅ Initializing Windows...");
}

// ✅ Create a new independent window
function createWindow(id, title, width = 800, height = 600, contentLoader) {
    console.log(`🖥 Opening Window: ${title}`);

    if (openWindows[id]) {
        bringWindowToFront(openWindows[id]);
        return;
    }

    let win = document.createElement("div");
    win.id = id;
    win.classList.add("window");

    const leftPos = Math.max(20, Math.min(100 + Math.random() * 300, window.innerWidth - width - 20));
    const topPos = Math.max(20, Math.min(100 + Math.random() * 200, window.innerHeight - height - 20));

    win.style.position = "absolute";
    win.style.left = `${leftPos}px`;
    win.style.top = `${topPos}px`;
    win.style.width = `${width}px`;
    win.style.height = `${height}px`;
    win.style.zIndex = `${++highestZIndex}`;
    win.style.minWidth = "350px";
    win.style.minHeight = "250px";

    win.innerHTML = `
        <div class="window-header">
            <span>${title}</span>
            <button class="close-btn">✖</button>
        </div>
        <div class="window-content">${getLoadingMessage()}</div>
    `;

    document.getElementById("window-container").appendChild(win);
    openWindows[id] = win;

    makeDraggable(win);
    makeResizable(win);

    win.querySelector(".close-btn").addEventListener("click", () => closeWindow(id));
    bringWindowToFront(win);

    if (typeof contentLoader === "function") {
        try {
            contentLoader(win.querySelector(".window-content"));
        } catch (error) {
            console.error(`❌ Error loading content for ${id}:`, error);
            win.querySelector(".window-content").innerHTML = `<p style="color:red;">❌ Failed to load content.</p>`;
        }
    } else {
        console.error(`❌ No valid contentLoader function for ${id}`);
    }
}

// ✅ Bring window to the front
function bringWindowToFront(win) {
    highestZIndex++;
    win.style.zIndex = highestZIndex;
}

// ✅ Close window properly
function closeWindow(id) {
    if (openWindows[id]) {
        let win = openWindows[id];
        if (win.parentNode) {
            win.parentNode.removeChild(win);
        }
        delete openWindows[id];
    }
}

// ✅ Default loading message
function getLoadingMessage() {
    return `<p style="color: white;">Loading...</p>`;
}

// ✅ Open Catalog Window
export function openCatalogWindow() {
    createWindow("catalog-window", "Music Catalog", 800, 600, loadCatalogContent);
}

// ✅ Open About Window
export function openAboutWindow() {
    createWindow("about-window", "About Antsy Records", 600, 500, loadAboutContent);
}

// ✅ Open Settings Window (🔥 FIXED: Function now properly exists and is exported)
export function openSettingsWindow() {
    createWindow("settings-window", "Settings", 600, 500, loadSettingsContent);
}
