// ✅ iconManager.js - Handles Icon Double Click & Touch Interaction
console.log("✅ Icon Manager Loaded");

// ✅ Import functions from windowManager.js (🔥 FIXED: Now properly references existing functions)
import { openCatalogWindow, openAboutWindow, openSettingsWindow } from "./windowManager.js";

// ✅ Ensure Icon Manager is Properly Initialized
export function initializeIconManager() {
    console.log("🎨 Initializing Icon Manager...");

    document.addEventListener("dblclick", handleIconDoubleClick);
    document.addEventListener("touchstart", handleTouchStart, { passive: true });

    document.querySelectorAll(".icon").forEach(icon => {
        icon.onclick = null;
    });
}

// ✅ Handle Icon Double Click Events (Desktop)
function handleIconDoubleClick(event) {
    let icon = event.target.closest(".icon");
    if (!icon) return; 

    console.log(`🖱️ Double-click detected on: ${icon.innerText.trim()}`);

    let file = icon.getAttribute("data-file");

    if (!file) {
        console.warn("⚠️ No valid file assigned to this icon.");
        return;
    }

    console.log(`📂 Opening: ${file}`);

    // ✅ Directly call the correct function from windowManager.js
    const windowFunctions = {
        "music-catalog": openCatalogWindow,
        "settings": openSettingsWindow,
        "about": openAboutWindow
    };

    if (windowFunctions[file]) {
        console.log(`🚀 Launching ${file} window...`);
        windowFunctions[file]();
    } else {
        console.error(`❌ No function defined for ${file}`);
    }
}

// ✅ Handle Double Tap Events (Touchscreen)
let touchStartTime = 0;
function handleTouchStart(event) {
    let icon = event.target.closest(".icon");
    if (!icon) return;

    let now = Date.now();
    let timeSinceLastTap = now - touchStartTime;

    if (timeSinceLastTap < 300) { // ✅ Detect double tap within 300ms
        handleIconDoubleClick(event);
    }

    touchStartTime = now;
}

// ✅ Ensure Script Loads Properly
document.addEventListener("DOMContentLoaded", initializeIconManager);
