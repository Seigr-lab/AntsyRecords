document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Drag & Drop Initialized");

    // Import Drag Manager & Ensure Icons are Draggable
    initializeDragManager();
    enableCatalogIconDrag(); // Ensure catalog items are draggable
});
