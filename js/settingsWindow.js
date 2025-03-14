// ✅ settingsWindow.js - Manages Settings Window Creation
console.log("⚙️ Settings Window Manager Loaded");

// ✅ Ensure Proper Imports
import { initializeSettingsLogic } from "./settings.js"; 

// ✅ Open Settings Window
export function openSettingsWindow() {
    console.log("⚙️ Opening Settings Window...");

    // ✅ Prevent multiple instances
    if (document.getElementById("settings-window")) return;

    let win = document.createElement("div");
    win.id = "settings-window";
    win.classList.add("window");

    // ✅ Ensure it stays within visible screen
    const winWidth = 400;
    const winHeight = 300;
    const leftPos = Math.min(100 + Math.random() * 300, window.innerWidth - winWidth - 20);
    const topPos = Math.min(100 + Math.random() * 200, window.innerHeight - winHeight - 20);

    win.style.position = "absolute";
    win.style.left = `${Math.max(20, leftPos)}px`;
    win.style.top = `${Math.max(20, topPos)}px`;
    win.style.width = `${winWidth}px`;
    win.style.height = "auto";
    win.style.zIndex = "100";
    win.style.minWidth = "350px";
    win.style.minHeight = "250px";

    // ✅ Base window structure
    win.innerHTML = `
        <div class="window-header">
            <span>Settings</span>
            <button class="close-btn">✖</button>
        </div>
        <div class="window-content" id="settings-content">
            <p style="color: white; text-align: center;">Loading settings...</p>
        </div>
    `;

    document.getElementById("window-container").appendChild(win);

    // ✅ Dragging & Resizing
    if (typeof makeDraggable === "function") makeDraggable(win);
    if (typeof makeResizable === "function") makeResizable(win);

    win.querySelector(".close-btn").addEventListener("click", () => {
        win.remove();
    });

    // ✅ Load Settings UI
    loadSettingsContent();
}

// ✅ Load Settings UI and Apply Logic
export function loadSettingsContent() {
    fetch("windows/settings.html")
        .then(response => {
            if (!response.ok) throw new Error("❌ Failed to fetch settings.html");
            return response.text();
        })
        .then(html => {
            document.getElementById("settings-content").innerHTML = html;
            initializeSettingsLogic();
        })
        .catch(error => {
            console.error(error);
            document.getElementById("settings-content").innerHTML = `<p style="color:red;">❌ Failed to load settings.</p>`;
        });
}

// ✅ Ensure Global Access for Legacy Support
window.openSettingsWindow = openSettingsWindow;
window.loadSettingsContent = loadSettingsContent;
