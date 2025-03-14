// ✅ dragDrop.js - Handles Drag & Drop Initialization
console.log("✅ Drag & Drop Manager Loaded");

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Initializing Drag & Drop Functionality...");

    // ✅ Ensure Drag Manager is Initialized
    if (typeof initializeDragManager === "function") {
        try {
            initializeDragManager();
            console.log("✅ Drag Manager Successfully Initialized.");
        } catch (error) {
            console.error("❌ Error initializing Drag Manager:", error);
        }
    } else {
        console.error("❌ initializeDragManager() is not defined! Dragging may not work.");
    }

    // ✅ Ensure Catalog Icon Dragging Works
    if (typeof enableCatalogIconDrag === "function") {
        try {
            enableCatalogIconDrag();
            console.log("✅ Catalog Icon Dragging Enabled.");
        } catch (error) {
            console.error("❌ Error enabling catalog icon drag:", error);
        }
    } else {
        console.warn("⚠️ enableCatalogIconDrag() is not defined! Catalog items may not be draggable.");
    }

    // ✅ Ensure Event Listeners Are Properly Attached
    document.querySelectorAll(".icon").forEach(icon => {
        if (!icon.hasAttribute("draggable")) {
            icon.setAttribute("draggable", "true");
        }
    });

    console.log("✅ Drag & Drop Fully Initialized.");
});
