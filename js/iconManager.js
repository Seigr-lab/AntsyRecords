// ✅ iconManager.js - Handles Icon Click Interactions
console.log("✅ Icon Manager Loaded");

// ✅ Ensure Icon Manager is Properly Initialized
function initializeIconManager() {
    console.log("🎨 Initializing Icon Manager...");

    document.addEventListener("dblclick", handleIconDoubleClick);
}

// ✅ Handle Icon Double Click Events
function handleIconDoubleClick(event) {
    let icon = event.target.closest(".icon");
    if (!icon) return;

    let file = icon.getAttribute("data-file");
    let url = icon.getAttribute("data-url");

    if (url) {
        handleNavigation(url);
        return;
    }

    if (!file) {
        console.warn("⚠️ No valid file assigned to this icon.");
        return;
    }

    console.log(`📂 Opening: ${file}`);
    openWindowByFile(file);
}

// ✅ Handle Internal vs External Navigation
function handleNavigation(url) {
    if (isExternalURL(url)) {
        console.log(`🌍 Opening External Link: ${url}`);
        window.open(url, "_blank", "noopener,noreferrer");
    } else {
        console.log(`🌍 Navigating to Internal URL: ${url}`);
        window.location.href = url; // ✅ Internal links stay in the same window
    }
}

// ✅ Detect If URL is External
function isExternalURL(url) {
    try {
        let link = new URL(url, window.location.href);
        return link.hostname !== window.location.hostname;
    } catch (e) {
        return false;
    }
}

// ✅ Centralized Window Opening Logic
function openWindowByFile(file) {
    const windowFunctions = {
        "music-catalog": "openCatalogWindow",
        "settings": "openSettingsWindow",
        "about": "openAboutWindow"
    };

    if (windowFunctions[file] && typeof window[windowFunctions[file]] === "function") {
        window[windowFunctions[file]]();
    } else if (typeof window.openGenericWindow === "function") {
        window.openGenericWindow(file, file);
    } else {
        showError(`open${capitalizeFirstLetter(file)}Window()`);
    }
}

// ✅ Capitalize Function for Error Logging
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// ✅ Fallback Error Handler
function showError(functionName) {
    console.error(`❌ ${functionName} is not defined!`);
}

// ✅ Ensure Script Loads Properly
document.addEventListener("DOMContentLoaded", initializeIconManager);
