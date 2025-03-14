// ✅ iconHandler.js - Handles Icon Layout & Positioning
console.log("🎨 Initializing Desktop Icons...");

// ✅ Ensure Function is Exported
export function initializeIcons() {
    console.log("🖥 Organizing Desktop Icons...");

    const icons = document.querySelectorAll(".icon");
    const desktopContainer = document.getElementById("desktop-container");

    if (!desktopContainer) {
        console.error("❌ Desktop container not found.");
        return;
    }

    const containerWidth = desktopContainer.clientWidth;
    const containerHeight = desktopContainer.clientHeight;

    // ✅ Get user-defined icon size (Default: 80px)
    let iconSize = parseInt(localStorage.getItem("iconSize") || 80, 10);
    const padding = 20; // Minimum spacing between icons
    const columns = Math.max(1, Math.floor(containerWidth / (iconSize + padding)));

    let x = 0, y = containerHeight - iconSize - padding; // ✅ Start from bottom-left

    // ✅ Load saved icon positions (if available)
    let savedPositions = JSON.parse(localStorage.getItem("iconPositions")) || {};

    icons.forEach((icon, index) => {
        let iconId = icon.getAttribute("data-id") || `icon-${index}`;

        // ✅ Restore saved positions if available
        if (savedPositions[iconId]) {
            x = savedPositions[iconId].x;
            y = savedPositions[iconId].y;
        } else {
            // ✅ Auto-arrange in a grid layout if no saved position
            if ((index + 1) % columns === 0) {
                x = 0;
                y -= iconSize + padding; // ✅ Move up a row
            } else {
                x += iconSize + padding;
            }
        }

        icon.style.left = `${x}px`;
        icon.style.top = `${y}px`;
        icon.style.width = `${iconSize}px`;
        icon.style.height = `${iconSize}px`;

        let img = icon.querySelector("img");
        if (img) {
            img.style.width = `${iconSize}px`;
            img.style.height = `${iconSize}px`;
        }

        console.log(`📌 Positioned: ${icon.innerText.trim()} at (${x}px, ${y}px)`);

        // ✅ Save positions
        savedPositions[iconId] = { x, y };

        // ✅ Prevent overflow
        if (y < 0) {
            console.warn(`⚠️ Not enough space for all icons! Some may be hidden.`);
        }
    });

    localStorage.setItem("iconPositions", JSON.stringify(savedPositions));
}

// ✅ Ensure Script Loads Properly
document.addEventListener("DOMContentLoaded", initializeIcons);
