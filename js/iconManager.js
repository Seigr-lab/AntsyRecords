// ✅ iconManager.js - Handles Icon Click Interactions
console.log("✅ Icon Manager Loaded");

document.addEventListener("DOMContentLoaded", () => {
    console.log("🎨 Initializing Icon Manager...");

    const icons = document.querySelectorAll(".icon");

    icons.forEach(icon => {
        let file = icon.getAttribute("data-file");
        let url = icon.getAttribute("data-url");

        if (url) {
            // ✅ External Links
            console.log(`🌐 Setting up link for: ${url}`);
            icon.addEventListener("dblclick", () => {
                console.log(`🌍 Navigating to: ${url}`);
                window.location.href = url;
            });
            return;
        }

        // ✅ Handle Window Opening Dynamically
        icon.addEventListener("dblclick", () => {
            console.log(`📂 Opening: ${file}`);

            if (!file) {
                console.warn("⚠️ No valid file assigned to this icon.");
                return;
            }

            switch (file) {
                case "music-catalog":
                    window.openCatalogWindow?.() || console.error("❌ openCatalogWindow() is not defined!");
                    break;
                case "settings":
                    window.openSettingsWindow?.() || console.error("❌ openSettingsWindow() is not defined!");
                    break;
                case "about":
                    window.openAboutWindow?.() || console.error("❌ openAboutWindow() is not defined!");
                    break;
                default:
                    window.openGenericWindow?.(file, file) || console.error("❌ openGenericWindow() is not defined!");
            }
        });
    });
});
