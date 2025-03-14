// ✅ settings.js - Handles Settings Logic
console.log("⚙️ Settings Manager Loaded");

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Initializing Settings...");

    // ✅ Ensure settings UI is available before executing
    const settingsContainer = document.getElementById("settings-content");
    if (!settingsContainer) {
        console.warn("⚠️ settings.js loaded on a page without settings UI. Skipping initialization.");
        return;
    }

    const themeSelect = document.getElementById("theme-select");
    const backgroundType = document.getElementById("background-type");
    const backgroundColorPicker = document.getElementById("background-color-picker");
    const backgroundImageUpload = document.getElementById("background-image-upload");
    const removeBackgroundButton = document.getElementById("remove-background");
    const fontSizeSelect = document.getElementById("font-size");
    const iconSizeInput = document.getElementById("icon-size");
    const saveButton = document.getElementById("save-settings");
    const resetButton = document.getElementById("reset-settings");

    if (!themeSelect || !backgroundType || !fontSizeSelect || !saveButton || !resetButton || !iconSizeInput) {
        console.error("❌ Settings elements not found! Ensure settings.html is correctly structured.");
        return;
    }

    let settingsChanged = false;

    // ✅ Load and Apply Settings on Page Load
    function applySettings() {
        const savedTheme = localStorage.getItem("theme") || "default";
        const savedBackgroundType = localStorage.getItem("backgroundType") || "default";
        const savedBackgroundColor = localStorage.getItem("backgroundColor") || "#222";
        const savedBackgroundImage = localStorage.getItem("backgroundImage");
        const savedFontSize = localStorage.getItem("fontSize") || "default";
        const savedIconSize = localStorage.getItem("iconSize") || 80;

        document.documentElement.setAttribute("data-theme", savedTheme);
        themeSelect.value = savedTheme;

        backgroundType.value = savedBackgroundType;
        if (savedBackgroundType === "color") {
            document.documentElement.style.setProperty("--desktop-bg-color", savedBackgroundColor);
            backgroundColorPicker.value = savedBackgroundColor;
            removeBackgroundButton.style.display = "none";
        } else if (savedBackgroundType === "image" && savedBackgroundImage) {
            document.documentElement.style.setProperty("--desktop-bg", `url(${savedBackgroundImage})`);
            removeBackgroundButton.style.display = "block";
        } else {
            removeBackgroundButton.style.display = "none";
        }

        fontSizeSelect.value = savedFontSize;
        document.documentElement.style.setProperty("font-size", savedFontSize === "default" ? "16px" : savedFontSize);

        iconSizeInput.value = savedIconSize;
        if (typeof window.updateIconSizes === "function") {
            window.updateIconSizes(savedIconSize);
        }

        settingsChanged = false;
    }

    // ✅ Event Listeners for Changes
    function trackChange() {
        settingsChanged = true;
    }

    themeSelect.addEventListener("change", trackChange);
    backgroundType.addEventListener("change", trackChange);
    backgroundColorPicker.addEventListener("input", trackChange);
    backgroundImageUpload.addEventListener("change", trackChange);
    fontSizeSelect.addEventListener("change", trackChange);
    iconSizeInput.addEventListener("input", trackChange);

    backgroundImageUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.documentElement.style.setProperty("--desktop-bg", `url(${e.target.result})`);
                localStorage.setItem("backgroundImage", e.target.result);
                removeBackgroundButton.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });

    removeBackgroundButton.addEventListener("click", () => {
        document.documentElement.style.removeProperty("--desktop-bg");
        localStorage.removeItem("backgroundImage");
        removeBackgroundButton.style.display = "none";
        settingsChanged = true;
    });

    // ✅ Save & Reset Buttons
    saveButton.addEventListener("click", () => {
        if (!settingsChanged) {
            alert("⚠️ No changes detected.");
            return;
        }

        localStorage.setItem("theme", themeSelect.value);
        localStorage.setItem("backgroundType", backgroundType.value);
        localStorage.setItem("backgroundColor", backgroundColorPicker.value);
        localStorage.setItem("fontSize", fontSizeSelect.value);
        localStorage.setItem("iconSize", iconSizeInput.value);

        alert("✅ Settings saved successfully!");
        applySettings();
    });

    resetButton.addEventListener("click", () => {
        localStorage.clear();
        applySettings();
        alert("🔄 Settings reset to default.");
    });

    // ✅ Apply saved settings on load
    applySettings();
});

// ✅ Expose Function to be Used in `settingsWindow.js`
export function initializeSettingsLogic() {
    console.log("⚙️ Applying Settings Logic...");
    applySettings();
}
