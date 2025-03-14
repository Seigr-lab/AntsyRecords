// ✅ settings.js - Handles Settings Logic
console.log("⚙️ Settings Manager Loaded");

document.addEventListener("DOMContentLoaded", () => {
    // ✅ Ensure settings UI is available before executing
    if (!document.getElementById("settings-content")) {
        console.warn("⚠️ settings.js loaded on a page without settings UI. Skipping initialization.");
        return;
    }

    const themeSelect = document.getElementById("theme-select");
    const backgroundType = document.getElementById("background-type");
    const backgroundColorPicker = document.getElementById("background-color-picker");
    const backgroundImageUpload = document.getElementById("background-image-upload");
    const fontSizeSelect = document.getElementById("font-size");
    const iconSizeInput = document.getElementById("icon-size");
    const saveButton = document.getElementById("save-settings");
    const resetButton = document.getElementById("reset-settings");

    if (!themeSelect || !backgroundType || !fontSizeSelect || !saveButton || !resetButton || !iconSizeInput) {
        console.error("❌ Settings elements not found! Ensure settings.html is correctly structured.");
        return;
    }

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
        } else if (savedBackgroundType === "image" && savedBackgroundImage) {
            document.documentElement.style.setProperty("--desktop-bg", `url(${savedBackgroundImage})`);
        }

        fontSizeSelect.value = savedFontSize;
        document.documentElement.style.setProperty("font-size", savedFontSize === "default" ? "16px" : savedFontSize);

        iconSizeInput.value = savedIconSize;
        updateIconSize(savedIconSize);
    }

    function updateIconSize(size) {
        document.querySelectorAll(".icon").forEach(icon => {
            icon.style.width = `${size}px`;
            icon.style.height = `${size}px`;
        });
    }

    // ✅ Event Listeners for Changes
    themeSelect.addEventListener("change", () => {
        document.documentElement.setAttribute("data-theme", themeSelect.value);
    });

    backgroundType.addEventListener("change", () => {
        backgroundColorPicker.style.display = backgroundType.value === "color" ? "block" : "none";
        backgroundImageUpload.style.display = backgroundType.value === "image" ? "block" : "none";
    });

    backgroundColorPicker.addEventListener("input", () => {
        document.documentElement.style.setProperty("--desktop-bg-color", backgroundColorPicker.value);
    });

    backgroundImageUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.documentElement.style.setProperty("--desktop-bg", `url(${e.target.result})`);
                localStorage.setItem("backgroundImage", e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    fontSizeSelect.addEventListener("change", () => {
        document.documentElement.style.setProperty("font-size", fontSizeSelect.value === "default" ? "16px" : fontSizeSelect.value);
    });

    iconSizeInput.addEventListener("input", () => {
        updateIconSize(iconSizeInput.value);
    });

    // ✅ Save & Reset Buttons
    saveButton.addEventListener("click", () => {
        localStorage.setItem("theme", themeSelect.value);
        localStorage.setItem("backgroundType", backgroundType.value);
        localStorage.setItem("backgroundColor", backgroundColorPicker.value);
        localStorage.setItem("fontSize", fontSizeSelect.value);
        localStorage.setItem("iconSize", iconSizeInput.value);

        alert("✅ Settings saved successfully!");
        window.initializeIcons();
    });

    resetButton.addEventListener("click", () => {
        localStorage.clear();
        applySettings();
        alert("🔄 Settings reset to default.");
    });

    // ✅ Apply saved settings on load
    applySettings();
});
