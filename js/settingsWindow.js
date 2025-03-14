// ✅ settingsWindow.js - Manages Settings Window Creation
console.log("⚙️ Settings Window Manager Loaded");

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

    win.style.position = "absolute";
    win.style.left = `${Math.min(100 + Math.random() * 300, window.innerWidth - 400)}px`;
    win.style.top = `${Math.min(100 + Math.random() * 200, window.innerHeight - 300)}px`;
    win.style.width = "400px";
    win.style.height = "auto";
    win.style.zIndex = "100";

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
            contentDiv.innerHTML = `<p style="color:red;">Failed to load settings.</p>`;
        });
}

// ✅ Make globally available
window.openSettingsWindow = openSettingsWindow;
