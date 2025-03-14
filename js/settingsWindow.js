// ✅ settingsWindow.js - Manages Settings Window Creation
console.log("⚙️ Settings Window Manager Loaded");

import { initializeSettingsLogic } from "./settings.js"; // ✅ Import settings logic

const MAX_RETRIES = 3;
let retryCount = 0;

// ✅ Open Settings Window
export function openSettingsWindow() {
    console.log("⚙️ Opening Settings Window...");

    // ✅ Prevent multiple instances
    if (document.getElementById("settings-window")) {
        bringWindowToFront(document.getElementById("settings-window"));
        return;
    }

    // ✅ Create Settings Window
    let win = document.createElement("div");
    win.id = "settings-window";
    win.classList.add("window");

    // ✅ Ensure the window stays within the visible screen
    const winWidth = 400;
    const winHeight = 300;
    const leftPos = Math.min(100 + Math.random() * 300, window.innerWidth - winWidth);
    const topPos = Math.min(100 + Math.random() * 200, window.innerHeight - winHeight);

    win.style.position = "absolute";
    win.style.left = `${Math.max(20, leftPos)}px`;
    win.style.top = `${Math.max(20, topPos)}px`;
    win.style.width = `${winWidth}px`;
    win.style.height = "auto";
    win.style.zIndex = "100";
    win.style.minWidth = "350px"; // ✅ Prevents shrinking too much
    win.style.minHeight = "250px"; // ✅ Prevents window from being too small

    win.innerHTML = `
        <div class="window-header">
            <span>Settings</span>
            <button class="close-btn">✖</button>
        </div>
        <div class="window-content" id="settings-content">
            <p style="color: red;">Loading settings...</p>
        </div>
    `;

    document.getElementById("window-container").appendChild(win);

    bringWindowToFront(win);
    makeDraggable(win);
    makeResizable(win);

    win.querySelector(".close-btn").addEventListener("click", () => {
        win.remove();
    });

    // ✅ Load settings UI content dynamically
    loadSettingsContent(document.getElementById("settings-content"));
}

// ✅ Load Settings HTML and Apply JavaScript Logic
function loadSettingsContent(contentDiv) {
    fetch("windows/settings.html")
        .then(response => response.text())
        .then(html => {
            contentDiv.innerHTML = html;
            initializeSettingsLogic(); // ✅ Ensure settings logic is applied
        })
        .catch(() => {
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                console.warn(`🔄 Retrying to load settings... (${retryCount}/${MAX_RETRIES})`);
                setTimeout(() => loadSettingsContent(contentDiv), 2000);
            } else {
                contentDiv.innerHTML = `<p style="color:red;">❌ Failed to load settings.</p>`;
            }
        });
}

// ✅ Make globally available
window.openSettingsWindow = openSettingsWindow;
